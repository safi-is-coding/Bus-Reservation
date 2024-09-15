document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const profileInfo = document.getElementById('profile-info');
    const logoutBtn = document.getElementById('logout-btn');

    // Register user
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await response.json();
                alert(data.message);
                if (response.ok) window.location.href = 'login.html';
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Login user
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                alert(data.message);

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    if (data.isAdmin) {
                        // Redirect to admin dashboard if the user is an admin
                        window.location.href = 'AdminDashboard.html';
                    } else {
                        // Redirect to the main page if the user is not an admin
                        window.location.href = 'index.html';
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Load user profile
    if (profileInfo) {
        const token = localStorage.getItem('token');
        if (!token) return window.location.href = 'login.html';

        fetch('http://localhost:3000/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                window.location.href = 'login.html';
            } else {
                profileInfo.innerHTML = `
                    <p>Name: ${data.name}</p>
                    <p>Email: ${data.email}</p>
                `;
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Logout user
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }
});
