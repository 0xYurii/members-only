// Global state
let currentUser = null;

// DOM Elements
const authSection = document.getElementById('auth-section');
const mainContent = document.getElementById('main-content');
const header = document.getElementById('header');
const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const joinClubSection = document.getElementById('join-club-section');
const joinClubForm = document.getElementById('join-club-form');
const createMessageSection = document.getElementById('create-message-section');
const toggleMessageForm = document.getElementById('toggle-message-form');
const messageFormContainer = document.getElementById('message-form-container');
const createMessageForm = document.getElementById('create-message-form');
const cancelMessage = document.getElementById('cancel-message');
const messagesContainer = document.getElementById('messages-container');

// Switch to signup form
showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
});

// Switch to login form
showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

// Handle login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = loginForm.querySelector('input[name="email"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;

    try {
        const response = await fetch('/api/auth/log-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            currentUser = data.user;
            showMainContent();
            loginForm.reset();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login');
    }
});

// Handle signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        firstName: signupForm.querySelector('input[name="firstName"]').value,
        lastName: signupForm.querySelector('input[name="lastName"]').value,
        email: signupForm.querySelector('input[name="email"]').value,
        username: signupForm.querySelector('input[name="username"]').value,
        password: signupForm.querySelector('input[name="password"]').value,
        confirmPassword: signupForm.querySelector('input[name="confirmPassword"]').value,
        isAdmin: signupForm.querySelector('input[name="isAdmin"]').checked
    };

    try {
        const response = await fetch('/api/auth/sign-up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            signupContainer.style.display = 'none';
            loginContainer.style.display = 'block';
            signupForm.reset();
        } else {
            alert(data.message || 'Sign up failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during sign up');
    }
});

// Handle logout
logoutBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/auth/log-out');
        const data = await response.json();

        if (data.success) {
            currentUser = null;
            showAuthForms();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during logout');
    }
});

// Handle join club
joinClubForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const passcode = joinClubForm.querySelector('input[name="passcode"]').value;

    try {
        const response = await fetch('/api/auth/join-club', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passcode }),
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            currentUser.isMember = true;
            updateUI();
            loadMessages();
            joinClubForm.reset();
        } else {
            alert(data.message || 'Incorrect passcode');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
});

// Toggle message form
toggleMessageForm.addEventListener('click', () => {
    messageFormContainer.style.display = 
        messageFormContainer.style.display === 'none' ? 'block' : 'none';
});

cancelMessage.addEventListener('click', () => {
    messageFormContainer.style.display = 'none';
    createMessageForm.reset();
});

// Handle create message
createMessageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = createMessageForm.querySelector('input[name="title"]').value;
    const text = createMessageForm.querySelector('textarea[name="text"]').value;

    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, text }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Message created successfully!');
            createMessageForm.reset();
            messageFormContainer.style.display = 'none';
            loadMessages();
        } else {
            alert(data.message || 'Failed to create message');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
});

// Delete message
async function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) {
        return;
    }

    try {
        const response = await fetch(`/api/messages/${messageId}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
            alert('Message deleted successfully!');
            loadMessages();
        } else {
            alert(data.message || 'Failed to delete message');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}

// Load and display messages
async function loadMessages() {
    try {
        const response = await fetch('/api/messages');
        const data = await response.json();

        if (data.success) {
            displayMessages(data.messages);
        }
    } catch (error) {
        console.error('Error:', error);
        messagesContainer.innerHTML = '<p class="error">Error loading messages</p>';
    }
}

// Display messages
function displayMessages(messages) {
    if (messages.length === 0) {
        messagesContainer.innerHTML = '<p class="no-messages">No messages yet. Be the first to post!</p>';
        return;
    }

    messagesContainer.innerHTML = messages.map(msg => {
        const date = new Date(msg.timestamp).toLocaleString();
        const deleteBtn = currentUser && currentUser.isAdmin ? 
            `<button class="delete-btn" onclick="deleteMessage(${msg.id})">Delete</button>` : '';
        
        return `
            <div class="message-card">
                <h3>${msg.title}</h3>
                <p>${msg.text}</p>
                <div class="message-meta">
                    <span class="author">By: ${msg.author}</span>
                    <span class="date">${date}</span>
                </div>
                ${deleteBtn}
            </div>
        `;
    }).join('');
}

// Show authentication forms
function showAuthForms() {
    authSection.style.display = 'block';
    mainContent.style.display = 'none';
    header.style.display = 'none';
    loginContainer.style.display = 'block';
    signupContainer.style.display = 'none';
}

// Show main content
function showMainContent() {
    authSection.style.display = 'none';
    mainContent.style.display = 'block';
    header.style.display = 'block';
    updateUI();
    loadMessages();
}

// Update UI based on user state
function updateUI() {
    if (!currentUser) return;

    // Update user info
    const memberStatus = currentUser.isMember ? '👑 Member' : '🔒 Non-member';
    const adminBadge = currentUser.isAdmin ? ' 👮 Admin' : '';
    userInfo.textContent = `${currentUser.firstName} ${currentUser.lastName} (${memberStatus}${adminBadge})`;

    // Show/hide join club section
    joinClubSection.style.display = currentUser.isMember ? 'none' : 'block';

    // Show create message button for logged-in users
    createMessageSection.style.display = 'block';
}

// Check authentication on page load
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/current-user');
        const data = await response.json();

        if (data.success) {
            currentUser = data.user;
            showMainContent();
        } else {
            showAuthForms();
        }
    } catch (error) {
        console.error('Error checking auth:', error);
        showAuthForms();
    }
}

// Make deleteMessage available globally
window.deleteMessage = deleteMessage;

// Initialize
checkAuth();
