const express = require('express');
const router = express.Router();

const crypt = require('bcryptjs');
const webtoken = require('jsonwebtoken');

const { validReg, validLog } = require('../helpers/validator');
const Users = require('../models/Users');

router.post('/register', async (req, res) =>{
    const body = req.body;

    const valid = validReg(body);
    if(valid.error){
        res.status(400).send(valid.error.details[0].message);
        return;
    }

    const prevUser = await Users.findOne({ email: body.email });
    if(prevUser){
        res.status(400).send('Email provided already has an account registered');
        return;
    }

    const randSalt = crypt.genSaltSync(5);
    const hash = crypt.hashSync(body.password, randSalt);

    const newUser = new Users({
        name: body.name,
        email: body.email,
        password: hash,
    });

    newUser.save()
        .then((user)=>{
            const token =  webtoken.sign({ _id: user._id}, process.env.AUTH_KEY);
            res.status(200).send({id: user._id, name: body.name, jwt: token });
        })
        .catch((err)=>{
            res.status(400).send(err);
        });

});

router.post('/login', async (req, res) =>{
    const body = req.body;

    const valid = validLog(body);
    if(valid.error){
        res.status(400).send(valid.error.details[0].message);
        return;
    }

    const user = await Users.findOne({ email: body.email });
    if(!user){
        res.status(400).send('The email provided has no registered account');
        return;
    }

    const pass = await crypt.compareSync(body.password, user.password);
    if(!pass){
        res.status(400).send('Email and password does not match')
        return;
    }
    
    const token =  webtoken.sign({ _id: user._id}, process.env.AUTH_KEY);
    res.status(200).header('auth', token).send({ name: user.name, jwt: token});
});

module.exports = router;