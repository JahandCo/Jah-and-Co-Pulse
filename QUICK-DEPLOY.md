# Quick Deployment Guide

## For pulseapp.jahandco.tech on Apache Server

### 🚀 Quick Start (3 commands)

```bash
# 1. Upload to server
scp -r /path/to/Jah-and-Co-Pulse user@your-ip:/var/www/Jah-and-Co-Pulse/

# 2. Run deployment script
sudo /var/www/Jah-and-Co-Pulse/deploy.sh

# 3. Install SSL certificate
sudo certbot --apache -d pulseapp.jahandco.tech
```

### ✅ What's Included

- **public/** - Web root with all HTML, CSS, JS, and assets
- **pulseapp.jahandco.tech.conf** - Apache HTTP configuration
- **pulseapp.jahandco.tech-le-ssl.conf** - Apache HTTPS configuration
- **.env** - Production Firebase credentials
- **deploy.sh** - Automated deployment script

### 📋 Manual Deployment Steps

If you prefer manual deployment:

```bash
# 1. Upload files
cd /var/www/
git clone https://github.com/JahandCo/Jah-and-Co-Pulse.git pulseapp.jahandco.tech

# 2. Set permissions
sudo chown -R www-data:www-data /var/www/Jah-and-Co-Pulse
sudo chmod -R 755 /var/www/Jah-and-Co-Pulse

# 3. Enable Apache modules
sudo a2enmod rewrite ssl headers deflate expires

# 4. Copy Apache config
sudo cp /var/www/Jah-and-Co-Pulse/pulseapp.jahandco.tech.conf /etc/apache2/sites-available/
sudo a2ensite pulseapp.jahandco.tech.conf

# 5. Test and reload
sudo apache2ctl configtest
sudo systemctl reload apache2

# 6. Install SSL
sudo certbot --apache -d pulseapp.jahandco.tech
```

### 🔍 Verify Installation

After deployment:
1. Visit http://pulseapp.jahandco.tech (redirects to HTTPS)
2. Visit https://pulseapp.jahandco.tech (loads application)
3. Test login and features

### 📝 Important Files

- **Document Root**: `/var/www/Jah-and-Co-Pulse/public`
- **Apache Config**: `/etc/apache2/sites-available/pulseapp.jahandco.tech.conf`
- **SSL Config**: `/etc/apache2/sites-available/pulseapp.jahandco.tech-le-ssl.conf`
- **Error Log**: `/var/log/apache2/pulseapp.jahandco.tech-error.log`
- **Access Log**: `/var/log/apache2/pulseapp.jahandco.tech-access.log`

### 🛠️ Troubleshooting

**Apache won't start:**
```bash
sudo apache2ctl configtest
sudo journalctl -xe
```

**403 Forbidden:**
```bash
sudo chown -R www-data:www-data /var/www/Jah-and-Co-Pulse
sudo chmod -R 755 /var/www/Jah-and-Co-Pulse
```

**SSL Issues:**
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

### 📞 Support

For detailed instructions, see **DEPLOYMENT.md**
