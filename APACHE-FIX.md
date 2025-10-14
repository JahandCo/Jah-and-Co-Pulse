# Apache Configuration Fix

## Issue Resolved
Fixed the infinite redirect loop error (AH00124) caused by conflicting rewrite rules in `.htaccess`.

## What Was Wrong
The `.htaccess` file had a rewrite rule that was causing infinite redirects:
1. HTTPS redirect was in `.htaccess` but should be in Apache config
2. The `.html` extension rewrite rule was poorly structured causing loops

## What Was Fixed

### 1. Apache Virtual Host Configs
Both `pulseapp.jahandco.tech.conf` and `pulseapp.jahandco.tech-le-ssl.conf` were updated to:
- Clean, standard Apache configuration
- Proper directory permissions
- HTTPS redirect in HTTP (port 80) config only
- No conflicting directives

### 2. .htaccess Files
Updated both root and `public/.htaccess` with:
- Removed HTTPS redirect (handled by Apache config)
- Fixed `.html` extension rewrite rules to prevent loops
- Proper rewrite conditions to check file existence

## Rewrite Rules Explanation

The new `.html` extension handling:
```apache
# Remove .html extension from URLs (if requested)
RewriteCond %{THE_REQUEST} ^[A-Z]{3,}\s([^.]+)\.html [NC]
RewriteRule ^ %1 [R=301,L]

# Add .html extension internally (if file exists)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ $1.html [L,QSA]
```

This:
1. Redirects `page.html` → `page` (external redirect)
2. Internally serves `page` as `page.html` (if file exists)
3. Prevents infinite loops with proper conditions

## Deployment Steps

After pulling these changes:

1. **Copy configs to Apache**:
   ```bash
   sudo cp pulseapp.jahandco.tech.conf /etc/apache2/sites-available/
   sudo cp pulseapp.jahandco.tech-le-ssl.conf /etc/apache2/sites-available/
   ```

2. **Enable the site**:
   ```bash
   sudo a2ensite pulseapp.jahandco.tech.conf
   ```

3. **Test configuration**:
   ```bash
   sudo apache2ctl configtest
   ```

4. **Restart Apache**:
   ```bash
   sudo systemctl restart apache2
   ```

5. **Check logs if issues persist**:
   ```bash
   sudo tail -f /var/log/apache2/pulseapp.jahandco.tech-ssl-error.log
   ```

## Verification

After deployment, verify:
- ✅ http://pulseapp.jahandco.tech → https://pulseapp.jahandco.tech
- ✅ https://pulseapp.jahandco.tech loads without errors
- ✅ https://pulseapp.jahandco.tech/login.html → https://pulseapp.jahandco.tech/login
- ✅ https://pulseapp.jahandco.tech/login loads the page
- ✅ No redirect loops in browser
- ✅ No errors in Apache logs

## Troubleshooting

### If you still see redirect errors:

1. **Clear .htaccess override**:
   ```bash
   # Temporarily disable .htaccess to test
   sudo mv /var/www/Jah-and-Co-Pulse/public/.htaccess /var/www/Jah-and-Co-Pulse/public/.htaccess.bak
   sudo systemctl restart apache2
   # Test if site loads
   # If it works, there's still an issue with .htaccess
   ```

2. **Check Apache modules**:
   ```bash
   sudo a2enmod rewrite
   sudo a2enmod ssl
   sudo a2enmod headers
   sudo systemctl restart apache2
   ```

3. **Verify AllowOverride**:
   Ensure Apache config has `AllowOverride All` in the Directory directive.

4. **Check file permissions**:
   ```bash
   sudo chown -R www-data:www-data /var/www/Jah-and-Co-Pulse
   sudo chmod -R 755 /var/www/Jah-and-Co-Pulse
   ```

### Debug mode:

Enable debug logging to see what's happening:
```bash
# In Apache config, add to VirtualHost:
LogLevel alert rewrite:trace3

# Restart Apache
sudo systemctl restart apache2

# Check logs
sudo tail -f /var/log/apache2/pulseapp.jahandco.tech-ssl-error.log
```

## Reference

Standard Apache + SSL configuration pattern:
- HTTP (port 80): Redirect all traffic to HTTPS
- HTTPS (port 443): Serve content with SSL
- .htaccess: Handle URL rewriting for clean URLs
- No conflicting redirects between Apache config and .htaccess

The configuration now follows this standard pattern.
