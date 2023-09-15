const BASE_URL = "http://localhost:3000/"

async function loadTransactions() {
    const response = await fetch(BASE_URL + "transaction");
    return await response.json();
}

function addCell(value, color=null) {
    const cell = document.createElement("td");
    const cellText = document.createTextNode(value);
    if(color) {
        cell.classList.add(value);
    }
    cell.appendChild(cellText);
    return cell;
}

function createRow(rowData,coloredColumnIndex) {
    const row = document.createElement("tr");
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
    if(role !== 'admin') {
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
    const previousRows = tbl.querySelector("tbody")
    if(previousRows) {
        previousRows.remove()
    }
    const tblBody = document.createElement("tbody");
    transactions.reverse().forEach((transaction) => {
        const rowData = [
            transaction.transaction_type.toUpperCase(),
            transaction.from_user || "-",
            transaction.to_user || "-",
            transaction.amount,
            transaction.transaction_status
        ]
        tblBody.appendChild(createRow(rowData,4));
    })
    tbl.appendChild(tblBody);


}
loadTransactions().then((res) => {
    addTableRows(res.data);
    manageUI(res.role);
})

async function admitTransaction(type, amount, {to_user_id = null, from_user_id = null}) {
    const data = {
        "type": type,
        "amount": amount,
        "to_user_id": to_user_id,
        "from_user_id": from_user_id
    }
    await fetch(BASE_URL + 'transaction', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(ress => {
        loadTransactions().then((res) => {
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

setInterval(() => {
    loadTransactions().then((res) => {
        addTableRows(res.data , res.role);
    })
} , 5000);

