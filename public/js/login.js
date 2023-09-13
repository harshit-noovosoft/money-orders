const BASE_URL = "http://localhost:3000/"
const loginForm = document.getElementById('login-form')
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    const data = {
        'username': document.getElementById('username').value,
        'password': document.getElementById('password').value
    }
    await fetch(BASE_URL + 'login/', {
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