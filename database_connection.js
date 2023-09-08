const { Client } = require('pg');

const client  = new Client({
    user: 'harshit',
    host: 'localhost',
    database: 'money-order',
    password: 'harshit@20002',
    port: 5432
});

client.connect((err) => {
    if(err) console.log(err.message);
});

module.exports = {client};