const mailBtn = document.getElementById('get-mail');
let latestEmailId = 0
fetchRole().then(res => {
   const role = res.role;
   if(role === 'CUSTOMER'){
       setInterval(() => {
           loadNewEmails()
       } , 5000);
       loadNewEmails();
   }
});

function toggleMailBtn(status) {
    const mailBtn = document.getElementById('get-mail')
    if(status) {
        mailBtn.setAttribute('disabled', '')
    }else {
        mailBtn.removeAttribute('disabled')
    }
}

async function loadEmails() {
    const response = await fetch(BASE_URL + "mails/?latestId=" + latestEmailId);
    return await response.json();
}

mailBtn.addEventListener('click', async function (e) {
    e.preventDefault()
    let limit = document.getElementById('transaction_limit').value;
    await fetch(BASE_URL + 'mails', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({limit: limit})
    }).then((res) => {
        if(res.status === 200) {
            alert('Mail sent successfully');
            loadNewEmails();
        }else {
            alert('Some error occurred at backend')
        }
    })
    limit.value = "";
});

function createEmailTable(rows) {
    const emails =  rows;
    let pendingEmails = false
    const tblBody = document.getElementById("emails-table-body")
    emails.forEach((email) => {
        if(email.status !== 'PENDING') {
            latestEmailId = Math.max(email.id, latestEmailId)
        }else if(email.status === 'PENDING') {
            pendingEmails = true
        }
        const rowData = [
            email.receiver_email,
            email.transaction_limit,
            email.status
        ]
        toggleMailBtn(pendingEmails)
        tblBody.prepend(createRow(rowData,2, email.id));
    })
}

function loadNewEmails() {
    loadEmails().then(res => {
        if(res.status === 200) createEmailTable(res.rows);
        else alert("Server Error");
    });
}


