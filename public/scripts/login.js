
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    localStorage.setItem('username', email);
    

    fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
          
        }),
    })
        .then(response => response.json())
        .then(data => {
            
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = '../views/index.html'
            } else {
                console.error('Token not found in response');
            }
        })
        .catch(error => console.error('Error:', error));
}



document.getElementById('logout').addEventListener('click', function () {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('No users are logged in!');
        return;
    }

    fetch('/users/logout', { // Making sure the path is absolute
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) {
            localStorage.removeItem('token'); // Remove the token from localStorage
            console.log('User logged out successfully');
            window.location.href = '../views/login.html';
        } else {
            throw new Error('Logout failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username')

    if(username)
   {
    document.getElementById('username').textContent = username;
   }
})


