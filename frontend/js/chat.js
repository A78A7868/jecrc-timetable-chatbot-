/**
 * JECRC Timetable ChatBot - Frontend Communication Module
 * Handles user input, webhook communication, and response rendering.
 */

const WEBHOOK_URL = window.location.protocol + '//' + window.location.host + '/webhook/chatbot';

const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = messageInput.value.trim();
    if (!query) return;

    appendMessage(query, 'user');
    messageInput.value = '';
    sendBtn.disabled = true;

    showTypingIndicator();

    try {
        const response = await sendQuery(query);
        removeTypingIndicator();
        appendMessage(response, 'bot');
    } catch (error) {
        removeTypingIndicator();
        appendMessage('Sorry, I encountered an error. Please try again.', 'bot');
        console.error('Chat error:', error);
    } finally {
        sendBtn.disabled = false;
        messageInput.focus();
    }
});

async function sendQuery(query) {
    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: query,
            timestamp: new Date().toISOString()
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || data.output || data.message || 'No response received.';
}

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.innerHTML = `
        <div class="message-content">
            ${formatResponse(text)}
        </div>
        <span class="message-time">${now}</span>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatResponse(text) {
    const lines = text.split('\n');
    const out = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Markdown table block (lines starting with |)
        if (line.trim().startsWith('|')) {
            const block = [];
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                block.push(lines[i]);
                i++;
            }
            out.push(renderTable(block));
            continue;
        }

        // Bullet list (- or *)
        if (/^[ \t]*[-*] /.test(line)) {
            const items = [];
            while (i < lines.length && /^[ \t]*[-*] /.test(lines[i])) {
                items.push('<li>' + inlineFmt(lines[i].replace(/^[ \t]*[-*] /, '')) + '</li>');
                i++;
            }
            out.push('<ul>' + items.join('') + '</ul>');
            continue;
        }

        // Numbered list
        if (/^\d+\. /.test(line)) {
            const items = [];
            while (i < lines.length && /^\d+\. /.test(lines[i])) {
                items.push('<li>' + inlineFmt(lines[i].replace(/^\d+\. /, '')) + '</li>');
                i++;
            }
            out.push('<ol>' + items.join('') + '</ol>');
            continue;
        }

        // Headings (# ## ###)
        const hMatch = line.match(/^(#{1,3}) (.+)/);
        if (hMatch) {
            const lvl = Math.min(hMatch[1].length + 2, 5);
            out.push(`<h${lvl}>${inlineFmt(hMatch[2])}</h${lvl}>`);
            i++;
            continue;
        }

        // Empty line → spacing
        if (line.trim() === '') {
            out.push('<br>');
            i++;
            continue;
        }

        // Plain line
        out.push(inlineFmt(line) + '<br>');
        i++;
    }

    return out.join('');
}

function renderTable(lines) {
    let html = '<table class="chat-table">';
    let pastSep = false;

    for (const line of lines) {
        // Separator row: |---|:---|---:|
        if (/^\|[\s\-:|]+\|$/.test(line.trim())) {
            pastSep = true;
            continue;
        }
        const cells = line.trim().replace(/^\||\|$/g, '').split('|');
        const tag = pastSep ? 'td' : 'th';
        html += '<tr>' + cells.map(c => `<${tag}>${inlineFmt(c.trim())}</${tag}>`).join('') + '</tr>';
    }

    return html + '</table>';
}

function escapeHtml(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function inlineFmt(text) {
    return escapeHtml(text)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span><span></span><span></span>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// Allow Enter to send, Shift+Enter for newline
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});
