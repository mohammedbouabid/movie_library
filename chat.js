// Chat functionality
let chatOpen = false;

function toggleChat() {
    const chatPopup = document.getElementById('aiChatPopup');
    const chatBadge = document.getElementById('chatBadge');
    
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        chatPopup.classList.add('active');
        chatBadge.style.display = 'none';
        
        // Add welcome message if chat is empty
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages.children.length === 0) {
            addChatMessage('ai', 'Bonjour! Je suis votre assistant IA. Comment puis-je vous aider avec vos films aujourd\'hui?');
        }
    } else {
        chatPopup.classList.remove('active');
    }
}

function addChatMessage(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = message;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addChatMessage('user', message);
    chatInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        addChatMessage('ai', response);
    }, 1000);
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Simple response logic based on keywords
    if (message.includes('recommand') || message.includes('suggère')) {
        return 'Je vous recommande de regarder "Inception" si vous aimez la science-fiction, ou "The Hangover" pour une bonne comédie!';
    } else if (message.includes('favori') || message.includes('aime')) {
        return 'Vous pouvez ajouter des films à vos favoris en cliquant sur le bouton "J\'aime" sur chaque carte de film!';
    } else if (message.includes('recherche') || message.includes('cherche')) {
        return 'Utilisez la barre de recherche en haut de la page pour trouver des films par titre, réalisateur ou genre!';
    } else if (message.includes('catégorie') || message.includes('genre')) {
        return 'Vous pouvez filtrer les films par catégorie en utilisant le menu "Catégories" dans la navigation!';
    } else if (message.includes('bonjour') || message.includes('salut')) {
        return 'Bonjour! Comment puis-je vous aider avec votre collection de films?';
    } else if (message.includes('merci')) {
        return 'De rien! N\'hésitez pas si vous avez d\'autres questions!';
    } else {
        return 'Je suis là pour vous aider avec vos films! Vous pouvez me demander des recommandations, comment utiliser les favoris, ou comment rechercher des films.';
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Show notification badge initially
    const chatBadge = document.getElementById('chatBadge');
    if (chatBadge) {
        chatBadge.style.display = 'flex';
    }
});

