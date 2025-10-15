// Message Editing System
// Allows users to edit their own messages and admins to edit any message

/**
 * Create edit message modal
 * @param {string} currentContent - Current message content
 * @param {Function} onSave - Callback when save is clicked
 * @param {Function} onCancel - Callback when cancel is clicked
 * @returns {HTMLElement} - Modal element
 */
export function createEditMessageModal(currentContent, onSave, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content card max-w-2xl">
            <h2 class="text-2xl font-bold mb-4">Edit Message</h2>
            <form id="edit-message-form" class="space-y-4">
                <textarea 
                    id="edit-message-textarea" 
                    class="input-field w-full" 
                    rows="4" 
                    required
                    maxlength="2000"
                >${currentContent}</textarea>
                <div class="text-sm text-gray-400 text-right">
                    <span id="char-count">${currentContent.length}</span>/2000
                </div>
                <div class="flex gap-4">
                    <button type="submit" class="neon-button flex-1">
                        <i class="ph ph-check"></i>
                        Save Changes
                    </button>
                    <button type="button" id="cancel-edit" class="secondary-button flex-1">
                        <i class="ph ph-x"></i>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    const form = modal.querySelector('#edit-message-form');
    const textarea = modal.querySelector('#edit-message-textarea');
    const charCount = modal.querySelector('#char-count');
    const cancelBtn = modal.querySelector('#cancel-edit');
    
    // Update character count
    textarea.addEventListener('input', () => {
        charCount.textContent = textarea.value.length;
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newContent = textarea.value.trim();
        if (newContent && newContent !== currentContent) {
            onSave(newContent);
        }
        modal.remove();
    });
    
    // Handle cancel
    cancelBtn.addEventListener('click', () => {
        if (onCancel) onCancel();
        modal.remove();
    });
    
    // Handle click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            if (onCancel) onCancel();
            modal.remove();
        }
    });
    
    return modal;
}

/**
 * Edit message in Firestore
 * @param {Object} db - Firestore database instance
 * @param {string} collectionPath - Path to messages collection
 * @param {string} messageId - Message ID
 * @param {string} newContent - New message content
 * @returns {Promise<void>}
 */
export async function editMessage(db, collectionPath, messageId, newContent) {
    try {
        const { doc, updateDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");
        
        await updateDoc(doc(db, collectionPath, messageId), {
            content: newContent,
            edited: true,
            editedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error editing message:", error);
        throw error;
    }
}

/**
 * Add edit indicator to message HTML
 * @param {Object} message - Message data
 * @returns {string} - HTML for edit indicator
 */
export function getEditIndicatorHTML(message) {
    if (!message.edited) return '';
    
    const editedTime = message.editedAt ? 
        new Date(message.editedAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
        '';
    
    return `<span class="text-xs text-gray-500 ml-2">(edited${editedTime ? ' ' + editedTime : ''})</span>`;
}

/**
 * Setup message editing for a container
 * @param {HTMLElement} container - Container with messages
 * @param {Object} db - Firestore database instance
 * @param {string} collectionPath - Path to messages collection
 * @param {string} currentUserId - Current user's ID
 * @param {boolean} isAdmin - Whether current user is admin
 */
export function setupMessageEditing(container, db, collectionPath, currentUserId, isAdmin) {
    container.addEventListener('click', async (e) => {
        const editBtn = e.target.closest('.edit-message-btn');
        if (!editBtn) return;
        
        const messageElement = editBtn.closest('[data-id]');
        if (!messageElement) return;
        
        const messageId = messageElement.dataset.id;
        const contentElement = messageElement.querySelector('.message-content');
        if (!contentElement) return;
        
        const currentContent = contentElement.textContent.trim();
        
        const modal = createEditMessageModal(
            currentContent,
            async (newContent) => {
                try {
                    await editMessage(db, collectionPath, messageId, newContent);
                } catch (error) {
                    alert('Failed to edit message. Please try again.');
                }
            },
            null
        );
        
        document.body.appendChild(modal);
    });
}

/**
 * Add edit button to message HTML (if user can edit)
 * @param {Object} message - Message data
 * @param {string} currentUserId - Current user's ID
 * @param {boolean} isAdmin - Whether current user is admin
 * @returns {string} - HTML for edit button
 */
export function getEditButtonHTML(message, currentUserId, isAdmin) {
    const canEdit = isAdmin || message.authorId === currentUserId;
    if (!canEdit) return '';
    
    return `
        <button class="edit-message-btn text-gray-400 hover:text-blue-400 transition-colors ml-2">
            <i class="ph ph-pencil text-sm"></i>
        </button>
    `;
}
