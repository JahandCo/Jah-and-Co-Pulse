# Server Configuration Files

This directory contains server configuration files for deploying the application.

## Files

- **deploy.sh** - Automated deployment script for Apache servers
- **pulseapp.jahandco.tech.conf** - Apache HTTP virtual host configuration
- **pulseapp.jahandco.tech-le-ssl.conf** - Apache HTTPS/SSL virtual host configuration (Let's Encrypt)

## Usage

### Apache Deployment

1. Copy the appropriate configuration file to your Apache sites directory:
   ```bash
   sudo cp pulseapp.jahandco.tech.conf /etc/apache2/sites-available/
   ```

2. Enable the site:
   ```bash
   sudo a2ensite pulseapp.jahandco.tech
   sudo systemctl reload apache2
   ```

3. For SSL/HTTPS, use Certbot:
   ```bash
   sudo certbot --apache -d pulseapp.jahandco.tech
   ```

### Deployment Script

The `deploy.sh` script automates the deployment process. Review and customize it for your specific server setup before use.

## Note

The actual web application files are in the `../public/` directory. These configuration files are only for server setup.
