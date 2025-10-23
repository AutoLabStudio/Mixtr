# Test Credentials for Production

Your production environment is fully functional at:
**https://mixtr.autolabstudio.xyz**

## Test Account

A test user has been created for you:

### Customer Account
- **Username**: `demo`
- **Email**: `demo@mixtr.com`
- **Password**: `Demo123!`
- **Role**: Customer
- **User ID**: 4

## How to Test

### In Browser
1. Open https://mixtr.autolabstudio.xyz
2. Click on "Login" or "Sign In"
3. Enter:
   - Username: `demo`
   - Password: `Demo123!`
4. You should be logged in successfully!

### Using curl
```bash
# Login and save session
curl -X POST https://mixtr.autolabstudio.xyz/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"Demo123!"}' \
  -c cookies.txt

# Access authenticated endpoint
curl https://mixtr.autolabstudio.xyz/api/user -b cookies.txt
```

## Create More Users

### Customer
```bash
curl -X POST https://mixtr.autolabstudio.xyz/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "customer1",
    "email": "customer1@example.com",
    "password": "Password123!",
    "role": "customer"
  }'
```

### Admin
```bash
curl -X POST https://mixtr.autolabstudio.xyz/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@mixtr.com",
    "password": "Admin123!",
    "role": "admin"
  }'
```

### Partner
```bash
curl -X POST https://mixtr.autolabstudio.xyz/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "partner1",
    "email": "partner@bar.com",
    "password": "Partner123!",
    "role": "partner",
    "barId": 1,
    "position": "Manager",
    "phone": "+34123456789"
  }'
```

## Features to Test

1. **User Registration**: https://mixtr.autolabstudio.xyz/register
2. **User Login**: https://mixtr.autolabstudio.xyz/login
3. **Browse Cocktails**: https://mixtr.autolabstudio.xyz/cocktails
4. **Browse Bars**: https://mixtr.autolabstudio.xyz/bars
5. **User Profile**: https://mixtr.autolabstudio.xyz/profile

## Verified Working

✅ User registration
✅ User login with session management
✅ Secure password hashing
✅ Session persistence with PostgreSQL
✅ HTTPS/SSL via Cloudflare
✅ Database connectivity (mixtr_prod)

## Security Notes

- Passwords are hashed using scrypt
- Sessions are stored in PostgreSQL
- SESSION_SECRET has been updated to a secure value
- HTTPS enforced via Cloudflare tunnel

---

**Production URL**: https://mixtr.autolabstudio.xyz
**Last Tested**: October 23, 2025
**Status**: ✅ Fully Operational
