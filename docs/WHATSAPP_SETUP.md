# WhatsApp Cloud API Setup Guide

## Prerequisites

- Facebook Developer Account (free)
- Meta Business Account (free)
- A phone number for the WhatsApp Business bot

## Step-by-Step Setup

### 1. Create a Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click "Create App" → Select "Business" type
3. Name it: `JECRC Timetable Bot`
4. Add product: **WhatsApp**

### 2. Get Credentials

From the WhatsApp section of your app dashboard:

- **Phone Number ID**: Found under WhatsApp > Getting Started
- **WhatsApp Business Account ID**: Same page
- **Permanent Access Token**: Generate from System Users (see step 3)

### 3. Generate Permanent Token

1. Go to Business Settings → System Users
2. Create a system user with "Admin" role
3. Add assets: Select your WhatsApp app
4. Generate token with permissions:
   - `whatsapp_business_management`
   - `whatsapp_business_messaging`
5. Copy the token — this goes in your `.env` as `WHATSAPP_API_TOKEN`

### 4. Configure Webhook in Meta Dashboard

1. In your app → WhatsApp → Configuration
2. Set Webhook URL: `https://your-domain.com/webhook/whatsapp`
   - For local development, use ngrok: `ngrok http 5678`
3. Set Verify Token: Same value as `WHATSAPP_VERIFY_TOKEN` in your `.env`
4. Subscribe to: `messages`

### 5. Configure n8n

1. Open n8n at `http://localhost:5678`
2. Import `n8n-workflows/whatsapp-webhook-workflow.json`
3. Add HTTP Header Auth credential:
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_PERMANENT_ACCESS_TOKEN`
4. Activate the workflow

### 6. Test

1. Send a WhatsApp message to your bot's number
2. Try: "What's my Monday schedule for SD section?"
3. Bot should respond within 3 seconds

## Environment Variables

```env
WHATSAPP_API_TOKEN=your_permanent_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=any_random_string_you_choose
```

## Architecture

```
Student WhatsApp Message
        │
        ▼
Meta Cloud API ──POST──→ n8n Webhook (/webhook/whatsapp)
                              │
                              ▼
                    Extract & Preprocess Query
                              │
                              ▼
                    Gemini 1.5 Flash (AI Agent)
                              │
                              ▼
                    Send Reply via Graph API
                              │
                              ▼
                    Student receives response
```

## Costs

- **WhatsApp Business API**: First 1,000 conversations/month FREE
- **After free tier**: ~$0.005–$0.08 per conversation (varies by country)
- **Gemini 1.5 Flash**: ~$0.075 per 1M input tokens (very cheap)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Webhook not verifying | Check verify token matches in both Meta dashboard and n8n |
| Messages not received | Ensure webhook subscription includes "messages" |
| Bot not replying | Check n8n execution logs for errors |
| 401 from Graph API | Token expired or wrong — regenerate |
| Duplicate messages | Add message ID deduplication in Extract Message node |

## Local Development with ngrok

```bash
# Install ngrok
brew install ngrok

# Expose n8n webhook
ngrok http 5678

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Set as webhook URL in Meta dashboard: https://abc123.ngrok.io/webhook/whatsapp
```
