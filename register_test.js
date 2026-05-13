// Execute this script natively using Node.js to register your very first tenant!
// Command: node register_test.js

fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: "Rota İstanbul",
        email: "admin@rota.ist",
        password: "1234",  // Your 4-digit PIN mapping
        slug: "rota-istanbul"
    })
})
.then(response => response.json())
.then(data => console.log('Registration Response:', data))
.catch(error => console.error('Registration Error:', error));
