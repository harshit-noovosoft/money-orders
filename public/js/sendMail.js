const mailBtn = document.getElementById('get-mail')

mailBtn.addEventListener('click', async function () {
    await fetch(BASE_URL + 'sendMail/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({'limit' :document.getElementById('transaction_limit').value})
    }).then((res) => {
        if(res.status === 200) {
            alert('Mail sent successfully')
        }else {
            alert('some error occurred at backend')
        }
    })
})