
document.addEventListener('DOMContentLoaded', () => {
    const chatCircle = document.getElementById('chat-circle');
    const chatBox = document.getElementById('chat-box');
    const closeChat = document.getElementById('close-chat');
    const chatLog = document.getElementById('chat-log');
    const chatInput = document.getElementById('chat-input');
    const GEMINI_API_KEY = 'AIzaSyBvJtONYn5RvXWOHj6rbtdCG8i6QwNX5Fg';
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

    chatCircle.addEventListener('click', () => {
        chatBox.classList.toggle('hidden');
    });

    closeChat.addEventListener('click', () => {
        chatBox.classList.add('hidden');
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim() !== '') {
            const userMessage = chatInput.value.trim();
            appendMessage('user', userMessage);
            chatInput.value = '';
            getGeminiResponse(userMessage);
        }
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
        const p = document.createElement('p');
        p.textContent = message;
        messageElement.appendChild(p);
        chatLog.appendChild(messageElement);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    async function getGeminiResponse(userMessage) {
        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a helpful AI assistant for a personal portfolio website. Your context is the content of this website. Only answer questions related to the website's content, the person's skills, projects, or professional journey. Do not answer out-of-context questions. Here is the user's question: "${userMessage}"`
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error('API response was not ok.');
            }

            const data = await response.json();
            const aiMessage = data.candidates[0].content.parts[0].text;
            appendMessage('ai', aiMessage);
        } catch (error) {
            console.error('Error getting Gemini response:', error);
            appendMessage('ai', 'Sorry, I am having trouble connecting. Please try again later.');
        }
    }
});
