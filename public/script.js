const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

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

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
        const response = await fetch('/api/auth/log-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Login successful!');
            // Redirect or update UI as needed
            window.location.reload();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login');
    }
});

// Handle signup form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = signupForm.querySelector('input[type="text"]').value;
    const email = signupForm.querySelector('input[type="email"]').value;
    const password = signupForm.querySelector('input[type="password"]').value;

    try {
        const response = await fetch('/api/auth/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Sign up successful! You can now log in.');
            // Switch to login form
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

// Check if user is logged in on page load
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/current-user');
        const data = await response.json();

        if (data.success) {
            // User is logged in
            console.log('Logged in as:', data.user);
            // You can update the UI here to show logged-in state
        }
    } catch (error) {
        console.error('Error checking auth:', error);
    }
}

// Check authentication status on page load
checkAuth();
