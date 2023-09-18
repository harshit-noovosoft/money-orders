const mailBtn = document.getElementById('get-mail');

fetchRole().then(res => {
   const role = res.role;
   if(role === 'CUSTOMER'){
       setInterval(() => {
           loadNewEmails()
       } , 5000);
       loadNewEmails();
   }
});

async function loadEmails() {
    const response = await fetch(BASE_URL + "mails");
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
    const tbl = document.getElementById('email-table');
    const previousRows = tbl.querySelector("tbody")
    if(previousRows) {
        previousRows.remove()
    }
    const tblBody = document.createElement("tbody");
    emails.reverse().forEach((email) => {
        const rowData = [
            email.receiver_email,
            email.transaction_limit,
            email.status
        ]
        tblBody.appendChild(createRow(rowData,2));
    })
    tbl.appendChild(tblBody);
}

function loadNewEmails() {
    loadEmails().then(res => {
        createEmailTable(res.rows);
    })
}


