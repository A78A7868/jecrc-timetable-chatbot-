# Complete Credentials Setup Guide

Follow these 3 steps to get all credentials. Total time: ~20 minutes.

---

## Step 1: Gemini API Key (5 minutes)

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select any Google Cloud project (or create one)
5. Copy the API key

**Where to use:** In n8n → Credentials → Add new → "Google Gemini API" → paste key

---

## Step 2: Google Sheets OAuth 2.0 (10 minutes)

### 2a. Enable the API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: `jecrc-timetable-bot`
3. Go to **APIs & Services → Library**
4. Search "Google Sheets API" → Click **Enable**
5. Search "Google Drive API" → Click **Enable**

### 2b. Create OAuth Credentials

1. Go to **APIs & Services → Credentials**
2. Click **"+ CREATE CREDENTIALS" → "OAuth client ID"**
3. If prompted, configure the **OAuth Consent Screen** first:
   - User Type: **External**
   - App name: `JECRC Timetable Bot`
   - User support email: your email
   - Developer email: your email
   - Click Save → Continue through scopes (add `.../auth/spreadsheets.readonly`) → Add test users (your email) → Save
4. Back to Credentials → Create OAuth client ID:
   - Application type: **Web application**
   - Name: `n8n-sheets`
   - Authorized redirect URIs: `http://localhost:5678/rest/oauth2-credential/callback`
   - Click **Create**
5. Copy **Client ID** and **Client Secret**

### 2c. Configure in n8n

1. Open n8n at `http://localhost:5678`
2. Go to **Credentials → Add new → Google Sheets OAuth2 API**
3. Paste Client ID and Client Secret
4. Click **"Sign in with Google"** — authorize access
5. Save the credential

### 2d. Get Your Spreadsheet ID

Your Google Sheet URL looks like:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
```

Copy the `SPREADSHEET_ID_HERE` part and add it to your `.env`:
```
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
```

Also set this as an n8n environment variable in `docker/docker-compose.yml`:
```yaml
environment:
  - GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
```

---

## Step 3: WhatsApp Business API (10 minutes)

### 3a. Create Meta Developer App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Log in with Facebook account
3. Click **"Create App"**
4. App Type: **Business**
5. App Name: `JECRC Timetable Bot`
6. Click **Create**

### 3b. Add WhatsApp Product

1. In your app dashboard → **Add Product → WhatsApp → Set Up**
2. Under **WhatsApp → Getting Started**, you'll see:
   - **Temporary Access Token** (expires in 24h — for testing)
   - **Phone Number ID**
   - **WhatsApp Business Account ID**
3. Copy the **Phone Number ID**

### 3c. Generate Permanent Access Token

1. Go to **Business Settings → System Users**
2. Click **Add** → Name: `n8n-bot` → Role: Admin
3. Click **Add Assets** → Select your app → Full Control
4. Click **Generate Token** → Select permissions:
   - `whatsapp_business_management`
   - `whatsapp_business_messaging`
5. Copy the token — this is your permanent token

### 3d. Set Up Webhook

1. In your app → **WhatsApp → Configuration**
2. Webhook URL: `https://YOUR_DOMAIN/webhook/whatsapp`
   - For local dev: use ngrok (`ngrok http 5678`) and use the HTTPS URL
3. Verify Token: any string you choose (e.g., `jecrc_verify_2026`)
4. Click **Verify and Save**
5. Subscribe to webhook field: **messages**

### 3e. Configure in n8n

1. Go to **Credentials → Add new → HTTP Header Auth**
2. Header Name: `Authorization`
3. Header Value: `Bearer YOUR_PERMANENT_TOKEN`
4. Save

### 3f. Update .env

```env
WHATSAPP_API_TOKEN=your_permanent_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=jecrc_verify_2026
```

---

## Quick Verification Checklist

After setup, verify each credential:

| Credential | How to Test |
|------------|-------------|
| Gemini API | In n8n, create a test AI node and send "Hello" |
| Google Sheets | In n8n, add a Google Sheets node → try reading your sheet |
| WhatsApp | Send a test message to your bot number |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "OAuth consent screen not configured" | Complete the consent screen setup in Google Cloud |
| "Redirect URI mismatch" | Add `http://localhost:5678/rest/oauth2-credential/callback` to OAuth app |
| "Google Sheets returns 403" | Share the spreadsheet with the Google account used for OAuth |
| "Gemini returns 401" | Check API key is correct and billing is enabled |
| "WhatsApp webhook fails" | Ensure ngrok is running and URL matches Meta dashboard |
| "n8n can't reach Google" | Ensure Docker container has internet access |

---

## Environment Variables Summary

```env
# .env file — all values needed
GOOGLE_SHEETS_SPREADSHEET_ID=1abc...xyz
GEMINI_API_KEY=AIza...
WHATSAPP_API_TOKEN=EAAx...
WHATSAPP_PHONE_NUMBER_ID=10000...
WHATSAPP_VERIFY_TOKEN=jecrc_verify_2026
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_secure_password
```
