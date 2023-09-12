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
loadTransactions().then((res) => {
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
})