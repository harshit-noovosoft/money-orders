const router = require('express').Router();
const bodyParser = require('body-parser');
const path = require('path');
const express = require("express");
const bcrypt = require('bcrypt');
const {client} = require("../database_connection");
const jwt = require('jsonwebtoken');

router.use(bodyParser.urlencoded({extended: false}));
router.use(express.static(path.join(__dirname , '../templates')));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/login.html'));
});

router.use(async (req,res,next)=>{
    const { email , password } = req.body;
    const hashPassword = await client.query('select password_hash from users where user_email = $1',[email]);
    if(bcrypt.compare(password,hashPassword.rows[0]['password_hash']).result){
        next();
    }
    else res.send("Incorrect password");
});

router.post('/', async (req, res) => {
    const { email , password } = req.body;

});

module.exports = router;


