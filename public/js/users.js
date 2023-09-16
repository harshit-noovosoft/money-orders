async function loadUsers() {
    const response = await fetch(BASE_URL + "users");
    return await response.json();
}

fetchRole().then(res => {
   if(res.role === 'ADMIN') {
       loadUsers().then((res) => {
           const deposit = document.getElementById('deposit_userId')
           const withdraw = document.getElementById('withdraw_userId')
           const transferTo = document.getElementById('transfer_deposit_userId')
           const transferFrom = document.getElementById('transfer_withdraw_userId')
           addOptions(res.rows, deposit)
           addOptions(res.rows, withdraw)
           addOptions(res.rows, transferTo)
           addOptions(res.rows, transferFrom)
       });
   }
});


function addOptions(res, select) {
    res.forEach((user) => {
        const option = document.createElement("option")
        option.value = user.id;
        option.text = user.name;
        select.add(option)
    })
}