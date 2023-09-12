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

function addTableRows(res){
    const transactions =  res
    const tbl = document.getElementById('transaction_data');
    const tblBody = document.createElement("tbody");

    transactions.slice(-10).reverse().forEach((transaction) => {
        const row = document.createElement("tr");

        row.appendChild(addCell(transaction.transaction_type))
        row.appendChild(addCell(transaction.from_user))
        row.appendChild(addCell(transaction.to_user))
        row.appendChild(addCell(transaction.amount))

        tblBody.appendChild(row);
    })

    tbl.appendChild(tblBody);
    document.body.appendChild(tbl);
}
loadTransactions().then((res) => {
    addTableRows(res)
})

async function helper(type, amount, {to_user_id = null, from_user_id = null}) {
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
            addTableRows(res)
        })
        return ress.json();
    })
}

function value(id) {
    return document.getElementById(id).value;
}

document.getElementById("deposit_form").addEventListener("submit", function (e) {
    e.preventDefault();
    helper('deposit', value('deposit_amount'), {to_user_id: value('deposit_userId')})
        .then((res) => {

        });
});

document.getElementById("withdraw_form").addEventListener("submit", function (e) {
    e.preventDefault();
    helper('withdraw', value('withdraw_amount'), {from_user_id: value('withdraw_userId')})
        .then();
});

document.getElementById("transfer_form").addEventListener("submit", function (e) {
    e.preventDefault();
    helper('transfer', value('transfer_amount'), {
        to_user_id: value('transfer_deposit_userId'),
        from_user_id: value('transfer_withdraw_userId')
    })
        .then();
});