// Admin Configuration
// This file contains the list of admin user IDs (UIDs) for the Pulse application
// 
// Security Note: This is a client-side check for UI purposes only.
// Always implement server-side security rules in Firebase to enforce admin privileges.
//
// To add a new admin:
// 1. Get the user's UID from Firebase Authentication
// 2. Add the UID to the ADMIN_UIDS array below
// 3. Optionally add their display name to ADMIN_DISPLAY_NAMES for reference

/**
 * Array of Firebase Authentication UIDs that have admin privileges
 * Add new admin UIDs to this array
 */
export const ADMIN_UIDS = [
    // Example: 'abc123xyz456def789ghi',
    'ciI8EAWyBVfqJMvVUdbmmX8Uy9e2',
    // Add actual admin UIDs here
];

/**
 * Map of admin UIDs to their display names (for reference only)
 * This is optional and used for documentation purposes
 */
export const ADMIN_DISPLAY_NAMES = {
    // Example: 'abc123xyz456def789ghi': 'Jah and Co',
    'ciI8EAWyBVfqJMvVUdbmmX8Uy9e2': 'Jah and Co Admin',
    // Add mappings here
};

/**
 * Legacy admin display name for backward compatibility
 * Users with this display name are also considered admins
 */
export const LEGACY_ADMIN_DISPLAY_NAME = "Jah and Co";

/**
 * Check if a user is an admin based on their UID or display name
 * @param {Object} user - Firebase user object with uid and displayName
 * @returns {boolean} - True if user is an admin
 */
export function isAdmin(user) {
    if (!user) return false;
    
    // Check if user's UID is in the admin list
    if (ADMIN_UIDS.includes(user.uid)) {
        return true;
    }
    
    // Fallback to legacy display name check for backward compatibility
    if (user.displayName === LEGACY_ADMIN_DISPLAY_NAME) {
        return true;
    }
    
    return false;
}

/**
 * Get the admin display name for a UID
 * @param {string} uid - Firebase user UID
 * @returns {string|null} - Display name if found, null otherwise
 */
export function getAdminDisplayName(uid) {
    return ADMIN_DISPLAY_NAMES[uid] || null;
}

/**
 * Add a new admin UID at runtime (for development/testing only)
 * In production, edit this file directly
 * @param {string} uid - Firebase user UID to add as admin
 * @param {string} displayName - Optional display name for reference
 */
export function addAdminUID(uid, displayName = null) {
    if (!ADMIN_UIDS.includes(uid)) {
        ADMIN_UIDS.push(uid);
        console.log(`Added admin UID: ${uid}`);
    }
    
    if (displayName) {
        ADMIN_DISPLAY_NAMES[uid] = displayName;
        console.log(`Set display name for ${uid}: ${displayName}`);
    }
}

/**
 * Remove an admin UID at runtime (for development/testing only)
 * @param {string} uid - Firebase user UID to remove from admin list
 */
export function removeAdminUID(uid) {
    const index = ADMIN_UIDS.indexOf(uid);
    if (index > -1) {
        ADMIN_UIDS.splice(index, 1);
        delete ADMIN_DISPLAY_NAMES[uid];
        console.log(`Removed admin UID: ${uid}`);
    }
}

/**
 * Get all admin UIDs
 * @returns {Array<string>} - Array of admin UIDs
 */
export function getAllAdminUIDs() {
    return [...ADMIN_UIDS];
}

/**
 * Check if admin configuration is empty
 * @returns {boolean} - True if no admin UIDs are configured
 */
export function isAdminConfigEmpty() {
    return ADMIN_UIDS.length === 0;
}
