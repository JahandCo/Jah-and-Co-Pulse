// File Upload System
// Handles image and video uploads to Firebase Storage

/**
 * File type validation
 */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {Object} - {valid: boolean, error: string}
 */
export function validateFile(file, maxSize = MAX_IMAGE_SIZE) {
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }
    
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    
    if (!isImage && !isVideo) {
        return { valid: false, error: 'Invalid file type. Only images and videos are allowed.' };
    }
    
    if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
        return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
    }
    
    return { valid: true, error: null };
}

/**
 * Upload file to Firebase Storage
 * @param {Object} storage - Firebase Storage instance
 * @param {File} file - File to upload
 * @param {string} path - Storage path (e.g., 'chatAttachments/channelId/messageId')
 * @param {Function} onProgress - Progress callback function(percent)
 * @returns {Promise<string>} - Download URL of uploaded file
 */
export async function uploadFile(storage, file, path, onProgress = null) {
    try {
        const { ref, uploadBytesResumable, getDownloadURL } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js");
        
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `${path}/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (onProgress) {
                        onProgress(progress);
                    }
                },
                (error) => {
                    console.error("Upload error:", error);
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

/**
 * Create file input element
 * @param {boolean} allowVideo - Whether to allow video uploads
 * @returns {HTMLInputElement} - File input element
 */
export function createFileInput(allowVideo = true) {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    
    const acceptTypes = [...ALLOWED_IMAGE_TYPES];
    if (allowVideo) {
        acceptTypes.push(...ALLOWED_VIDEO_TYPES);
    }
    input.accept = acceptTypes.join(',');
    
    return input;
}

/**
 * Create upload progress indicator HTML
 * @param {number} progress - Progress percentage (0-100)
 * @returns {string} - HTML for progress indicator
 */
export function createProgressHTML(progress) {
    return `
        <div class="upload-progress bg-purple-900/30 rounded-lg p-4 mb-4">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-300">Uploading...</span>
                <span class="text-sm font-bold text-main-purple">${Math.round(progress)}%</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="bg-gradient-to-r from-main-purple to-accent-purple h-2 rounded-full transition-all duration-300" 
                     style="width: ${progress}%"></div>
            </div>
        </div>
    `;
}

/**
 * Create file preview HTML
 * @param {string} fileURL - URL of the file
 * @param {string} fileType - MIME type of the file
 * @returns {string} - HTML for file preview
 */
export function createFilePreviewHTML(fileURL, fileType) {
    if (ALLOWED_IMAGE_TYPES.includes(fileType)) {
        return `<img src="${fileURL}" class="max-w-full rounded-lg mt-2" alt="Uploaded image">`;
    } else if (ALLOWED_VIDEO_TYPES.includes(fileType)) {
        return `<video controls src="${fileURL}" class="max-w-full rounded-lg mt-2"></video>`;
    }
    return '';
}

/**
 * Setup file upload for a form
 * @param {HTMLElement} form - Form element
 * @param {HTMLElement} attachButton - Attach file button
 * @param {Object} storage - Firebase Storage instance
 * @param {string} storagePath - Base storage path
 * @param {Function} onFileUploaded - Callback when file is uploaded (receives URL and type)
 * @param {number} maxSize - Maximum file size
 */
export function setupFileUpload(form, attachButton, storage, storagePath, onFileUploaded, maxSize = MAX_IMAGE_SIZE) {
    const fileInput = createFileInput(true);
    form.appendChild(fileInput);
    
    let uploadedFileURL = null;
    let uploadedFileType = null;
    let progressIndicator = null;
    
    attachButton.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.click();
    });
    
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const validation = validateFile(file, maxSize);
        if (!validation.valid) {
            alert(validation.error);
            fileInput.value = '';
            return;
        }
        
        try {
            // Create progress indicator
            progressIndicator = document.createElement('div');
            progressIndicator.innerHTML = createProgressHTML(0);
            form.insertBefore(progressIndicator, form.firstChild);
            
            // Upload file
            const fileURL = await uploadFile(storage, file, storagePath, (progress) => {
                progressIndicator.innerHTML = createProgressHTML(progress);
            });
            
            uploadedFileURL = fileURL;
            uploadedFileType = file.type;
            
            // Show preview
            progressIndicator.innerHTML = createFilePreviewHTML(fileURL, file.type);
            
            // Callback
            if (onFileUploaded) {
                onFileUploaded(fileURL, file.type);
            }
            
        } catch (error) {
            console.error("File upload error:", error);
            alert('Failed to upload file. Please try again.');
            if (progressIndicator) {
                progressIndicator.remove();
            }
        }
        
        fileInput.value = '';
    });
    
    // Return function to get uploaded file info
    return {
        getFileInfo: () => ({
            url: uploadedFileURL,
            type: uploadedFileType
        }),
        clearFile: () => {
            uploadedFileURL = null;
            uploadedFileType = null;
            if (progressIndicator) {
                progressIndicator.remove();
                progressIndicator = null;
            }
        }
    };
}

/**
 * Delete file from Firebase Storage
 * @param {Object} storage - Firebase Storage instance
 * @param {string} fileURL - URL of the file to delete
 * @returns {Promise<void>}
 */
export async function deleteFile(storage, fileURL) {
    try {
        const { ref, deleteObject } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js");
        const fileRef = ref(storage, fileURL);
        await deleteObject(fileRef);
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
}
