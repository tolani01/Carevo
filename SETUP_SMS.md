# Supabase SMS Authentication Setup Guide

## 🔧 **Step 1: Configure Supabase Dashboard**

### 1.1 Enable Phone Provider
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/uaizskfvzcnfbexsliwx
2. Navigate to **Authentication** → **Providers**
3. Find **Phone** provider and click **Enable**
4. Configure the following settings:
   - **Enable phone confirmations**: ON
   - **Enable phone change confirmations**: ON

### 1.2 Set Up Twilio (SMS Provider)
1. In **Authentication** → **Providers** → **Phone**
2. You need to add Twilio credentials:
   - **Twilio Account SID**
   - **Twilio Auth Token** 
   - **Twilio Messaging Service SID**

## 🔑 **Step 2: Get Twilio Credentials**

### Option A: Free Twilio Trial Account
1. Go to https://www.twilio.com/try-twilio
2. Sign up for a free account
3. You'll get:
   - Account SID (starts with AC...)
   - Auth Token (hidden, copy it)
   - Free $15 credit for testing

### Option B: Use Supabase's Built-in SMS (Limited)
- Supabase has a built-in SMS service with limited free messages
- No external setup required
- Good for development/testing

## ⚙️ **Step 3: Configure Environment Variables**

Add these to your `.env.local`:
```env
# Supabase SMS Configuration
SUPABASE_SMS_ENABLED=true
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_MESSAGING_SERVICE_SID=your_messaging_service_sid
```

## 🚀 **Step 4: Update Code for Real SMS**

The code is already prepared! We just need to:
1. Switch from development mode to production mode
2. Update the authentication functions
3. Test with real phone numbers

## 📱 **Step 5: Test Real SMS**

1. Enter a real phone number (your own)
2. Click "Send Verification Code"
3. Check your phone for the SMS
4. Enter the code you receive
5. You should be logged in!

## 💰 **Costs**

### Twilio Free Trial:
- $15 credit included
- ~$0.0075 per SMS in US
- ~2000 SMS messages for free

### Supabase Built-in SMS:
- Limited free messages
- Check your Supabase dashboard for limits

## 🔧 **Troubleshooting**

### Common Issues:
1. **No SMS received**: Check Twilio logs in dashboard
2. **Invalid phone format**: Ensure +1 country code
3. **Rate limiting**: Wait a few minutes between attempts
4. **Wrong credentials**: Double-check Twilio settings

### Debug Steps:
1. Check Supabase Auth logs
2. Check Twilio console for message status
3. Verify phone number format
4. Check environment variables

## 📞 **Phone Number Formats**

Supported formats:
- `+1234567890` (recommended)
- `+1 (234) 567-8900`
- `2345678900` (will add +1 automatically)

## 🎯 **Next Steps**

1. Choose your SMS provider (Twilio recommended)
2. Get credentials
3. Configure Supabase dashboard
4. Test with your phone number
5. Deploy to production when ready
