# Production Deployment Guide

## System Service Setup

### 1. Install the systemd service

```bash
sudo cp mixtr-production.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable mixtr-production
sudo systemctl start mixtr-production
```

### 2. Verify service status

```bash
sudo systemctl status mixtr-production
journalctl -u mixtr-production -f  # View logs
```

## Cloudflare DNS Configuration

### Add A Record

1. Log in to Cloudflare dashboard
2. Select the `autolabstudio.xyz` domain
3. Go to DNS settings
4. Add an A record:
   - **Name**: `mixtr`
   - **IPv4 address**: `10.147.17.70`
   - **Proxy status**: Proxied (orange cloud) - enables SSL
   - **TTL**: Auto

## Nginx Reverse Proxy Configuration

### 1. Create Nginx configuration

```bash
sudo nano /etc/nginx/sites-available/mixtr-production
```

Add this configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name mixtr.autolabstudio.xyz;

    location / {
        proxy_pass http://127.0.0.1:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/mixtr-production /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL/HTTPS Configuration

Since we're using Cloudflare's proxy (orange cloud), SSL is automatically handled by Cloudflare:

1. In Cloudflare dashboard, go to SSL/TLS settings
2. Set SSL/TLS encryption mode to **Flexible** or **Full**
3. Enable **Always Use HTTPS** under SSL/TLS > Edge Certificates
4. Enable **Automatic HTTPS Rewrites**

## Firewall Configuration

Ensure ports are open:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5002/tcp  # Only if needed for direct access
sudo ufw reload
```

## Environment Variables

Production environment variables are in `.env.production`:
- `PORT=5002`
- `HOST=0.0.0.0`
- `NODE_ENV=production`
- `DATABASE_URL=postgresql://mixtr_user:Mixtr2025!SecurePass@localhost:5432/mixtr_prod`
- `API_URL=http://10.147.17.70:5002`

**IMPORTANT**: Update `SESSION_SECRET` before going live!

## Post-Deployment Checks

1. **Service is running**:
   ```bash
   sudo systemctl status mixtr-production
   ```

2. **Application responds locally**:
   ```bash
   curl http://localhost:5002
   ```

3. **DNS resolves**:
   ```bash
   nslookup mixtr.autolabstudio.xyz
   ```

4. **HTTPS works**:
   ```bash
   curl -I https://mixtr.autolabstudio.xyz
   ```

5. **Database connection works**: Check logs for database errors

## Troubleshooting

### View logs
```bash
journalctl -u mixtr-production -f
```

### Restart service
```bash
sudo systemctl restart mixtr-production
```

### Check Nginx logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Test database connection
```bash
psql -U mixtr_user -d mixtr_prod -h localhost
```
