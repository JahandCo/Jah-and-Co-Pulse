# Features Implementation Guide

This guide provides comprehensive documentation for all advanced features implemented in the Jah and Co Pulse application.

## Table of Contents

1. [Firebase Security Rules](#firebase-security-rules)
2. [User Roles System](#user-roles-system)
3. [Message Editing](#message-editing)
4. [User Mentions](#user-mentions)
5. [Emoji Reactions](#emoji-reactions)
6. [File Uploads](#file-uploads)
7. [Channel Categories](#channel-categories)
8. [Private/Direct Messages](#privatedirect-messages)
9. [Read Receipts](#read-receipts)
10. [Group Avatars](#group-avatars)
11. [Admin Activity Logging](#admin-activity-logging)

---

## Firebase Security Rules

### Overview
Comprehensive Firestore and Storage security rules have been implemented to enforce permissions server-side.

### Files
- `firestore.rules` - Database security rules
- `storage.rules` - File storage security rules

### Setup

1. **Deploy Firestore Rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Deploy Storage Rules:**
   ```bash
   firebase deploy --only storage:rules
   ```

3. **Update Admin UIDs:**
   Edit both `firestore.rules` and `storage.rules` to add your admin UIDs:
   ```javascript
   function isAdmin() {
     return isAuthenticated() && request.auth.uid in [
       'your-admin-uid-here',
       'another-admin-uid-here'
     ];
   }
   ```

### Key Features

- **Role-based permissions** (Admin, Moderator, VIP, User)
- **Resource ownership checks**
- **File size and type validation**
- **Protected admin operations**
- **Audit trail enforcement**

---

## User Roles System

### Overview
A comprehensive role-based access control system with four role levels: Admin, Moderator, VIP, and User.

### File
- `public/assets/js/roles-config.js`

### Available Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: delete/edit any content, create groups/channels, assign roles, view logs |
| **Moderator** | Delete posts/messages, ban users, limited administrative actions |
| **VIP** | Enhanced upload limits, special badge |
| **User** | Standard permissions: create posts, upload files (10MB limit) |

### Usage

**Assign a role:**
```javascript
import { setUserRole } from './assets/js/roles-config.js';

// Admin assigns role
await setUserRole(db, userId, 'moderator', adminUserId);
```

**Check permissions:**
```javascript
import { getUserRole, hasPermission } from './assets/js/roles-config.js';

const role = await getUserRole(db, userId);
if (hasPermission(role, 'canDeleteAnyPost')) {
    // Show delete button
}
```

**Display role badge:**
```javascript
import { getRoleBadgeHTML } from './assets/js/roles-config.js';

const badgeHTML = getRoleBadgeHTML(role);
// Displays colored badge next to username
```

### Firestore Structure

```javascript
userRoles/{userId}
├── role: 'admin' | 'moderator' | 'vip' | 'user'
├── assignedBy: uid
└── assignedAt: timestamp
```

---

## Message Editing

### Overview
Users can edit their own messages, admins can edit any message. Edited messages are marked with an indicator.

### File
- `public/assets/js/message-editing.js`

### Usage

**Setup editing for a message container:**
```javascript
import { setupMessageEditing } from './assets/js/message-editing.js';

setupMessageEditing(
    messagesContainer, 
    db, 
    'channels/channelId/messages', 
    currentUserId, 
    isAdmin
);
```

**Add edit button to message HTML:**
```javascript
import { getEditButtonHTML, getEditIndicatorHTML } from './assets/js/message-editing.js';

const editButton = getEditButtonHTML(message, currentUserId, isAdmin);
const editIndicator = getEditIndicatorHTML(message);

messageHTML = `
    <div class="message-header">
        ${editButton}
        ${editIndicator}
    </div>
    <div class="message-content">${message.content}</div>
`;
```

### Firestore Changes

When a message is edited:
```javascript
{
    content: "Updated content",
    edited: true,
    editedAt: serverTimestamp()
}
```

---

## User Mentions

### Overview
Users can mention others using @username syntax. Mentions are highlighted and can trigger notifications.

### File
- `public/assets/js/mentions.js`

### Features

- **Autocomplete**: Type @ to see user suggestions
- **Highlighting**: Mentions appear in purple
- **Notifications**: Mentioned users receive notifications
- **Keyboard navigation**: Arrow keys to select, Enter to insert

### Usage

**Setup autocomplete:**
```javascript
import { setupMentionAutocomplete } from './assets/js/mentions.js';

const textarea = document.getElementById('message-input');
setupMentionAutocomplete(textarea, db);
```

**Parse mentions in display:**
```javascript
import { parseMentions, extractMentions } from './assets/js/mentions.js';

// Convert @username to HTML
const htmlContent = parseMentions(message.content);

// Get array of mentioned users
const mentions = extractMentions(message.content);
```

**Send notifications:**
```javascript
import { notifyMentionedUsers } from './assets/js/mentions.js';

const mentions = extractMentions(content);
if (mentions.length > 0) {
    await notifyMentionedUsers(
        db, 
        mentions, 
        messageUrl, 
        authorName
    );
}
```

### Autocomplete Keyboard Controls

- **Arrow Down**: Next user
- **Arrow Up**: Previous user
- **Enter/Tab**: Select user
- **Escape**: Close autocomplete

---

## Emoji Reactions

### Overview
Users can react to posts and messages with emoji. Multiple users can use the same reaction.

### File
- `public/assets/js/reactions.js`

### Available Reactions

❤️ Like | 😍 Love | 😂 Laugh | 😮 Wow | 😢 Sad | 😠 Angry  
🔥 Fire | 👍 Thumbs Up | 👎 Thumbs Down | 👏 Clap | ⭐ Star | ✨ Sparkles

### Usage

**Setup reactions:**
```javascript
import { setupReactionListeners } from './assets/js/reactions.js';

setupReactionListeners(
    postsContainer, 
    db, 
    'posts', 
    userId, 
    userName
);
```

**Add reaction picker to post:**
```javascript
import { createReactionPickerHTML } from './assets/js/reactions.js';

postHTML += `
    <button class="show-reaction-picker">
        <i class="ph ph-smiley"></i> React
    </button>
    ${createReactionPickerHTML()}
`;
```

**Display reactions:**
```javascript
import { getReactions, createReactionsDisplayHTML } from './assets/js/reactions.js';

const { reactionCounts, userReactions } = await getReactions(db, 'posts', postId);
const reactionsHTML = createReactionsDisplayHTML(reactionCounts, userReactions, currentUserId);
```

### Firestore Structure

```javascript
posts/{postId}/reactions/{userId_emoji}
├── emoji: '❤️'
├── userId: uid
├── userName: 'John Doe'
└── createdAt: timestamp
```

---

## File Uploads

### Overview
Users can upload images (10MB) and videos (50MB) to posts, messages, and profiles. Admins and VIPs have higher limits.

### File
- `public/assets/js/file-upload.js`

### Supported Formats

**Images:** JPEG, PNG, GIF, WebP  
**Videos:** MP4, WebM, OGG

### Usage

**Setup file upload for a form:**
```javascript
import { setupFileUpload } from './assets/js/file-upload.js';

const fileUploader = setupFileUpload(
    form,
    attachButton,
    storage,
    'chatAttachments/channelId',
    (fileURL, fileType) => {
        // File uploaded successfully
        console.log('File URL:', fileURL);
    },
    MAX_IMAGE_SIZE
);

// After form submission:
fileUploader.clearFile();
```

**Manual upload:**
```javascript
import { uploadFile, validateFile } from './assets/js/file-upload.js';

const validation = validateFile(file, maxSize);
if (validation.valid) {
    const url = await uploadFile(
        storage, 
        file, 
        'postAttachments/postId',
        (progress) => {
            console.log(`Upload: ${progress}%`);
        }
    );
}
```

### Storage Paths

- **Profile pictures**: `profilePictures/{userId}/{fileName}`
- **Group avatars**: `groupAvatars/{groupId}/{fileName}`
- **Chat attachments**: `chatAttachments/{channelId}/{messageId}/{fileName}`
- **Post attachments**: `postAttachments/{postId}/{fileName}`
- **DM attachments**: `dmAttachments/{conversationId}/{messageId}/{fileName}`

---

## Channel Categories

### Overview
Organize chat channels into categories for better navigation (e.g., "General", "Games", "Music").

### Firestore Structure

```javascript
channelCategories/{categoryId}
├── name: 'General'
├── description: 'General discussion channels'
├── order: 0
├── createdBy: uid
└── createdAt: timestamp

channels/{channelId}
├── name: 'announcements'
├── description: 'Official announcements'
├── categoryId: 'category-id-here'  // NEW
├── createdBy: uid
└── createdAt: timestamp
```

### Implementation Example

**Create category (admin only):**
```javascript
await addDoc(collection(db, "channelCategories"), {
    name: "General",
    description: "General discussion channels",
    order: 0,
    createdBy: currentUserId,
    createdAt: serverTimestamp()
});
```

**Assign channel to category:**
```javascript
await updateDoc(doc(db, "channels", channelId), {
    categoryId: categoryId
});
```

**Display channels by category:**
```javascript
const categoriesSnapshot = await getDocs(
    query(collection(db, "channelCategories"), orderBy("order"))
);

categoriesSnapshot.forEach(categoryDoc => {
    const category = categoryDoc.data();
    // Get channels in this category
    const channelsQuery = query(
        collection(db, "channels"),
        where("categoryId", "==", categoryDoc.id)
    );
    // Render category and its channels
});
```

---

## Private/Direct Messages

### Overview
Users can send private messages to each other in one-on-one conversations.

### Firestore Structure

```javascript
directMessages/{conversationId}
├── participants: ['uid1', 'uid2']
├── lastMessage: 'Hello!'
├── lastMessageAt: timestamp
└── createdAt: timestamp

directMessages/{conversationId}/messages/{messageId}
├── content: 'Hello!'
├── authorId: uid
├── authorDisplayName: 'John Doe'
├── createdAt: timestamp
├── edited: false
└── attachmentURL: 'url' (optional)
```

### Implementation Example

**Create or get conversation:**
```javascript
// Generate consistent conversation ID
const conversationId = [userId1, userId2].sort().join('_');

// Check if conversation exists
const convRef = doc(db, "directMessages", conversationId);
const convDoc = await getDoc(convRef);

if (!convDoc.exists()) {
    // Create new conversation
    await setDoc(convRef, {
        participants: [userId1, userId2],
        createdAt: serverTimestamp()
    });
}
```

**Send message:**
```javascript
await addDoc(collection(db, `directMessages/${conversationId}/messages`), {
    content: messageContent,
    authorId: currentUserId,
    authorDisplayName: currentUserDisplayName,
    createdAt: serverTimestamp()
});

// Update last message
await updateDoc(doc(db, "directMessages", conversationId), {
    lastMessage: messageContent,
    lastMessageAt: serverTimestamp()
});
```

**List conversations:**
```javascript
const conversationsQuery = query(
    collection(db, "directMessages"),
    where("participants", "array-contains", currentUserId),
    orderBy("lastMessageAt", "desc")
);
```

---

## Read Receipts

### Overview
Track when users have read messages in channels and direct messages.

### Firestore Structure

```javascript
channels/{channelId}/messages/{messageId}/readReceipts/{userId}
├── readAt: timestamp
└── userName: 'John Doe'

directMessages/{conversationId}/messages/{messageId}/readReceipts/{userId}
├── readAt: timestamp
└── userName: 'John Doe'
```

### Implementation Example

**Mark message as read:**
```javascript
const readReceiptPath = `channels/${channelId}/messages/${messageId}/readReceipts/${userId}`;
await setDoc(doc(db, readReceiptPath), {
    readAt: serverTimestamp(),
    userName: currentUserDisplayName
});
```

**Display read status:**
```javascript
// Get read receipts
const receiptsSnapshot = await getDocs(
    collection(db, `channels/${channelId}/messages/${messageId}/readReceipts`)
);

const readBy = [];
receiptsSnapshot.forEach(doc => {
    readBy.push(doc.data().userName);
});

// Show "Read by: John, Jane, and 3 more"
const readText = readBy.length > 0 
    ? `Read by: ${readBy.slice(0, 3).join(', ')}${readBy.length > 3 ? ` and ${readBy.length - 3} more` : ''}`
    : 'Unread';
```

**Auto-mark visible messages as read:**
```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const messageId = entry.target.dataset.id;
            markMessageAsRead(messageId);
        }
    });
});

// Observe each message
messageElements.forEach(el => observer.observe(el));
```

---

## Group Avatars

### Overview
Groups can have custom avatar images uploaded by admins.

### Firestore Structure

```javascript
groups/{groupId}
├── name: 'Developers'
├── description: 'Dev discussion'
├── avatarURL: 'https://storage...'  // NEW
├── createdBy: uid
├── createdAt: timestamp
└── members: {uid: true}
```

### Implementation Example

**Upload group avatar:**
```javascript
import { uploadFile, validateFile } from './assets/js/file-upload.js';

const validation = validateFile(file, 5 * 1024 * 1024); // 5MB max
if (validation.valid) {
    const avatarURL = await uploadFile(
        storage,
        file,
        `groupAvatars/${groupId}`,
        (progress) => console.log(`Upload: ${progress}%`)
    );
    
    // Update group with avatar URL
    await updateDoc(doc(db, "groups", groupId), {
        avatarURL: avatarURL
    });
}
```

**Display group avatar:**
```javascript
const avatarHTML = group.avatarURL
    ? `<img src="${group.avatarURL}" class="w-16 h-16 rounded-full object-cover" alt="${group.name}">`
    : `<div class="w-16 h-16 rounded-full bg-purple-900 flex items-center justify-center text-2xl">
         ${group.name.charAt(0)}
       </div>`;
```

---

## Admin Activity Logging

### Overview
All admin actions are logged to an audit trail for accountability and security monitoring.

### Firestore Structure

```javascript
adminLogs/{logId}
├── adminId: uid
├── action: 'DELETE_POST' | 'ASSIGN_ROLE' | 'BAN_USER' | etc.
├── details: {
│   ├── targetUserId: uid
│   ├── postId: id
│   └── reason: 'spam'
│ }
└── timestamp: timestamp
```

### Logged Actions

- `ASSIGN_ROLE` - Role assignments
- `DELETE_POST` - Post deletions
- `DELETE_MESSAGE` - Message deletions
- `EDIT_POST` - Post edits
- `EDIT_MESSAGE` - Message edits
- `DELETE_CHANNEL` - Channel deletions
- `DELETE_GROUP` - Group deletions
- `BAN_USER` - User bans
- `CREATE_CHANNEL` - Channel creation
- `CREATE_GROUP` - Group creation

### Implementation Example

**Log an action:**
```javascript
import { logAdminAction } from './assets/js/roles-config.js';

await logAdminAction(db, adminUserId, 'DELETE_POST', {
    postId: postId,
    authorId: postAuthorId,
    reason: 'spam'
});
```

**View admin logs (admin only):**
```javascript
const logsQuery = query(
    collection(db, "adminLogs"),
    orderBy("timestamp", "desc"),
    limit(100)
);

const logsSnapshot = await getDocs(logsQuery);
logsSnapshot.forEach(doc => {
    const log = doc.data();
    console.log(`${log.action} by ${log.adminId} at ${log.timestamp}`);
});
```

**Create admin logs viewer page:**
```javascript
// Display logs in a table
logsSnapshot.forEach(doc => {
    const log = doc.data();
    const timestamp = log.timestamp.toDate().toLocaleString();
    
    tableHTML += `
        <tr>
            <td>${timestamp}</td>
            <td>${log.adminId}</td>
            <td>${log.action}</td>
            <td>${JSON.stringify(log.details)}</td>
        </tr>
    `;
});
```

---

## Integration Checklist

To fully implement all features in your application:

### Firebase Setup
- [ ] Deploy `firestore.rules` with admin UIDs
- [ ] Deploy `storage.rules` with admin UIDs
- [ ] Create Firestore indexes for queries

### User Roles
- [ ] Import `roles-config.js` in pages
- [ ] Add role badges to user displays
- [ ] Implement role assignment UI (admin page)
- [ ] Update permission checks throughout app

### Message Editing
- [ ] Import `message-editing.js` in chat page
- [ ] Add edit buttons to messages
- [ ] Show edit indicators
- [ ] Log edit actions

### User Mentions
- [ ] Import `mentions.js` in chat/post pages
- [ ] Setup autocomplete on textareas
- [ ] Parse mentions in message display
- [ ] Create notifications collection
- [ ] Implement mention notifications

### Emoji Reactions
- [ ] Import `reactions.js` in post/message pages
- [ ] Add reaction picker buttons
- [ ] Display reaction counts
- [ ] Setup reaction listeners

### File Uploads
- [ ] Import `file-upload.js` where needed
- [ ] Add attach file buttons
- [ ] Show upload progress
- [ ] Display file previews

### Channel Categories
- [ ] Create categories collection
- [ ] Add category management UI (admin)
- [ ] Group channels by category in sidebar

### Direct Messages
- [ ] Create DM page/modal
- [ ] Implement conversation list
- [ ] Add user search for new DM
- [ ] Setup message sending/receiving

### Read Receipts
- [ ] Add read receipt tracking to messages
- [ ] Display read status
- [ ] Implement auto-read on scroll

### Group Avatars
- [ ] Add avatar upload to group creation
- [ ] Show avatars in group list
- [ ] Allow avatar updates (admin)

### Admin Logs
- [ ] Create admin logs viewer page
- [ ] Add log entries for all admin actions
- [ ] Implement log filtering and search
- [ ] Add export logs functionality

---

## Security Best Practices

1. **Always validate client-side AND server-side** - Never trust client checks alone
2. **Keep admin UIDs in sync** - Update all three locations (admin-config.js, firestore.rules, storage.rules)
3. **Use environment variables in production** - Don't hardcode UIDs in deployed code
4. **Monitor admin logs regularly** - Review for suspicious activity
5. **Implement rate limiting** - Prevent abuse of upload and messaging features
6. **Sanitize user input** - Prevent XSS in messages and mentions
7. **Validate file uploads** - Check size, type, and content
8. **Use Firebase security rules** - Enforce permissions at database level
9. **Implement proper error handling** - Don't expose sensitive information in errors
10. **Regular security audits** - Review permissions and logs periodically

---

## Troubleshooting

### Common Issues

**"Permission denied" errors:**
- Check Firebase security rules are deployed
- Verify admin UID is added to rules
- Ensure user is authenticated

**File uploads fail:**
- Check storage rules are deployed
- Verify file size and type
- Check browser console for errors

**Mentions don't work:**
- Verify users collection exists
- Check displayName field is populated
- Ensure Firestore queries have indexes

**Reactions not appearing:**
- Check subcollection structure is correct
- Verify real-time listeners are setup
- Check for JavaScript errors

**Admin features not showing:**
- Verify UID in admin-config.js
- Check isAdmin() function returns true
- Clear browser cache

---

## Performance Optimization

1. **Use Firestore indexes** - Create composite indexes for complex queries
2. **Implement pagination** - Don't load all messages at once
3. **Lazy load images** - Use intersection observer for images
4. **Debounce autocomplete** - Limit search queries
5. **Cache user data** - Store frequently accessed user info
6. **Optimize file sizes** - Compress images before upload
7. **Use Firestore snapshots wisely** - Unsubscribe when not needed
8. **Implement virtual scrolling** - For large message lists

---

## Support

For questions or issues:
1. Check this documentation first
2. Review the code in feature files
3. Check browser console for errors
4. Review Firebase security rules
5. Contact development team

**Documentation Version:** 1.0.0  
**Last Updated:** 2025-10-15
