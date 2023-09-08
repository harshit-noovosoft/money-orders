const express = require('express');
const bcrypt = require('bcrypt');
const {client} = require("../database_connection");
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join(__dirname , '../templates')));

router.get('/' , (req,res)=>{
    res.sendFile(path.join(__dirname , '../templates/register.html'));
});

router.post('/' , async (req,res) => {

    // Fetch data which comes from form
    const { username , password , email} = req.body;

    const existingData = await client.query('select * from users where user_name = $1 or user_email = $2',
        [username,email]);
    if(existingData.rowCount > 0) {
        res.status(400).send("User already exist");
    }

    // Encryption of raw password
    const hash_password = await bcrypt.hash(password, 10);

    // Create new user_id from existing table
    const result = await client.query("Select max(user_id) from users");
    const user_id = ((parseInt(result.rows[0].max))?parseInt(result.rows[0].max):0) + 1;

    // Enter the data into database
    const text = `Insert into users (user_id, user_name, user_email, password_hash) 
        values ($1,$2,$3,$4) 
            returning *`;
    const values = [user_id,username,email,hash_password];
    const entryInDB = await client.query(text,values);
    res.redirect('/login');
});

module.exports = router;