const express = require('express');
require('dotenv').config();

const app = express();

app.listen(process.env.PORT , (req,res)=>{
    console.log(`Server running on PORT ${process.env.PORT}`);
});