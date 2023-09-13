const BASE_URL = "http://localhost:3000/"

async function loadTransactions() {
    const response = await fetch(BASE_URL + "transaction");
    return await response.json();
}

function addCell(value) {
    const cell = document.createElement("td");
    const cellText = document.createTextNode(value);
    cell.appendChild(cellText);
    return cell
}


function addTableRows(res,role){
    const transactions =  res
    const tbl = document.getElementById('transaction_data');
    const previousRows = tbl.querySelector("tbody")
    if(previousRows) {
        previousRows.remove()
    }
    const tblBody = document.createElement("tbody");

    transactions.slice(-10).reverse().forEach((transaction) => {
        const row = document.createElement("tr");

        row.appendChild(addCell(transaction.transaction_type.toUpperCase()));
        row.appendChild(addCell(transaction.from_user || "-"));
        row.appendChild(addCell(transaction.to_user || "-"));
        row.appendChild(addCell(transaction.amount));

        tblBody.appendChild(row);
    })
    tbl.appendChild(tblBody);

    if(role !== 'admin') {
        const element = document.getElementById('transactions');
        element.remove();
    }
}
loadTransactions().then((res) => {
    addTableRows(res.data , res.role);
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
            addTableRows(res.data,res.role);
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
        .then((res) => {

        });
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