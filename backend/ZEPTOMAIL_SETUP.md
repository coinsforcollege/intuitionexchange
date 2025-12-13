# ZeptoMail Setup Guide

## ✅ What's Done:
- SendGrid removed
- ZeptoMail package installed
- Email service created with ready-to-use methods

## 🔑 Get Your ZeptoMail API Token:

1. **Sign up/Login** at [ZeptoMail](https://www.zoho.com/zeptomail/)

2. **Get API Token**:
   - Go to Settings → Mail Agents
   - Create a new Mail Agent or use existing
   - Copy the API token (starts with `Zoho-enczapitoken...`)

3. **Update `.env` file**:
   ```bash
   ZEPTOMAIL_API_TOKEN=Zoho-enczapitoken_YOUR_TOKEN_HERE
   FROM_EMAIL=noreply@yourdomain.com
   ```

4. **Verify Domain** (Important!):
   - In ZeptoMail dashboard, add your domain
   - Add the required DNS records (SPF, DKIM, etc.)
   - Verify the domain
   - Use an email from that verified domain in `FROM_EMAIL`

## 📧 Available Email Methods:

The `EmailService` has 3 ready-to-use methods:

### 1. Send OTP
```typescript
await emailService.sendOTP('user@example.com', '123456', 'email');
```

### 2. Send Password Reset
```typescript
await emailService.sendPasswordReset('user@example.com', 'reset-token-123');
```

### 3. Send Welcome Email
```typescript
await emailService.sendWelcome('user@example.com', 'John Doe');
```

## 🧪 Testing:

Before adding real credentials, the service will log warnings but won't crash:
```
ZeptoMail not configured, skipping email send
```

Once you add your real API token, emails will be sent automatically!

## 📝 Next Steps:

1. Get ZeptoMail API token
2. Verify your domain in ZeptoMail
3. Update `.env` with real token and verified email
4. Test by calling `emailService.sendOTP()` in your code

---

**Note**: ZeptoMail free tier includes 10,000 emails/month, perfect for development and small-scale production!
