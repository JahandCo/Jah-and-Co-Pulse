# Jah and Co Community Pulse

A vibrant social platform for the Jah and Co community to connect, share, and engage with each other.

## Features

- 🔐 **Secure Authentication** - Firebase-powered user authentication
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 💬 **Timeline Posts** - Share thoughts and updates with the community
- 📊 **Discussion Board** - Create discussions and polls
- 👥 **Groups** - Join and participate in community groups
- 🎨 **Theme Customization** - Multiple color themes to choose from
- ✨ **Animated Background** - Dynamic particle effects
- 🔔 **Real-time Updates** - Instant updates using Firebase Firestore

## Project Structure

```
Jah-and-Co-Pulse/
├── assets/
│   ├── css/
│   │   └── style.css           # Main stylesheet
│   ├── js/
│   │   ├── firebase-config.js  # Firebase configuration
│   │   ├── theme.js            # Theme management
│   │   └── particle-animation.js # Animated background
│   └── images/                 # Image assets
├── index.html                  # Main timeline page
├── login.html                  # Authentication page
├── board.html                  # Discussion board
├── groups.html                 # Community groups
├── profile.html                # User profile
├── .htaccess                   # Apache configuration
├── firebase.json               # Firebase hosting config
├── package.json                # Project dependencies
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A web server (Apache, Nginx) or development server
- Firebase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JahandCo/Jah-and-Co-Pulse.git
   cd Jah-and-Co-Pulse
   ```

2. **Configure Firebase**
   
   - Create a Firebase project at https://firebase.google.com
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage (for board attachments)
   - Copy your Firebase configuration

3. **Set up environment variables (Optional)**
   
   For enhanced security, you can use environment variables:
   
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your Firebase credentials. This requires a build tool like Vite.

4. **Using a development server**
   
   **Option A: Using Python (simplest)**
   ```bash
   python3 -m http.server 8000
   ```
   Then open http://localhost:8000

   **Option B: Using npm and Vite (recommended for development)**
   ```bash
   npm install
   npm run dev
   ```

   **Option C: Using PHP**
   ```bash
   php -S localhost:8000
   ```

5. **For production deployment**

   **Option A: Deploy to Apache Server (pulseapp.jahandco.tech)**
   
   The application is ready for Apache deployment with all necessary configuration files:
   
   ```bash
   # Quick deployment (3 commands)
   scp -r . user@your-ip:/var/www/Jah-and-Co-Pulse/
   sudo /var/www/Jah-and-Co-Pulse/deploy.sh
   sudo certbot --apache -d pulseapp.jahandco.tech
   ```
   
   **Included Files:**
   - `public/` - Web root directory
   - `pulseapp.jahandco.tech.conf` - Apache HTTP config
   - `pulseapp.jahandco.tech-le-ssl.conf` - Apache HTTPS/SSL config
   - `.env` - Production Firebase credentials
   - `deploy.sh` - Automated deployment script
   
   See **DEPLOYMENT.md** for complete instructions.
   
   **Option B: Deploy to Firebase Hosting**
   
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

## Firebase Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.authorId;
      
      // Comments subcollection
      match /comments/{commentId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow delete: if request.auth.uid == resource.data.authorId;
      }
    }
    
    // Board collection
    match /board/{boardId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.authorId;
      
      // Board comments
      match /comments/{commentId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
      }
    }
    
    // Groups collection
    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      
      // Group posts
      match /posts/{postId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
      }
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /board-attachments/{filename} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.resource.size < 10 * 1024 * 1024
                   && (request.resource.contentType.matches('image/.*') 
                       || request.resource.contentType == 'video/mp4');
    }
  }
}
```

## Configuration

### Theme Customization

Edit `assets/js/theme.js` to add or modify color themes.

### Firebase Configuration

The Firebase config is located in `assets/js/firebase-config.js`. Update the configuration with your project credentials.

## Security Considerations

- ✅ Firebase API keys are safe to expose in client-side code
- ✅ Security is enforced through Firebase Security Rules
- ✅ `.htaccess` includes security headers
- ✅ Content Security Policy headers recommended
- ✅ All user inputs should be sanitized (consider adding DOMPurify)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or join our community discussions.

## Acknowledgments

- Firebase for backend infrastructure
- Tailwind CSS for styling
- Phosphor Icons for iconography
- Google Fonts (Fredoka & Poppins)
