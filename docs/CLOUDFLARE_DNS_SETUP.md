# Cloudflare DNS Configuration for mixtr.autolabstudio.xyz

## Option 1: Using Cloudflare Dashboard (Recommended)

1. **Log in to Cloudflare**
   - Go to https://dash.cloudflare.com/
   - Select the `autolabstudio.xyz` domain

2. **Add DNS A Record**
   - Navigate to **DNS** → **Records**
   - Click **Add record**
   - Configure:
     - **Type**: A
     - **Name**: mixtr
     - **IPv4 address**: 10.147.17.70
     - **Proxy status**: ✅ Proxied (orange cloud icon)
     - **TTL**: Auto
   - Click **Save**

3. **Verify DNS Propagation**
   ```bash
   # Check DNS resolution
   nslookup mixtr.autolabstudio.xyz

   # Should show Cloudflare proxy IPs (not your direct IP when proxied)
   dig mixtr.autolabstudio.xyz
   ```

## Option 2: Using Cloudflare API

### Prerequisites
You need:
- Cloudflare API Token with DNS edit permissions
- Zone ID for autolabstudio.xyz

### Get Zone ID
```bash
# Using API token
curl -X GET "https://api.cloudflare.com/client/v4/zones?name=autolabstudio.xyz" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json"
```

### Create DNS A Record
```bash
# Replace with your actual values
ZONE_ID="your_zone_id_here"
API_TOKEN="your_api_token_here"

curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "A",
    "name": "mixtr",
    "content": "10.147.17.70",
    "ttl": 1,
    "proxied": true
  }'
```

### Verify DNS Record
```bash
curl -X GET "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?name=mixtr.autolabstudio.xyz" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json"
```

## Option 3: Using Cloudflare MCP (If Configured)

If you have the Cloudflare MCP server properly configured with credentials:

```bash
# The MCP tools should be available in Claude Code
# Tools like: cloudflare_list_zones, cloudflare_create_dns_record, etc.
```

**Note**: The Cloudflare MCP requires:
- API token stored in environment variables or config
- Proper authentication setup in the MCP server configuration

## SSL/TLS Configuration

Once DNS is set up:

1. **In Cloudflare Dashboard**:
   - Go to **SSL/TLS** → **Overview**
   - Set encryption mode to **Full** (recommended) or **Flexible**
   - **Full**: Encrypts traffic between Cloudflare and your origin server
   - **Flexible**: Encrypts only between visitor and Cloudflare

2. **Enable Additional Security**:
   - **SSL/TLS** → **Edge Certificates**
   - ✅ Enable **Always Use HTTPS**
   - ✅ Enable **Automatic HTTPS Rewrites**
   - ✅ Enable **Minimum TLS Version**: 1.2

3. **Origin Server Certificate** (Optional but recommended):
   - Generate an origin certificate in Cloudflare
   - Install it on your Nginx server for end-to-end encryption

## DNS Record Details

| Field | Value |
|-------|-------|
| Type | A |
| Name | mixtr |
| Content | 10.147.17.70 |
| Proxy Status | Proxied (Orange Cloud) |
| TTL | Auto |

## Benefits of Cloudflare Proxy (Orange Cloud)

When proxied (orange cloud enabled):
- ✅ Free SSL/TLS certificate
- ✅ DDoS protection
- ✅ Web Application Firewall (WAF)
- ✅ CDN caching
- ✅ Hides your origin IP address
- ✅ Analytics and logs

## Troubleshooting

### DNS Not Resolving
```bash
# Clear local DNS cache
sudo systemd-resolve --flush-caches

# Check Cloudflare DNS directly
dig @1.1.1.1 mixtr.autolabstudio.xyz
```

### SSL Certificate Errors
- Ensure Cloudflare SSL/TLS mode is set correctly
- Check that Nginx is properly configured
- Verify firewall allows ports 80 and 443

### 502 Bad Gateway
- Check if the application is running: `sudo systemctl status mixtr-production`
- Verify Nginx proxy configuration
- Check application logs: `journalctl -u mixtr-production -f`

## Next Steps

After DNS is configured:
1. Wait 1-5 minutes for DNS propagation
2. Configure Nginx reverse proxy
3. Test HTTPS access: `https://mixtr.autolabstudio.xyz`
4. Verify application functionality
