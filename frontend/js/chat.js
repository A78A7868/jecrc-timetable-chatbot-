/**
 * JECRC Timetable ChatBot - Frontend Communication Module
 * Handles user input, webhook communication, and response rendering.
 */

const WEBHOOK_URL = 'http://localhost:5678/webhook/chatbot';

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
            <p>${formatResponse(text)}</p>
        </div>
        <span class="message-time">${now}</span>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatResponse(text) {
    // Convert newlines to <br> and handle basic formatting
    return text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\|(.*?)\|/g, '<code>$1</code>');
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
