const express = require('express');
const router = express.Router();
const validate = require('../helpers/tokenauth');

const { validBudget } =require('../helpers/validator')
const Users = require('../models/Users');

router.put('/budget', validate, async (req, res) =>{
    const body = req.body;
    const userId = req.auth._id;

    const user = await Users.findOne({ _id: userId });
    if(user){
        res.status(404).send('User not found');
        return;
    }
    
    const valid = validBudget(body);
    if(valid.error){
        res.status(400).send(valid.error.details[0].message);
        return;
    }

    user.set(body);

    user.save()
        .then((user)=>{
            res.status(200).send({id: user._id, budget: body.budget });
        })
        .catch((err)=>{
            res.status(400).send(err);
        });

});

module.exports = router;