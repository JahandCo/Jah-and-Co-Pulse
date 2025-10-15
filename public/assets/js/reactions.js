// Emoji Reactions System
// Allows users to react to posts and messages with emoji

/**
 * Available emoji reactions
 */
export const REACTIONS = {
    LIKE: '❤️',
    LOVE: '😍',
    LAUGH: '😂',
    WOW: '😮',
    SAD: '😢',
    ANGRY: '😠',
    FIRE: '🔥',
    THUMBS_UP: '👍',
    THUMBS_DOWN: '👎',
    CLAP: '👏',
    STAR: '⭐',
    SPARKLES: '✨'
};

/**
 * Reaction display names
 */
export const REACTION_NAMES = {
    [REACTIONS.LIKE]: 'Like',
    [REACTIONS.LOVE]: 'Love',
    [REACTIONS.LAUGH]: 'Laugh',
    [REACTIONS.WOW]: 'Wow',
    [REACTIONS.SAD]: 'Sad',
    [REACTIONS.ANGRY]: 'Angry',
    [REACTIONS.FIRE]: 'Fire',
    [REACTIONS.THUMBS_UP]: 'Thumbs Up',
    [REACTIONS.THUMBS_DOWN]: 'Thumbs Down',
    [REACTIONS.CLAP]: 'Clap',
    [REACTIONS.STAR]: 'Star',
    [REACTIONS.SPARKLES]: 'Sparkles'
};

/**
 * Create reaction picker HTML
 * @returns {string} - HTML for reaction picker
 */
export function createReactionPickerHTML() {
    const reactions = Object.values(REACTIONS);
    const reactionButtons = reactions.map(emoji => 
        `<button class="reaction-btn hover:scale-125 transition-transform text-2xl p-2" data-emoji="${emoji}" title="${REACTION_NAMES[emoji]}">${emoji}</button>`
    ).join('');
    
    return `
        <div class="reaction-picker absolute bottom-full mb-2 bg-gray-900 border-2 border-purple-500 rounded-lg p-2 shadow-lg z-50 grid grid-cols-6 gap-1">
            ${reactionButtons}
        </div>
    `;
}

/**
 * Add reaction to a post or message
 * @param {Object} db - Firestore database instance
 * @param {string} collectionPath - Path to the collection (e.g., 'posts', 'channels/channelId/messages')
 * @param {string} docId - Document ID
 * @param {string} emoji - Emoji to react with
 * @param {string} userId - User ID
 * @param {string} userName - User display name
 * @returns {Promise<void>}
 */
