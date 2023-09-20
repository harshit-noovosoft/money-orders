const BASE_URL = "http://localhost:3000/"
let latestTransactionId = 0;

async function loadTransactions() {
    const response = await fetch(BASE_URL + "transactions" + "?latestId=" + latestTransactionId);
    return await response.json();
}

async function fetchRole() {
    const roleResponse = await fetch(BASE_URL + "get-role");
    return await roleResponse.json();
}

fetchRole().then(res => {
    manageUI(res.role);
    setInterval(() => {
        loadTransactions().then((res) => {
            //prevTimeStamp = (res.data.slice(-1)[0].timestamp).replace('T',' ');
            addTableRows(res.data);
        })
    } , 2000);
});


function addCell(value, color=null) {
    const cell = document.createElement("td");
    const cellText = document.createTextNode(value);
    if(color) {
        cell.classList.add(value);
    }
    cell.appendChild(cellText);
    return cell;
}

function createRow(rowData,coloredColumnIndex, id = null) {
    const row = document.createElement("tr");
    row.setAttribute('id', id)
    const check = document.getElementById(id)
    console.log(check)
    if(check) {
        check.remove()
    }
    rowData.forEach((cell,index) => {
        let color = null;
        if(index === coloredColumnIndex) {
            color = 1;
        }
        row.appendChild(addCell(cell, color));
    });
    return row;
}

function manageUI(role) {
    if(role !== 'ADMIN') {
        const element = document.getElementById('transactions');
        element.remove();
    }else {
        const mailTable = document.getElementById('email-data');
        mailTable.remove();
        const mailBtn = document.getElementById('mail-btn');
        mailBtn.remove()
    }
}


function addTableRows(res){
    const transactions =  res
    const tbl = document.getElementById('transaction_data');

    const tblBody = document.getElementById("jobs-table-body");
    transactions.forEach((transaction) => {
        if(transaction.status !== 'PENDING') {
            latestTransactionId = Math.max(transaction.id, latestTransactionId)
        }
        console.log(transactions)
        const rowData = [
            transaction.type,
            transaction.from_user || "-",
            transaction.to_user || "-",
            transaction.amount,
            transaction.status
        ]
        tblBody.prepend(createRow(rowData,4, transaction.id));
    })

}
loadTransactions().then((res) => {
    //prevTimeStamp = (res.data.slice(-1)[0].timestamp).replace('T',' ');
    addTableRows(res.data);
})



async function admitTransaction(type, amount, {to_user_id = null, from_user_id = null}) {
    const data = {
        "type": type,
        "amount": amount,
        "to_user_id": to_user_id,
        "from_user_id": from_user_id
    }
    await fetch(BASE_URL + 'transactions', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(ress => {
        loadTransactions().then((res) => {
            //prevTimeStamp = (res.data.slice(-1)[0].timestamp).replace('T',' ');
            addTableRows(res.data);
        })
        return ress.json();
    })
}

function value(id) {
    return document.getElementById(id).value;
}

document.getElementById("deposit_form").addEventListener("submit", function (e) {
    e.preventDefault();
    admitTransaction('deposit', value('deposit_amount'), {to_user_id: value('deposit_userId')})
        .then();
});

document.getElementById("withdraw_form").addEventListener("submit", function (e) {
    e.preventDefault();
    admitTransaction('withdraw', value('withdraw_amount'), {from_user_id: value('withdraw_userId')})
        .then();
});

document.getElementById("transfer_form").addEventListener("submit", function (e) {
    e.preventDefault();
    if(value('transfer_deposit_userId') === value('transfer_withdraw_userId')){
        alert("Transfer not Possible");
        return;
    }
    admitTransaction('transfer', value('transfer_amount'), {
        to_user_id: value('transfer_deposit_userId'),
        from_user_id: value('transfer_withdraw_userId')
    })
        .then();
});

