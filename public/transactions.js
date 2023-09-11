const BASE_URL = 'http://localhost:3000/';

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
    }).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
    });
}

function value(id) {
    return document.getElementById(id).value;
}

document.getElementById("deposit_form").addEventListener("submit", function (e) {
    e.preventDefault();
    helper('deposit', value('deposit_amount'), {to_user_id: value('deposit_userId')})
        .then();
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