export async function addReaction(db, collectionPath, docId, emoji, userId, userName) {
    try {
        const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");
        
        // Create a unique reaction ID based on user and emoji
        const reactionId = `${userId}_${emoji}`;
        const reactionPath = `${collectionPath}/${docId}/reactions/${reactionId}`;
        
        await setDoc(doc(db, reactionPath), {
            emoji,
            userId,
            userName,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding reaction:", error);
        throw error;
    }
}

/**
 * Remove reaction from a post or message
 * @param {Object} db - Firestore database instance
 * @param {string} collectionPath - Path to the collection
 * @param {string} docId - Document ID
 * @param {string} emoji - Emoji to remove
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export async function removeReaction(db, collectionPath, docId, emoji, userId) {
    try {
        const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");
        
        const reactionId = `${userId}_${emoji}`;
        const reactionPath = `${collectionPath}/${docId}/reactions/${reactionId}`;
        
        await deleteDoc(doc(db, reactionPath));
    } catch (error) {
        console.error("Error removing reaction:", error);
        throw error;
    }
}

/**
 * Get reactions for a post or message
 * @param {Object} db - Firestore database instance
 * @param {string} collectionPath - Path to the collection
 * @param {string} docId - Document ID
 * @returns {Promise<Object>} - Object with emoji as keys and counts as values
 */
export async function getReactions(db, collectionPath, docId) {
    try {
        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");
        
        const reactionsPath = `${collectionPath}/${docId}/reactions`;
        const reactionsSnapshot = await getDocs(collection(db, reactionsPath));
        
        const reactionCounts = {};
        const userReactions = {};
        
        reactionsSnapshot.forEach(doc => {
            const data = doc.data();
            reactionCounts[data.emoji] = (reactionCounts[data.emoji] || 0) + 1;
            
            if (!userReactions[data.emoji]) {
                userReactions[data.emoji] = [];
            }
            userReactions[data.emoji].push(data.userName);
        });
        
        return { reactionCounts, userReactions };
    } catch (error) {
        console.error("Error getting reactions:", error);
        return { reactionCounts: {}, userReactions: {} };
    }
}

/**
 * Create reactions display HTML
 * @param {Object} reactionCounts - Object with emoji as keys and counts as values
 * @param {Object} userReactions - Object with emoji as keys and user names array as values
 * @param {string} currentUserId - Current user's ID
 * @returns {string} - HTML for reactions display
 */
export function createReactionsDisplayHTML(reactionCounts, userReactions, currentUserId) {
    if (Object.keys(reactionCounts).length === 0) {
        return '';
    }
    
    const reactionsHTML = Object.entries(reactionCounts).map(([emoji, count]) => {
        const users = userReactions[emoji] || [];
        const userList = users.slice(0, 5).join(', ') + (users.length > 5 ? ` and ${users.length - 5} more` : '');
        const title = `${REACTION_NAMES[emoji]}: ${userList}`;
        
        return `
            <button class="reaction-display flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-900/30 hover:bg-purple-900/50 transition-colors" 
                    data-emoji="${emoji}" 
                    title="${title}">
                <span class="text-lg">${emoji}</span>
                <span class="text-sm font-bold">${count}</span>
            </button>
        `;
    }).join('');
    
    return `
        <div class="reactions-container flex flex-wrap gap-2 mt-2">
            ${reactionsHTML}
        </div>
    `;
}

/**
 * Setup reaction listeners for a container
 * @param {HTMLElement} container - Container element
 * @param {Object} db - Firestore database instance
 * @param {string} collectionPath - Collection path
 * @param {string} userId - Current user ID
 * @param {string} userName - Current user display name
 */
export function setupReactionListeners(container, db, collectionPath, userId, userName) {
    container.addEventListener('click', async (e) => {
        // Handle reaction picker button click
        const pickerBtn = e.target.closest('.show-reaction-picker');
        if (pickerBtn) {
            const picker = pickerBtn.nextElementSibling;
            if (picker && picker.classList.contains('reaction-picker')) {
                picker.classList.toggle('hidden');
            }
        }
        
        // Handle reaction selection
        const reactionBtn = e.target.closest('.reaction-btn');
        if (reactionBtn) {
            const emoji = reactionBtn.dataset.emoji;
            const postElement = reactionBtn.closest('[data-id]');
            const docId = postElement?.dataset.id;
            
            if (docId) {
                try {
                    await addReaction(db, collectionPath, docId, emoji, userId, userName);
                    // Hide picker after selection
                    const picker = reactionBtn.closest('.reaction-picker');
                    if (picker) picker.classList.add('hidden');
                } catch (error) {
                    console.error("Error adding reaction:", error);
                }
            }
        }
        
        // Handle clicking existing reaction to toggle
        const reactionDisplay = e.target.closest('.reaction-display');
        if (reactionDisplay) {
            const emoji = reactionDisplay.dataset.emoji;
            const postElement = reactionDisplay.closest('[data-id]');
            const docId = postElement?.dataset.id;
            
            if (docId) {
                try {
                    // Check if user already reacted with this emoji
                    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");
                    const reactionId = `${userId}_${emoji}`;
                    const reactionPath = `${collectionPath}/${docId}/reactions/${reactionId}`;
                    const reactionDoc = await getDoc(doc(db, reactionPath));
                    
                    if (reactionDoc.exists()) {
                        await removeReaction(db, collectionPath, docId, emoji, userId);
                    } else {
                        await addReaction(db, collectionPath, docId, emoji, userId, userName);
                    }
                } catch (error) {
                    console.error("Error toggling reaction:", error);
                }
            }
        }
    });
    
    // Close picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.reaction-picker') && !e.target.closest('.show-reaction-picker')) {
            container.querySelectorAll('.reaction-picker').forEach(picker => {
                picker.classList.add('hidden');
            });
        }
    });
}
