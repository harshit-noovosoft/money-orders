const mailBtn = document.getElementById('get-mail')

async function loadEmails() {
    const response = await fetch(BASE_URL + "sendMail");
    return await response.json();
}

mailBtn.addEventListener('click', async function (e) {
    e.preventDefault()
    let limit = document.getElementById('transaction_limit').value;
    await fetch(BASE_URL + 'sendMail', {
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
    console.log(previousRows);
    if(previousRows) {
        previousRows.remove()
    }
    const tblBody = document.createElement("tbody");
    emails.reverse().forEach((email) => {
        const rowData = [
            email.sender_email,
            email.receiver_email,
            email.transaction_limit,
            email.email_status
        ]
        tblBody.appendChild(createRow(rowData));
    })
    tbl.appendChild(tblBody);
}

function loadNewEmails() {
    loadEmails().then(res => {
        if(res.role !== 'customer') return;
        createEmailTable(res.rows);
    })
}

loadNewEmails();

