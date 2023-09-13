const BASE_URL = "http://localhost:3000/"
const registerForm = document.getElementById('register-form')

registerForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    const data = {
        'username': document.getElementById('username').value,
        'password': document.getElementById('password').value,
        'email': document.getElementById('email').value,
    }
    await fetch(BASE_URL + 'register', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data)
    }).then((res) => {
        if(res.status === 200) {
            window.location.href = BASE_URL + 'dashboard'
        }else {
            alert('wrong user id or password')
        }
    })
})