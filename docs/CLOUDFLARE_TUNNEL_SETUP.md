# Cloudflare Tunnel Setup (No Static IP Required!)

Cloudflare Tunnel creates a secure connection from your server to Cloudflare without exposing your IP or requiring port forwarding.

## Benefits
- ✅ No static IP needed
- ✅ No port forwarding required
- ✅ Free SSL certificate
- ✅ DDoS protection
- ✅ Works behind NAT/firewall
- ✅ Hides your origin IP

## Setup Steps

### 1. Install cloudflared

```bash
# Download and install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### 2. Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This will open a browser to authorize. Select your `autolabstudio.xyz` domain.

### 3. Create a Tunnel

```bash
cloudflared tunnel create mixtr-production
```

This creates a tunnel and saves credentials to `~/.cloudflared/`

### 4. Create Tunnel Configuration

```bash
sudo mkdir -p /etc/cloudflared
sudo nano /etc/cloudflared/config.yml
```

Add this configuration:

```yaml
tunnel: <TUNNEL_ID_FROM_PREVIOUS_STEP>
credentials-file: /home/ilseralex/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: mixtr.autolabstudio.xyz
    service: http://localhost:5002
  - service: http_status:404
```

### 5. Route DNS to Tunnel

```bash
cloudflared tunnel route dns mixtr-production mixtr.autolabstudio.xyz
```

This automatically creates the DNS record in Cloudflare!

### 6. Install as System Service

```bash
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

### 7. Verify Tunnel Status

```bash
sudo systemctl status cloudflared
cloudflared tunnel list
cloudflared tunnel info mixtr-production
```

## Testing

After setup, your app at `http://localhost:5002` will be accessible at:
```
https://mixtr.autolabstudio.xyz
```

No Nginx needed! Cloudflare Tunnel handles everything.

## Troubleshooting

### Check tunnel logs
```bash
sudo journalctl -u cloudflared -f
```

### Restart tunnel
```bash
sudo systemctl restart cloudflared
```

### Delete and recreate tunnel
```bash
cloudflared tunnel delete mixtr-production
# Then repeat steps 3-6
```

## Production Setup

The tunnel will:
1. Connect your local app (port 5002) to Cloudflare
2. Provide free SSL/TLS
3. Hide your origin IP
4. Survive IP changes
5. Work behind any firewall/NAT

No more worrying about dynamic IPs!
