const express = require('express');
const router = express.Router();
const validate = require('../helpers/tokenauth');

const { validType } = require('../helpers/validator');
const { isValidObjectId } = require('mongoose');

const ExpenseTypes = require('../models/ExpenseTypes');
const Categories = require('../models/Categories');

router.get('/', validate, async (req, res) => {

    const types = await ExpenseTypes.find({ user: req.auth._id });
    if(!types){
        res.status(500).send('Internal Error...');
        return;
    }

    const typeArr = [];

    types.forEach((type)=>{
        typeArr.push({ id: type._id, name: type.name, category: type.category});
    })

    res.status(200).send({expenseType: typeArr});

})

router.get('/p/:id', validate, async (req, res) => {
    const findId = req.params.id;

    if(!isValidObjectId(findId)){
        res.status(400).send('Invalid id');
        return;
    }

    const type = await ExpenseTypes.findOne({ _id: findId, user: req.auth._id});
    if(!type){
        res.status(404).send('ExpenseType not found');
        return;
    }

    res.status(200).send({expenseType: { id: type._id, name: type.name, category: type.category}});

})

router.delete('/p/:id', validate, async (req, res) => {
    const findId = req.params.id;

    if(!isValidObjectId(findId)){
        res.status(400).send('Invalid id');
        return;
    }

    const type = await ExpenseTypes.deleteOne({ _id: findId, user: req.auth._id});
    if(!type){
        res.status(500).send('Internal Error...');
        return;
    }

    if(type.n === 0){
        res.status(404).send('ExpenseType not found');
        return;
    }

    res.status(200).send({deleted: findId});

})

router.post('/', validate, async (req, res) => {
    const body = req.body;

    const valid = validType(body);
    if(valid.error){
        res.status(400).send(valid.error.details[0].message);
        return;
    }

    if(!isValidObjectId(body.category)){
        res.status(400).send('Invalid Category id');
        return;
    }

    const cat = await Categories.findOne({ _id: body.category, user: req.auth._id});
    if(!cat){
        res.status(404).send('Category not found');
        return;
    }

    const newType = new ExpenseTypes({
        name: body.name,
        category: body.category,
        user: req.auth._id
    });

    newType.save()
        .then((type)=>{
            res.status(200).send({expenseType: { id: type._id, name: type.name, category: type.category}});
        })
        .catch((err)=>{
            res.status(400).send(err);
        });

})

router.put('/p/:id', validate, async (req, res) => {
    const body = req.body;
    const findId = req.params.id;

    const valid = validType(body);
    if(valid.error){
        res.status(400).send(valid.error.details[0].message);
        return;
    }

    if(!isValidObjectId(findId)){
        res.status(400).send('Invalid id');
        return;
    }

    if(!isValidObjectId(body.category)){
        res.status(400).send('Invalid Category id');
        return;
    }

    let updateType = await ExpenseTypes.findOne({_id: findId});

    if(!updateType){
        res.status(404).send('ExpenseType not found');
        return;
    }
    const oldCat = updateType.category;
    let catChange = updateType.category !== body.category;
    
    updateType.set(body);
    
    updateType.save().then((type)=>{
        res.status(200).send({expenseType: { id: type._id, name: type.name, category: type.category}});
        if(catChange){
            Categories.updateOne({_id: oldCat}, { $inc: { size: -1 } });
        }
    }).catch((err)=>{
        res.status(400).send(err);
    });


})

module.exports = router;