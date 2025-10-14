# Deployment Checklist for pulseapp.jahandco.com

## Pre-Deployment

- [ ] Domain DNS points to server IP
- [ ] Apache installed and running
- [ ] Server has at least 1GB RAM
- [ ] Port 80 and 443 are open in firewall
- [ ] Root/sudo access available

## File Verification

- [x] **public/** directory created with all files
- [x] **pulseapp.jahandco.com.conf** - Apache HTTP config
- [x] **pulseapp.jahandco.com-le-ssl.conf** - Apache HTTPS/SSL config
- [x] **.env** - Production Firebase credentials (actual values filled)
- [x] **.htaccess** - Rewrite rules updated for production
- [x] **deploy.sh** - Automated deployment script
- [x] **DEPLOYMENT.md** - Full deployment instructions
- [x] **QUICK-DEPLOY.md** - Quick reference guide

## Deployment Steps

### 1. Upload Files
- [ ] Upload entire repository to `/var/www/pulseapp.jahandco.com/`
- [ ] Verify all files are present
- [ ] Check .env file has actual credentials

### 2. Run Deployment Script
```bash
cd /var/www/pulseapp.jahandco.com
sudo chmod +x deploy.sh
sudo ./deploy.sh
```
- [ ] Script completes without errors
- [ ] Apache modules enabled
- [ ] Virtual host configured
- [ ] Apache configuration valid

### 3. Install SSL Certificate
```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d pulseapp.jahandco.com
```
- [ ] Certificate installed successfully
- [ ] HTTPS redirects working
- [ ] Auto-renewal configured

### 4. Test Application

#### Basic Tests
- [ ] http://pulseapp.jahandco.com redirects to HTTPS
- [ ] https://pulseapp.jahandco.com loads
- [ ] No console errors in browser
- [ ] All assets load (CSS, JS, images)
- [ ] Particle animation works

#### Authentication Tests
- [ ] Can access login page
- [ ] Can create new account
- [ ] Can login with existing account
- [ ] Can logout
- [ ] Session persists after refresh

#### Feature Tests
- [ ] Timeline posts load
- [ ] Can create new post
- [ ] Can like posts
- [ ] Can comment on posts
- [ ] Can delete own posts
- [ ] Board page works (discussions & polls)
- [ ] Groups page works
- [ ] Profile page works
- [ ] Theme switching works

### 5. Security Verification

- [ ] HTTPS enabled and working
- [ ] HTTP redirects to HTTPS
- [ ] Security headers present (check with browser dev tools)
- [ ] No mixed content warnings
- [ ] Firebase rules updated (see README.md)
- [ ] File permissions correct (www-data:www-data)

### 6. Performance Check

- [ ] Page loads in under 3 seconds
- [ ] Images load properly
- [ ] No 404 errors in console
- [ ] Gzip compression enabled
- [ ] Caching headers working

### 7. Monitoring Setup

- [ ] Error logs accessible
  ```bash
  sudo tail -f /var/log/apache2/pulseapp.jahandco.com-ssl-error.log
  ```
- [ ] Access logs accessible
  ```bash
  sudo tail -f /var/log/apache2/pulseapp.jahandco.com-ssl-access.log
  ```
- [ ] Log rotation configured
- [ ] Monitoring alerts setup (optional)

## Post-Deployment

### Firebase Configuration
- [ ] Update Firestore rules in Firebase Console
- [ ] Update Storage rules in Firebase Console
- [ ] Add pulseapp.jahandco.com to authorized domains
- [ ] Test Firebase authentication from live site

### DNS & SSL
- [ ] SSL certificate auto-renewal tested
  ```bash
  sudo certbot renew --dry-run
  ```
- [ ] Certificate expires in 90 days (check)
- [ ] DNS propagation complete

### Backup Setup
- [ ] Initial backup created
- [ ] Backup script configured (optional)
- [ ] Backup schedule set (optional)

### Documentation
- [ ] Team informed of deployment
- [ ] Access credentials documented
- [ ] Emergency contacts listed

## Troubleshooting Reference

### Common Issues

**403 Forbidden Error**
```bash
sudo chown -R www-data:www-data /var/www/pulseapp.jahandco.com
sudo chmod -R 755 /var/www/pulseapp.jahandco.com
```

**500 Internal Server Error**
```bash
sudo tail -50 /var/log/apache2/pulseapp.jahandco.com-error.log
apache2ctl -t
```

**Rewrite Rules Not Working**
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

**SSL Certificate Issues**
```bash
sudo certbot certificates
sudo certbot renew
```

**Firebase Connection Issues**
- Check .env file has correct credentials
- Verify domain in Firebase Console authorized domains
- Check browser console for specific errors

## Verification Commands

```bash
# Check Apache status
sudo systemctl status apache2

# Test Apache config
sudo apache2ctl configtest

# Check enabled sites
sudo apache2ctl -S

# View enabled modules
sudo apache2ctl -M | grep rewrite

# Check SSL certificate
sudo certbot certificates

# Test SSL configuration
curl -I https://pulseapp.jahandco.com

# Check file permissions
ls -la /var/www/pulseapp.jahandco.com/public
```

## Rollback Plan

If issues occur:

1. Disable the site:
   ```bash
   sudo a2dissite pulseapp.jahandco.com.conf
   sudo systemctl reload apache2
   ```

2. Review logs:
   ```bash
   sudo tail -100 /var/log/apache2/pulseapp.jahandco.com-error.log
   ```

3. Fix issues and re-enable:
   ```bash
   sudo a2ensite pulseapp.jahandco.com.conf
   sudo systemctl reload apache2
   ```

## Success Criteria

Deployment is successful when:
- ✅ Site loads via HTTPS
- ✅ All features work correctly
- ✅ No errors in logs
- ✅ SSL certificate valid
- ✅ Security headers present
- ✅ Performance acceptable (< 3s load time)
- ✅ Mobile responsive
- ✅ Firebase integration working

## Sign-Off

- [ ] Development team approved
- [ ] Testing completed
- [ ] Documentation updated
- [ ] Monitoring active
- [ ] Deployment date: _______________
- [ ] Deployed by: _______________
- [ ] Status: _______________

---

**Note**: Keep this checklist and update it as needed for future deployments.
