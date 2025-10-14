#!/bin/bash
# Deployment script for Jah and Co Pulse Application
# Usage: sudo ./deploy.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Jah and Co Pulse Deployment${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Configuration
DOMAIN="pulseapp.jahandco.com"
INSTALL_DIR="/var/www/$DOMAIN"
CURRENT_DIR="$(pwd)"

echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"
# Check if Apache is installed
if ! command -v apache2 &> /dev/null; then
    echo -e "${RED}Apache is not installed. Installing...${NC}"
    apt update
    apt install -y apache2
fi

# Check required modules
echo -e "${YELLOW}Step 2: Enabling Apache modules...${NC}"
a2enmod rewrite ssl headers deflate expires 2>/dev/null || true

echo -e "${YELLOW}Step 3: Creating installation directory...${NC}"
mkdir -p "$INSTALL_DIR"

echo -e "${YELLOW}Step 4: Copying files...${NC}"
# Copy all files to installation directory if not already there
if [ "$CURRENT_DIR" != "$INSTALL_DIR" ]; then
    cp -r "$CURRENT_DIR"/* "$INSTALL_DIR/"
    cp "$CURRENT_DIR"/.htaccess "$INSTALL_DIR/" 2>/dev/null || true
    cp "$CURRENT_DIR"/.env "$INSTALL_DIR/" 2>/dev/null || true
    cp "$CURRENT_DIR"/.gitignore "$INSTALL_DIR/" 2>/dev/null || true
fi

echo -e "${YELLOW}Step 5: Setting permissions...${NC}"
chown -R www-data:www-data "$INSTALL_DIR"
chmod -R 755 "$INSTALL_DIR"

echo -e "${YELLOW}Step 6: Configuring Apache virtual host...${NC}"
# Copy virtual host configuration
if [ -f "$INSTALL_DIR/$DOMAIN.conf" ]; then
    cp "$INSTALL_DIR/$DOMAIN.conf" "/etc/apache2/sites-available/"
    a2ensite "$DOMAIN.conf"
fi

# Test Apache configuration
echo -e "${YELLOW}Step 7: Testing Apache configuration...${NC}"
if apache2ctl configtest; then
    echo -e "${GREEN}Apache configuration is valid${NC}"
else
    echo -e "${RED}Apache configuration has errors. Please fix before continuing.${NC}"
    exit 1
fi

# Reload Apache
echo -e "${YELLOW}Step 8: Reloading Apache...${NC}"
systemctl reload apache2

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Install SSL certificate:"
echo "   sudo certbot --apache -d $DOMAIN"
echo ""
echo "2. Test your site:"
echo "   http://$DOMAIN"
echo ""
echo "3. Monitor logs:"
echo "   sudo tail -f /var/log/apache2/$DOMAIN-error.log"
echo ""
echo -e "${GREEN}Deployment script finished successfully!${NC}"
