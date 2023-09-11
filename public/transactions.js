const BASE_URL = "http://localhost:3000/"

async function loadTransactions() {
    const response = await fetch(BASE_URL + "transaction");
    return await response.json();
}

loadTransactions().then((res) => {
    const transactions = res
    const tbl = document.getElementById('transaction_data');
    const tblBody = document.createElement("tbody");

    transactions.forEach((transaction) => {
        console.log(transaction)
        const row = document.createElement("tr");

        const cell = document.createElement("td");
        const cellText = document.createTextNode(transaction.transaction_type);
        cell.appendChild(cellText);

        const cell2 = document.createElement("td");
        const cellText2 = document.createTextNode(transaction.from_user);
        cell2.appendChild(cellText2);

        const cell3 = document.createElement("td");
        const cellText3 = document.createTextNode(transaction.to_user);
        cell3.appendChild(cellText3);

        const cell4 = document.createElement("td");
        const cellText4 = document.createTextNode(transaction.amount);
        cell4.appendChild(cellText4);

        row.appendChild(cell);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);

        tblBody.appendChild(row);
    })

    tbl.appendChild(tblBody);
    document.body.appendChild(tbl);

})