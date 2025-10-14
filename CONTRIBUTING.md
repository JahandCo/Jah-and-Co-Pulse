# Contributing to Jah and Co Community Pulse

Thank you for your interest in contributing to Community Pulse! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check the [Issues](https://github.com/JahandCo/Jah-and-Co-Pulse/issues) to see if the bug has already been reported
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser and version information

### Suggesting Enhancements

1. Check existing issues and discussions
2. Create a new issue with:
   - Clear description of the enhancement
   - Use cases and benefits
   - Potential implementation approach

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Jah-and-Co-Pulse.git
   cd Jah-and-Co-Pulse
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the code style guidelines below
   - Add tests if applicable
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots for UI changes

## Development Setup

### Prerequisites
- Modern web browser
- Text editor or IDE
- Git
- Python 3 or Node.js (for local server)
- Firebase account (for testing)

### Getting Started

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Jah-and-Co-Pulse.git
   cd Jah-and-Co-Pulse
   ```

2. **Set up Firebase config**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

3. **Start development server**
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # OR using npm
   npm install
   npm run serve
   ```

4. **Open in browser**
   Navigate to `http://localhost:8000`

## Code Style Guidelines

### HTML
- Use proper indentation (4 spaces)
- Include semantic HTML5 elements
- Add descriptive alt text for images
- Include meta tags for SEO and security
- Use Phosphor Icons for consistency

### CSS
- Follow existing naming conventions
- Use CSS variables for theme colors
- Write mobile-first responsive styles
- Comment complex styles
- Group related styles together

### JavaScript
- Use ES6+ modern syntax
- Write modular, reusable code
- Add JSDoc comments for functions
- Handle errors gracefully
- Use async/await for promises
- Follow existing module patterns

### Example JavaScript Function
```javascript
/**
 * Creates a new post in the timeline
 * @param {string} content - The post content
 * @param {Object} user - The current user object
 * @returns {Promise<string>} The ID of the created post
 */
async function createPost(content, user) {
    try {
        const post = {
            content,
            authorId: user.uid,
            authorDisplayName: user.displayName,
            createdAt: serverTimestamp(),
            likes: {},
            commentCount: 0
        };
        
        const docRef = await addDoc(collection(db, "posts"), post);
        return docRef.id;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}
```

## File Organization

### Directory Structure
```
Jah-and-Co-Pulse/
├── assets/
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript modules
│   └── images/        # Image assets
├── *.html             # HTML pages (root level)
├── .htaccess          # Apache configuration
├── firebase.json      # Firebase config
├── package.json       # Dependencies
└── README.md          # Documentation
```

### Naming Conventions
- **Files**: lowercase with hyphens (e.g., `my-component.js`)
- **Classes**: PascalCase (e.g., `ParticleAnimation`)
- **Functions**: camelCase (e.g., `createPost`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **CSS classes**: kebab-case (e.g., `.neon-button`)

## Testing

### Before Submitting
1. Test in multiple browsers (Chrome, Firefox, Safari, Edge)
2. Verify mobile responsiveness
3. Check browser console for errors
4. Test with Firebase in both development and production mode
5. Verify all features work as expected
6. Run any automated tests (if available)

### Manual Testing Checklist
- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Forms submit properly
- [ ] Real-time updates work
- [ ] Theme switching works
- [ ] Mobile view is functional
- [ ] Images load correctly

## Security Considerations

### Never Commit
- API keys or secrets (use environment variables)
- User data or credentials
- Debug logs with sensitive information
- Backup files or temporary data

### Always Include
- Input validation
- XSS protection
- CSRF tokens where applicable
- Proper Firebase Security Rules
- Content Security Policy headers

## Documentation

When adding features:
1. Update README.md if it affects setup or usage
2. Add JSDoc comments to functions
3. Update TESTING.md with new test cases
4. Add entry to CHANGELOG.md
5. Include inline comments for complex logic

## Git Commit Messages

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Build process or auxiliary tool changes

### Examples
```
feat(timeline): add infinite scroll to posts

Implement infinite scrolling for the timeline view to improve
performance with large numbers of posts.

Closes #123
```

```
fix(auth): resolve login redirect loop

Fixed issue where users would get stuck in a redirect loop
after successful authentication.

Fixes #456
```

## Need Help?

- Check the [README.md](README.md) for setup instructions
- Review [TESTING.md](TESTING.md) for testing guidelines
- Look at existing code for examples
- Ask questions in GitHub Issues
- Contact: support@jahandco.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in the project's README and release notes.

Thank you for contributing to Community Pulse! 🎉
