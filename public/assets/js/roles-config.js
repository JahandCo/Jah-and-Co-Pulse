// User Roles Configuration
// This file defines the different user roles and their permissions in the Pulse application

/**
 * Available user roles in the system
 */
export const USER_ROLES = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    VIP: 'vip',
    USER: 'user'
};

/**
 * Role display names for UI
 */
export const ROLE_DISPLAY_NAMES = {
    [USER_ROLES.ADMIN]: 'Admin',
    [USER_ROLES.MODERATOR]: 'Moderator',
    [USER_ROLES.VIP]: 'VIP Member',
    [USER_ROLES.USER]: 'Member'
};

/**
 * Role badge colors for visual distinction
 */
export const ROLE_COLORS = {
    [USER_ROLES.ADMIN]: 'text-admin-gold', // Gold animated
    [USER_ROLES.MODERATOR]: 'text-blue-400', // Blue
    [USER_ROLES.VIP]: 'text-purple-400', // Purple
    [USER_ROLES.USER]: 'text-gray-300' // Default
};

/**
 * Role permissions - defines what each role can do
 */
export const ROLE_PERMISSIONS = {
    [USER_ROLES.ADMIN]: {
        canDeleteAnyPost: true,
        canEditAnyPost: true,
        canDeleteAnyMessage: true,
        canEditAnyMessage: true,
        canCreateGroups: true,
        canCreateChannels: true,
        canDeleteChannels: true,
        canAssignRoles: true,
        canBanUsers: true,
        canViewAdminLogs: true,
        canUploadFiles: true,
        maxFileSize: 50 * 1024 * 1024, // 50MB
        canAccessAllGroups: true
    },
    [USER_ROLES.MODERATOR]: {
        canDeleteAnyPost: true,
        canEditAnyPost: false,
        canDeleteAnyMessage: true,
        canEditAnyMessage: false,
        canCreateGroups: false,
        canCreateChannels: false,
        canDeleteChannels: false,
        canAssignRoles: false,
        canBanUsers: true,
        canViewAdminLogs: false,
        canUploadFiles: true,
        maxFileSize: 25 * 1024 * 1024, // 25MB
        canAccessAllGroups: false
    },
    [USER_ROLES.VIP]: {
        canDeleteAnyPost: false,
        canEditAnyPost: false,
        canDeleteAnyMessage: false,
        canEditAnyMessage: false,
        canCreateGroups: false,
        canCreateChannels: false,
        canDeleteChannels: false,
        canAssignRoles: false,
        canBanUsers: false,
        canViewAdminLogs: false,
        canUploadFiles: true,
        maxFileSize: 20 * 1024 * 1024, // 20MB
        canAccessAllGroups: false
    },
    [USER_ROLES.USER]: {
        canDeleteAnyPost: false,
        canEditAnyPost: false,
        canDeleteAnyMessage: false,
        canEditAnyMessage: false,
        canCreateGroups: false,
        canCreateChannels: false,
        canDeleteChannels: false,
        canAssignRoles: false,
        canBanUsers: false,
        canViewAdminLogs: false,
        canUploadFiles: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        canAccessAllGroups: false
    }
};

/**
 * Get user role from Firestore
 * @param {Object} db - Firestore database instance
 * @param {string} userId - User ID
 * @returns {Promise<string>} - User role (defaults to 'user')
 */
export async function getUserRole(db, userId) {
    try {
        const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");
        const userRoleDoc = await getDoc(doc(db, "userRoles", userId));
        
        if (userRoleDoc.exists()) {
            return userRoleDoc.data().role || USER_ROLES.USER;
        }
        
        return USER_ROLES.USER;
    } catch (error) {
        console.error("Error fetching user role:", error);
        return USER_ROLES.USER;
    }
}

/**
 * Check if user has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission name
 * @returns {boolean} - True if user has permission
 */
export function hasPermission(role, permission) {
    const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[USER_ROLES.USER];
    return permissions[permission] || false;
}

/**
 * Get role badge HTML for display
 * @param {string} role - User role
 * @returns {string} - HTML for role badge
 */
export function getRoleBadgeHTML(role) {
    if (role === USER_ROLES.USER) return ''; // No badge for regular users
    
    const displayName = ROLE_DISPLAY_NAMES[role];
    const colorClass = ROLE_COLORS[role];
    
    return `<span class="role-badge ${colorClass} text-xs font-bold px-2 py-1 rounded ml-2">${displayName}</span>`;
}

/**
 * Set user role in Firestore (admin only)
 * @param {Object} db - Firestore database instance
 * @param {string} userId - User ID
 * @param {string} role - Role to assign
 * @param {string} assignedBy - UID of admin assigning the role
 * @returns {Promise<void>}
 */
export async function setUserRole(db, userId, role, assignedBy) {
    try {
        const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");
        
        if (!Object.values(USER_ROLES).includes(role)) {
            throw new Error('Invalid role');
        }
        
        await setDoc(doc(db, "userRoles", userId), {
            role,
            assignedBy,
            assignedAt: serverTimestamp()
        });
        
        // Log admin action
        await logAdminAction(db, assignedBy, 'ASSIGN_ROLE', {
            targetUserId: userId,
            role
        });
        
    } catch (error) {
        console.error("Error setting user role:", error);
        throw error;
    }
}

/**
 * Log admin action for audit trail
 * @param {Object} db - Firestore database instance
 * @param {string} adminId - UID of admin performing action
 * @param {string} action - Action type
 * @param {Object} details - Action details
 * @returns {Promise<void>}
 */
export async function logAdminAction(db, adminId, action, details) {
    try {
        const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");
        
        await addDoc(collection(db, "adminLogs"), {
            adminId,
            action,
            details,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error logging admin action:", error);
    }
}
