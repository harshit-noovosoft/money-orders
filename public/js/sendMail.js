const mailBtn = document.getElementById('get-mail')

mailBtn.addEventListener('click', async function (e) {
    e.preventDefault()
    let limit = document.getElementById('transaction_limit')
    await fetch(BASE_URL + 'sendMail/?limit=' + limit.value, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => {
        if(res.status === 200) {
            alert('Mail sent successfully')
        }else {
            alert('Some error occurred at backend')
        }
    })
    limit.value = ""
})