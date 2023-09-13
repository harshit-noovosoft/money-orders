import express from "express";
import jwt from "jsonwebtoken";

const checkAuth = (req,res,next) => {
    const token = req.cookies['access_token'];
    if(!token) {
        return res.redirect('/login');
    }
    next();
}

export default checkAuth;