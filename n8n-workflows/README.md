# n8n Workflows

## Production workflow

**`main-chatbot-workflow-deployed.json`** — the deployed workflow, exported from the live n8n instance.
- Google Sheets: Service Account auth, credential ID `hUoDZ9uB4WIQIviJ`
- Sheets reference: hardcoded spreadsheet URL
- Gemini: "AI Formatter" Code node
- Section detection: regex (Sec-A through Sec-SM)

**Do not share this file publicly** — it contains real credential IDs.

## Import steps

1. Open n8n at `http://localhost:5678`
2. Workflows → Import from file → select `main-chatbot-workflow-deployed.json`
3. Confirm the Google Sheets credential is linked (Service Account type)
4. Toggle workflow to **Active**

## Other files

| File | Purpose |
|---|---|
| `whatsapp-verify-workflow.json` | Handles WhatsApp webhook verification handshake |
| `whatsapp-messages-workflow.json` | Receives and routes incoming WhatsApp messages |
| `whatsapp-webhook-workflow.json` | Entry point for WhatsApp webhook events |
| `whatsapp-fixed.json` | Patched version of the WhatsApp flow |
| `holidays-2026.json` | Holiday date list used by the holiday-check node |
| `system-prompt.md` | Gemini agent system prompt content |
