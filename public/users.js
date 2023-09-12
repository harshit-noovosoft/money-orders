async function loadUsers() {
    const response = await fetch(BASE_URL + "users");
    return await response.json();
}

function addOptions(res, select) {
    res.forEach((user) => {
        const option = document.createElement("option")
        option.value = user.user_id;
        option.text = user.username;
        select.add(option)
    })
}
loadUsers().then((res) => {
    const deposit = document.getElementById('deposit_userId');
    const withdraw = document.getElementById('withdraw_userId');
    const transferTo = document.getElementById('transfer_deposit_userId');
    const transferFrom = document.getElementById('transfer_withdraw_userId');
    addOptions(res, deposit)
    addOptions(res, withdraw)
    addOptions(res, transferTo)
    addOptions(res, transferFrom)
})