# n8n Workflows

## Which file to use

### `main-chatbot-workflow.json` — Development / Setup
Use this when setting up the project from scratch.
- Google Sheets: OAuth2 auth, credential ID `CONFIGURE_ME` (replace with your own)
- Sheets reference: reads `$env.GOOGLE_SHEETS_SPREADSHEET_ID` via env var
- Gemini: calls API via HTTP node using `$env.GEMINI_API_KEY`
- Section detection: keyword map (SD, AIML, CYS, IBM, Xebia)

### `main-chatbot-workflow-deployed.json` — Production Snapshot
Exported from the live running n8n instance. Kept here for backup/recovery.
- Google Sheets: Service Account auth, real credential ID `hUoDZ9uB4WIQIviJ`
- Sheets reference: hardcoded spreadsheet URL
- Gemini: handled inside "AI Formatter" Code node
- Section detection: regex (Sec-A through Sec-SM)

**Do not share this file publicly** — it contains real credential IDs.

## Import steps

1. Open n8n at `http://localhost:5678`
2. Workflows → Import from file → select `main-chatbot-workflow.json`
3. Open the "Google Sheets - Read Timetable" node → assign your OAuth2 credential
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
