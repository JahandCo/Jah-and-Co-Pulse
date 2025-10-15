# Admin Configuration Guide

This guide explains how to configure admin users for the Jah and Co Pulse application.

## Overview

The admin configuration system allows you to designate specific users as administrators who gain special privileges throughout the application. Admin status can be granted by:

1. **UID-based** (Recommended): Add user's Firebase Authentication UID to the configuration
2. **Display Name-based** (Legacy): Users with the display name "Jah and Co" are automatically admins

## Admin Privileges

Administrators have the following special capabilities:

- **Moderation**: Delete and edit any post across Timeline, Board, and Groups
- **Channel Management**: Create and delete chat channels
- **Group Management**: Create new community groups
- **Special Styling**: Gold animated name with admin badge on all posts
- **Message Moderation**: Delete any message in chat

## How to Add an Admin User

### Method 1: By Firebase UID (Recommended)

This is the most secure method as UIDs cannot be changed by users.

1. **Get the User's UID**:
   - Have the user log into the application
   - Open browser DevTools (F12)
   - In the Console, type: `firebase.auth().currentUser.uid`
   - Copy the UID (it looks like: `abc123xyz456def789ghi`)

2. **Add UID to Configuration**:
   - Open `public/assets/js/admin-config.js`
   - Add the UID to the `ADMIN_UIDS` array:
   ```javascript
   export const ADMIN_UIDS = [
       'abc123xyz456def789ghi',  // John Doe
       'xyz789abc123def456ghi',  // Jane Smith
   ];
   ```

3. **Optional: Add Display Name Reference**:
   ```javascript
   export const ADMIN_DISPLAY_NAMES = {
       'abc123xyz456def789ghi': 'John Doe',
       'xyz789abc123def456ghi': 'Jane Smith',
   };
   ```

4. **Commit and Deploy**:
   - Save the file
   - Commit changes to git
   - Deploy the updated application

### Method 2: By Display Name (Legacy)

Users with the display name "Jah and Co" are automatically considered admins. This method is less secure as display names could potentially be changed.

To change the legacy admin name:
1. Open `public/assets/js/admin-config.js`
2. Modify the `LEGACY_ADMIN_DISPLAY_NAME` constant:
   ```javascript
   export const LEGACY_ADMIN_DISPLAY_NAME = "Your Admin Name";
   ```

## Removing Admin Access

To remove admin privileges from a user:

1. Open `public/assets/js/admin-config.js`
2. Remove their UID from the `ADMIN_UIDS` array
3. Remove their entry from `ADMIN_DISPLAY_NAMES` (if present)
4. Commit and deploy changes

## Testing Admin Access

After adding a new admin:

1. Log in with the admin account
2. Verify admin features appear:
   - "Create Group" button on Groups page
   - "+" button for channel creation on Chat page
   - "Edit" and "Delete" buttons on other users' posts
   - Gold animated name on your posts

## Development/Testing Functions

The admin-config.js file includes helper functions for development:

```javascript
// Add admin UID at runtime (for testing only)
import { addAdminUID } from './assets/js/admin-config.js';
addAdminUID('test123uid456', 'Test Admin');

// Remove admin UID at runtime
import { removeAdminUID } from './assets/js/admin-config.js';
removeAdminUID('test123uid456');

// Get all admin UIDs
import { getAllAdminUIDs } from './assets/js/admin-config.js';
console.log(getAllAdminUIDs());
```

**Note**: Runtime changes are temporary and will be lost on page reload. Always edit the file directly for permanent changes.

## Security Considerations

### Client-Side vs Server-Side

⚠️ **Important**: The admin configuration is CLIENT-SIDE only. This means:

- It controls UI elements (showing/hiding admin buttons)
- It provides user convenience
- It is NOT a security mechanism

### Firebase Security Rules Required

You **MUST** implement server-side Firebase security rules to enforce admin privileges:

```javascript
// Example Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth.uid in [
        'abc123xyz456def789ghi',  // Add your admin UIDs here
        'xyz789abc123def456ghi'
      ];
    }
    
    // Only admins can create groups
    match /groups/{groupId} {
      allow create: if isAdmin();
      allow read: if request.auth != null;
      allow delete: if isAdmin();
    }
    
    // Only admins can create channels
    match /channels/{channelId} {
      allow create: if isAdmin();
      allow read: if request.auth != null;
      allow delete: if isAdmin();
    }
    
    // Posts can be deleted by owner or admin
    match /posts/{postId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.authorId || isAdmin();
      allow update: if request.auth.uid == resource.data.authorId || isAdmin();
    }
  }
}
```

### Best Practices

1. **Use UID-based admin checks** instead of display names
2. **Keep admin UIDs in source control** for audit trail
3. **Implement Firebase security rules** to enforce permissions server-side
4. **Limit admin access** to trusted individuals only
5. **Review admin list regularly** and remove inactive admins
6. **Use environment variables** for sensitive configurations in production

## Troubleshooting

### Admin features not appearing

1. Verify the UID is correctly added to `ADMIN_UIDS` array
2. Check browser console for JavaScript errors
3. Ensure the user is logged in
4. Clear browser cache and reload
5. Verify the UID matches exactly (copy-paste recommended)

### Admin features appear for wrong user

1. Check if user's display name matches `LEGACY_ADMIN_DISPLAY_NAME`
2. Verify no duplicate UIDs in the configuration
3. Review the admin list for unauthorized entries

### Changes not taking effect

1. Ensure the file is saved
2. Clear browser cache
3. Perform a hard refresh (Ctrl+F5 or Cmd+Shift+R)
4. Verify the deployment includes the updated file

## Support

For issues or questions about admin configuration, please:
- Check this README first
- Review the code in `admin-config.js`
- Check browser console for errors
- Contact the development team

---

**Last Updated**: 2025-10-15
**Version**: 1.0.0
