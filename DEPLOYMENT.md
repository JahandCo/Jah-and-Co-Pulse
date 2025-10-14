# Deployment Guide for pulseapp.jahandco.com

This guide will help you deploy the Jah and Co Pulse application to your Apache server.

## Prerequisites

- Apache web server installed
- Root or sudo access to the server
- Domain name (pulseapp.jahandco.com) pointing to your server IP
- Let's Encrypt (Certbot) for SSL certificates

## Deployment Steps

### 1. Upload Files to Server

Upload the entire repository to your server at: `/var/www/pulseapp.jahandco.com/`

```bash
# On your local machine
scp -r /path/to/Jah-and-Co-Pulse user@your-server-ip:/var/www/pulseapp.jahandco.com/
```

Or use git:
```bash
# On your server
cd /var/www/
git clone https://github.com/JahandCo/Jah-and-Co-Pulse.git pulseapp.jahandco.com
cd pulseapp.jahandco.com
```

### 2. Set Correct Permissions

```bash
# On your server
sudo chown -R www-data:www-data /var/www/pulseapp.jahandco.com
sudo chmod -R 755 /var/www/pulseapp.jahandco.com
```

### 3. Enable Required Apache Modules

```bash
sudo a2enmod rewrite
sudo a2enmod ssl
sudo a2enmod headers
sudo a2enmod deflate
sudo a2enmod expires
sudo systemctl restart apache2
```

### 4. Configure Apache Virtual Host

Copy the configuration file to Apache's sites-available directory:

```bash
sudo cp /var/www/pulseapp.jahandco.com/pulseapp.jahandco.com.conf /etc/apache2/sites-available/
sudo a2ensite pulseapp.jahandco.com.conf
sudo systemctl reload apache2
```

### 5. Test Apache Configuration

```bash
sudo apache2ctl configtest
```

If you see "Syntax OK", proceed. Otherwise, fix any errors.

### 6. Install SSL Certificate with Let's Encrypt

```bash
# Install Certbot if not already installed
sudo apt update
sudo apt install certbot python3-certbot-apache

# Obtain and install SSL certificate
sudo certbot --apache -d pulseapp.jahandco.com

# Follow the prompts:
# - Enter your email address
# - Agree to terms of service
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

Certbot will automatically:
- Create the SSL configuration file
- Update your virtual host configuration
- Set up automatic renewal

### 7. Verify SSL Auto-Renewal

```bash
sudo certbot renew --dry-run
```

### 8. Manual SSL Configuration (if needed)

If you prefer to manually configure SSL, copy the SSL configuration:

```bash
sudo cp /var/www/pulseapp.jahandco.com/pulseapp.jahandco.com-le-ssl.conf /etc/apache2/sites-available/
sudo a2ensite pulseapp.jahandco.com-le-ssl.conf
sudo systemctl reload apache2
```

### 9. Verify Deployment

Open your browser and visit:
- http://pulseapp.jahandco.com (should redirect to HTTPS)
- https://pulseapp.jahandco.com (should load the application)

### 10. Configure Firewall (if using UFW)

```bash
sudo ufw allow 'Apache Full'
sudo ufw enable
sudo ufw status
```

## Directory Structure on Server

```
/var/www/pulseapp.jahandco.com/
├── public/                          # Web root directory
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   ├── index.html
│   ├── login.html
│   ├── board.html
│   ├── groups.html
│   ├── profile.html
│   └── .htaccess
├── .env                             # Environment variables
├── pulseapp.jahandco.com.conf       # Apache HTTP config
├── pulseapp.jahandco.com-le-ssl.conf # Apache HTTPS config
└── [other files]
```

## Post-Deployment Configuration

### Update Firebase Security Rules

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: jah-and-co-dev
3. Navigate to Firestore Database > Rules
4. Update rules as documented in README.md
5. Navigate to Storage > Rules
6. Update storage rules as documented in README.md

### Test All Features

Follow the testing procedures in TESTING.md:
- [ ] User registration and login
- [ ] Timeline posts (create, like, comment)
- [ ] Discussion board (posts and polls)
- [ ] Groups functionality
- [ ] Profile updates
- [ ] Theme switching

### Monitor Application

```bash
# View Apache error logs
sudo tail -f /var/log/apache2/pulseapp.jahandco.com-ssl-error.log

# View Apache access logs
sudo tail -f /var/log/apache2/pulseapp.jahandco.com-ssl-access.log
```

## Troubleshooting

### 403 Forbidden Error
```bash
# Check file permissions
ls -la /var/www/pulseapp.jahandco.com/public
sudo chown -R www-data:www-data /var/www/pulseapp.jahandco.com
```

### 500 Internal Server Error
```bash
# Check Apache error logs
sudo tail -50 /var/log/apache2/pulseapp.jahandco.com-error.log

# Check .htaccess syntax
apache2ctl -t
```

### SSL Certificate Issues
```bash
# Test SSL certificate
sudo certbot certificates

# Renew certificate manually
sudo certbot renew
```

### Rewrite Rules Not Working
```bash
# Ensure mod_rewrite is enabled
sudo a2enmod rewrite
sudo systemctl restart apache2

# Check AllowOverride in virtual host config
# Should be: AllowOverride All
```

## Maintenance

### Update Application

```bash
cd /var/www/pulseapp.jahandco.com
git pull origin main
sudo systemctl reload apache2
```

### Backup

Regular backups recommended:
```bash
# Backup web files
sudo tar -czf pulseapp-backup-$(date +%Y%m%d).tar.gz /var/www/pulseapp.jahandco.com

# Backup Apache configuration
sudo cp /etc/apache2/sites-available/pulseapp.jahandco.com* /backup/location/
```

## Security Recommendations

1. **Keep software updated**:
   ```bash
   sudo apt update && sudo apt upgrade
   ```

2. **Monitor logs regularly**:
   ```bash
   sudo tail -f /var/log/apache2/pulseapp.jahandco.com-ssl-error.log
   ```

3. **Use fail2ban** to prevent brute force attacks:
   ```bash
   sudo apt install fail2ban
   ```

4. **Regular SSL certificate renewal** (automatic with Certbot)

5. **Implement rate limiting** (if needed) using mod_evasive

## Support

For issues or questions:
- Check logs: `/var/log/apache2/`
- Review Apache configuration: `/etc/apache2/sites-available/`
- Test configuration: `sudo apache2ctl configtest`
- GitHub Issues: https://github.com/JahandCo/Jah-and-Co-Pulse/issues

## Additional Resources

- Apache Documentation: https://httpd.apache.org/docs/
- Let's Encrypt: https://letsencrypt.org/
- Firebase Console: https://console.firebase.google.com/
