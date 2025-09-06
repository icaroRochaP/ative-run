#!/bin/bash

# Deploy script for ative.codic.com.br
# Run this script on your server to deploy the Ative Run application

set -e

echo "🚀 Starting deployment for ative.codic.com.br..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_warning "Running as root. Consider using a non-root user for deployment."
fi

# Create deployment directory
DEPLOY_DIR="/opt/ative-run"
print_status "Creating deployment directory: $DEPLOY_DIR"
sudo mkdir -p $DEPLOY_DIR
sudo chown $USER:$USER $DEPLOY_DIR

# Clone or update repository
if [ -d "$DEPLOY_DIR/.git" ]; then
    print_status "Updating existing repository..."
    cd $DEPLOY_DIR
    git fetch origin
    git reset --hard origin/main
else
    print_status "Cloning repository..."
    git clone https://github.com/icaroRochaP/ative-run.git $DEPLOY_DIR
    cd $DEPLOY_DIR
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Copying from .env.example"
    cp .env.example .env.local
    print_error "Please edit .env.local with your actual environment variables before continuing!"
    print_status "Required variables to configure:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo "  - NEXT_PUBLIC_STRAVA_CLIENT_ID"
    echo "  - STRAVA_CLIENT_SECRET"
    echo "  - NEXTAUTH_SECRET"
    echo ""
    echo "Edit the file with: nano .env.local"
    echo "Then run this script again."
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install --frozen-lockfile
elif command -v npm &> /dev/null; then
    npm ci
else
    print_error "Neither pnpm nor npm found. Please install Node.js and pnpm."
    exit 1
fi

# Build the application
print_status "Building application..."
pnpm run build:portal

# Check if build was successful
if [ $? -eq 0 ]; then
    print_status "Build completed successfully!"
else
    print_error "Build failed. Check the logs above."
    exit 1
fi

# Setup systemd service (optional)
setup_systemd_service() {
    print_status "Setting up systemd service..."
    
    sudo tee /etc/systemd/system/ative-run.service > /dev/null <<EOF
[Unit]
Description=Ative Run - Next.js Application
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$DEPLOY_DIR/apps/portal-web
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=$(which pnpm) start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable ative-run
    sudo systemctl restart ative-run
    
    print_status "Systemd service configured and started!"
}

# Ask if user wants to setup systemd service
read -p "Do you want to setup systemd service? (y/N): " setup_service
if [[ $setup_service =~ ^[Yy]$ ]]; then
    setup_systemd_service
fi

# Setup nginx configuration (optional)
setup_nginx() {
    print_status "Setting up nginx configuration..."
    
    sudo tee /etc/nginx/sites-available/ative.codic.com.br > /dev/null <<EOF
server {
    listen 80;
    server_name ative.codic.com.br;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    sudo ln -sf /etc/nginx/sites-available/ative.codic.com.br /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
    
    print_status "Nginx configuration setup complete!"
}

# Ask if user wants to setup nginx
read -p "Do you want to setup nginx configuration? (y/N): " setup_nginx_config
if [[ $setup_nginx_config =~ ^[Yy]$ ]]; then
    setup_nginx
fi

print_status "🎉 Deployment completed successfully!"
print_status "Application should be running on: http://ative.codic.com.br"

# Show service status if systemd was configured
if [[ $setup_service =~ ^[Yy]$ ]]; then
    print_status "Service status:"
    sudo systemctl status ative-run --no-pager
fi

print_status "Deployment logs:"
echo "  - Application logs: journalctl -u ative-run -f"
echo "  - Nginx logs: tail -f /var/log/nginx/error.log"
echo "  - Build logs: Check build output above"

print_status "To update the application in the future, run this script again!"
