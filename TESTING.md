# Testing Guide for Jah and Co Community Pulse

This document outlines the testing procedures for the Community Pulse application.

## Pre-Deployment Checklist

### 1. File Structure Validation
- [x] All HTML files are in the root directory
- [x] All CSS files are in `assets/css/`
- [x] All JavaScript files are in `assets/js/`
- [x] Images are in `assets/images/`
- [x] Configuration files (.htaccess, firebase.json, package.json) are in root

### 2. Code Quality
- [x] All HTML files are well-formed (proper opening/closing tags)
- [x] All JavaScript files pass syntax validation
- [x] CSS file is properly formatted
- [x] No duplicate code (particle animations consolidated)
- [x] Consistent icon library (Phosphor Icons) throughout

### 3. Security
- [x] Content Security Policy headers added to all pages
- [x] Security headers configured in .htaccess
- [x] .gitignore properly configured
- [x] Firebase config uses fallback pattern
- [x] Environment variable support added

## Manual Testing Procedures

### Setup for Testing

1. **Start a local server:**
   ```bash
   python3 -m http.server 8000
   # OR
   npm run serve
   ```

2. **Open in browser:**
   Navigate to `http://localhost:8000`

### Test Cases

#### 1. Login Page (`login.html`)
- [ ] Page loads without errors in console
- [ ] Background particles are animating
- [ ] Sign up form is visible
- [ ] Can switch between Sign Up and Login forms
- [ ] Form validation works (empty fields show error)
- [ ] Firebase authentication connects successfully

**Manual Test Steps:**
1. Open `http://localhost:8000/login.html`
2. Check browser console for errors (should be none)
3. Verify particles are moving in background
4. Click "Log In" button - login form should appear
5. Try submitting empty form - should show validation errors
6. Enter test credentials and verify Firebase connection

#### 2. Timeline Page (`index.html`)
- [ ] Redirects to login if not authenticated
- [ ] Page loads with proper layout
- [ ] Navigation menu is visible with correct icons
- [ ] Create post form is functional
- [ ] Posts load from Firestore
- [ ] Like button works
- [ ] Comment functionality works
- [ ] Delete post works for own posts
- [ ] Real-time updates work (new posts appear automatically)
- [ ] Jah & Co Pulse Board widget displays

**Manual Test Steps:**
1. Open `http://localhost:8000/` (should redirect to login)
2. Log in with valid credentials
3. Verify navigation shows all links with icons
4. Create a test post
5. Like your post
6. Comment on your post
7. Verify post appears in timeline
8. Delete the test post

#### 3. Board Page (`board.html`)
- [ ] Page loads with discussion board layout
- [ ] "Create Post" button opens modal
- [ ] Can create discussion posts
- [ ] Can create polls
- [ ] File attachments work (images/videos)
- [ ] Poll voting works
- [ ] Poll results display correctly
- [ ] Comments on discussions work
- [ ] Delete functionality works for own posts

**Manual Test Steps:**
1. Open `http://localhost:8000/board.html`
2. Click "Create Post" button
3. Create a discussion with title and content
4. Switch to poll tab and create a poll
5. Vote on the poll
6. Verify results display
7. Comment on a discussion
8. Delete test posts

#### 4. Groups Page (`groups.html`)
- [ ] Groups list displays correctly
- [ ] Can join/leave groups
- [ ] Member count updates
- [ ] Clicking group opens group view
- [ ] Can post to group
- [ ] Group posts display
- [ ] Back button returns to groups list

**Manual Test Steps:**
1. Open `http://localhost:8000/groups.html`
2. Click "Join Group" on a group
3. Click group to view it
4. Create a post in the group
5. Verify post appears
6. Click "Back to Groups"
7. Leave the group

#### 5. Profile Page (`profile.html`)
- [ ] Profile page loads
- [ ] Display name can be updated
- [ ] Theme switcher works
- [ ] All themes apply correctly
- [ ] User's posts display
- [ ] Can delete own posts
- [ ] Profile changes persist

**Manual Test Steps:**
1. Open `http://localhost:8000/profile.html`
2. Change display name and save
3. Verify success message
4. Test each theme button
5. Verify theme changes and persists on reload
6. Check "My Posts" section
7. Delete a post

#### 6. Cross-Page Testing
- [ ] Navigation works between all pages
- [ ] Logout button works on all pages
- [ ] Theme persists across pages
- [ ] User session persists across pages
- [ ] Page transitions are smooth

### Browser Compatibility Testing

Test the application in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

### Performance Testing

- [ ] Pages load in under 3 seconds
- [ ] Particle animations run smoothly (60fps)
- [ ] No memory leaks on long sessions
- [ ] Images load efficiently
- [ ] Real-time updates don't cause lag

### Security Testing

- [ ] Cannot access protected pages without login
- [ ] Cannot delete other users' posts
- [ ] Cannot edit other users' profiles
- [ ] XSS attempts are blocked by CSP
- [ ] File upload size limits are enforced
- [ ] Only allowed file types can be uploaded

## Automated Testing (Future Enhancement)

Consider adding:
- Unit tests for JavaScript functions
- Integration tests for Firebase operations
- E2E tests with Playwright or Cypress
- Accessibility testing with axe-core
- Performance testing with Lighthouse

## Known Issues

Document any known issues discovered during testing below.

## Deployment Verification

After deploying to production:
- [ ] All pages accessible via HTTPS
- [ ] Firebase production config is correct
- [ ] Security rules are applied
- [ ] Analytics are tracking (if enabled)
- [ ] Error logging is working
- [ ] All assets load correctly (no 404s)

## Rollback Plan

If issues are found in production:
1. Revert to previous version via Firebase Hosting
2. Document the issue
3. Fix in development
4. Re-test thoroughly
5. Re-deploy

## Contact

For testing issues or questions:
- Report bugs via GitHub Issues
- Open discussions in GitHub Discussions
- Contact the development team via the repository
