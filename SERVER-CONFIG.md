# Server Configuration Details

## Current Configuration for pulseapp.jahandco.tech

### Server Details
- **Domain**: pulseapp.jahandco.tech
- **Server IP**: 74.208.173.171
- **Installation Directory**: /var/www/Jah-and-Co-Pulse
- **Web Root**: /var/www/Jah-and-Co-Pulse/public

### Apache Configuration Files

#### HTTP Virtual Host
- **File**: `pulseapp.jahandco.tech.conf`
- **Location on server**: `/etc/apache2/sites-available/pulseapp.jahandco.tech.conf`
- **Document Root**: `/var/www/Jah-and-Co-Pulse/public`

#### HTTPS/SSL Virtual Host
- **File**: `pulseapp.jahandco.tech-le-ssl.conf`
- **Location on server**: `/etc/apache2/sites-available/pulseapp.jahandco.tech-le-ssl.conf`
- **Document Root**: `/var/www/Jah-and-Co-Pulse/public`
- **SSL Certificates**: Let's Encrypt at `/etc/letsencrypt/live/pulseapp.jahandco.tech/`

### Deployment Steps

1. **Upload files to server**:
   ```bash
   scp -r . user@74.208.173.171:/var/www/Jah-and-Co-Pulse/
   ```

2. **Run deployment script**:
   ```bash
   ssh user@74.208.173.171
   cd /var/www/Jah-and-Co-Pulse
   sudo ./deploy.sh
   ```

3. **Copy Apache configs**:
   ```bash
   sudo cp pulseapp.jahandco.tech.conf /etc/apache2/sites-available/
   sudo cp pulseapp.jahandco.tech-le-ssl.conf /etc/apache2/sites-available/
   sudo a2ensite pulseapp.jahandco.tech.conf
   ```

4. **Install SSL certificate**:
   ```bash
   sudo certbot --apache -d pulseapp.jahandco.tech
   ```

5. **Test and reload Apache**:
   ```bash
   sudo apache2ctl configtest
   sudo systemctl reload apache2
   ```

### Verification

After deployment, verify:
- HTTP: http://pulseapp.jahandco.tech (should redirect to HTTPS)
- HTTPS: https://pulseapp.jahandco.tech
- Check logs: `sudo tail -f /var/log/apache2/pulseapp.jahandco.tech-error.log`

### Troubleshooting

If you get errors:

1. **Check Apache configuration**:
   ```bash
   sudo apache2ctl configtest
   ```

2. **Check if site is enabled**:
   ```bash
   sudo apache2ctl -S
   ```

3. **Check file permissions**:
   ```bash
   ls -la /var/www/Jah-and-Co-Pulse/public
   sudo chown -R www-data:www-data /var/www/Jah-and-Co-Pulse
   sudo chmod -R 755 /var/www/Jah-and-Co-Pulse
   ```

4. **Check Apache error logs**:
   ```bash
   sudo tail -50 /var/log/apache2/pulseapp.jahandco.tech-error.log
   sudo tail -50 /var/log/apache2/error.log
   ```

5. **Ensure modules are enabled**:
   ```bash
   sudo a2enmod rewrite ssl headers deflate expires
   sudo systemctl restart apache2
   ```

### DNS Configuration

Ensure your DNS is configured correctly:
- **A Record**: pulseapp.jahandco.tech → 74.208.173.171
- Verify: `dig pulseapp.jahandco.tech` or `nslookup pulseapp.jahandco.tech`

### Quick Fix Commands

If site isn't loading:

```bash
# Disable old config if exists
sudo a2dissite pulseapp.jahandco.com.conf 2>/dev/null

# Enable correct config
sudo a2ensite pulseapp.jahandco.tech.conf

# Restart Apache
sudo systemctl restart apache2

# Check status
sudo systemctl status apache2
```
