const express = require('express');
const router = express.Router();
const {client} = require("../database_connection");
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/',async (req,res)=>{
    const { username , amount} = req.body;

    //Get user_id from user_name
    const userId = await client.query('select user_id from users where user_name = $1',[username]);

    //Generate transaction id
    const result = await client.query('select max(transaction_id) from transactions');
    const transactionId = ((parseInt(result.rows[0].max))?parseInt(result.rows[0].max):0) + 1;

    // insert data into table
    const entryToDB = await client.query('Insert into transactions (transaction_id, transaction_type, amount, from_user_id, to_user_id) values ($1,$2,$3,$4,$5)',
        [transactionId,'Deposit',amount,null,userId.rows[0]['user_id']]);

    res.send("Success");
});

module.exports = router;