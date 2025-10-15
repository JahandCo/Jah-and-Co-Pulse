// User Mentions System
// Allows users to mention other users with @username

/**
 * Parse content and convert mentions to HTML
 * @param {string} content - Raw message content
 * @returns {string} - HTML with mentions highlighted
 */
export function parseMentions(content) {
    // Match @username patterns (letters, numbers, underscores, and hyphens)
    const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
    
    return content.replace(mentionRegex, (match, username) => {
        return `<span class="mention text-accent-purple font-bold cursor-pointer hover:underline" data-username="${username}">@${username}</span>`;
    });
}

/**
 * Extract mentions from content
 * @param {string} content - Message content
 * @returns {Array<string>} - Array of mentioned usernames (without @)
 */
export function extractMentions(content) {
    const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(content)) !== null) {
        if (!mentions.includes(match[1])) {
            mentions.push(match[1]);
        }
    }
    
    return mentions;
}

/**
 * Search users for mention autocomplete
 * @param {Object} db - Firestore database instance
 * @param {string} query - Search query
 * @param {number} limit - Maximum results
 * @returns {Promise<Array>} - Array of user objects
 */
export async function searchUsersForMention(db, query, limit = 5) {
    try {
        const { collection, query: firestoreQuery, where, orderBy, limit: limitQuery, getDocs } = 
            await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");
        
        // Search by display name (you may need to adjust based on your data structure)
        const usersRef = collection(db, "users");
        const q = firestoreQuery(
            usersRef,
            where("displayName", ">=", query),
            where("displayName", "<=", query + '\uf8ff'),
            limitQuery(limit)
        );
        
        const snapshot = await getDocs(q);
        const users = [];
        
        snapshot.forEach(doc => {
            users.push({
                id: doc.id,
                displayName: doc.data().displayName
            });
        });
        
        return users;
    } catch (error) {
        console.error("Error searching users:", error);
        return [];
    }
}

/**
 * Create mention autocomplete dropdown
 * @param {Array} users - Array of user objects
 * @param {Function} onSelect - Callback when user is selected
 * @returns {HTMLElement} - Autocomplete dropdown element
 */
export function createMentionAutocomplete(users, onSelect) {
    const dropdown = document.createElement('div');
    dropdown.className = 'mention-autocomplete absolute bottom-full mb-2 bg-gray-900 border-2 border-purple-500 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto';
    
    if (users.length === 0) {
        dropdown.innerHTML = '<div class="px-4 py-2 text-gray-400 text-sm">No users found</div>';
        return dropdown;
    }
    
    dropdown.innerHTML = users.map((user, index) => `
        <div class="mention-item px-4 py-2 hover:bg-purple-900/50 cursor-pointer transition-colors ${index === 0 ? 'bg-purple-900/30' : ''}" 
             data-username="${user.displayName}"
             data-index="${index}">
            <i class="ph ph-user-circle text-main-purple mr-2"></i>
            <span class="font-bold">${user.displayName}</span>
        </div>
    `).join('');
    
    // Handle item selection
    dropdown.addEventListener('click', (e) => {
        const item = e.target.closest('.mention-item');
        if (item) {
            const username = item.dataset.username;
            onSelect(username);
        }
    });
    
    return dropdown;
}

/**
 * Setup mention autocomplete for a textarea
 * @param {HTMLTextAreaElement} textarea - Textarea element
 * @param {Object} db - Firestore database instance
 */
export function setupMentionAutocomplete(textarea, db) {
    let autocompleteDropdown = null;
    let currentMentionStart = -1;
    let selectedIndex = 0;
    
    textarea.addEventListener('input', async (e) => {
        const cursorPos = textarea.selectionStart;
        const textBeforeCursor = textarea.value.substring(0, cursorPos);
        
        // Check if we're typing a mention
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');
        
        if (lastAtIndex !== -1) {
            const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
            
            // Only show autocomplete if there's no space after @
            if (!textAfterAt.includes(' ') && textAfterAt.length >= 0) {
                currentMentionStart = lastAtIndex;
                
                // Search for users
                const users = await searchUsersForMention(db, textAfterAt, 5);
                
                if (users.length > 0) {
                    // Remove old dropdown if exists
                    if (autocompleteDropdown) {
                        autocompleteDropdown.remove();
                    }
                    
                    // Create new dropdown
                    autocompleteDropdown = createMentionAutocomplete(users, (username) => {
                        // Replace the @query with @username
                        const before = textarea.value.substring(0, currentMentionStart);
                        const after = textarea.value.substring(cursorPos);
                        textarea.value = before + '@' + username + ' ' + after;
                        
                        // Remove dropdown
                        if (autocompleteDropdown) {
                            autocompleteDropdown.remove();
                            autocompleteDropdown = null;
                        }
                        
                        // Set cursor after mention
                        const newCursorPos = currentMentionStart + username.length + 2;
                        textarea.setSelectionRange(newCursorPos, newCursorPos);
                        textarea.focus();
                    });
                    
                    // Position dropdown above textarea
                    const parent = textarea.parentElement;
                    parent.style.position = 'relative';
                    parent.appendChild(autocompleteDropdown);
                    selectedIndex = 0;
                } else if (autocompleteDropdown) {
                    autocompleteDropdown.remove();
                    autocompleteDropdown = null;
                }
            } else if (autocompleteDropdown) {
                autocompleteDropdown.remove();
                autocompleteDropdown = null;
            }
        } else if (autocompleteDropdown) {
            autocompleteDropdown.remove();
            autocompleteDropdown = null;
        }
    });
    
    // Handle keyboard navigation
    textarea.addEventListener('keydown', (e) => {
        if (!autocompleteDropdown) return;
        
        const items = autocompleteDropdown.querySelectorAll('.mention-item');
        if (items.length === 0) return;
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelectedItem(items, selectedIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateSelectedItem(items, selectedIndex);
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            if (autocompleteDropdown && items[selectedIndex]) {
                e.preventDefault();
                items[selectedIndex].click();
            }
        } else if (e.key === 'Escape') {
            if (autocompleteDropdown) {
                autocompleteDropdown.remove();
                autocompleteDropdown = null;
            }
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (autocompleteDropdown && !autocompleteDropdown.contains(e.target) && e.target !== textarea) {
            autocompleteDropdown.remove();
            autocompleteDropdown = null;
        }
    });
}

/**
 * Update selected item in autocomplete
 * @param {NodeList} items - List of menu items
 * @param {number} index - Index to select
 */
function updateSelectedItem(items, index) {
    items.forEach((item, i) => {
        if (i === index) {
            item.classList.add('bg-purple-900/30');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('bg-purple-900/30');
        }
    });
}

/**
 * Send notification to mentioned users
 * @param {Object} db - Firestore database instance
 * @param {Array<string>} mentions - Array of mentioned usernames
 * @param {string} messageUrl - URL to the message
 * @param {string} authorName - Name of message author
 * @returns {Promise<void>}
 */
export async function notifyMentionedUsers(db, mentions, messageUrl, authorName) {
    try {
        const { collection, addDoc, serverTimestamp, query, where, getDocs } = 
            await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");
        
        for (const username of mentions) {
            // Find user by display name
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("displayName", "==", username));
            const snapshot = await getDocs(q);
            
            snapshot.forEach(async (doc) => {
                // Create notification
                await addDoc(collection(db, "notifications"), {
                    userId: doc.id,
                    type: 'mention',
                    message: `${authorName} mentioned you in a message`,
                    url: messageUrl,
                    read: false,
                    createdAt: serverTimestamp()
                });
            });
        }
    } catch (error) {
        console.error("Error notifying mentioned users:", error);
    }
}
