const express = require('express');
const router = express.Router();
const validate = require('../helpers/tokenauth');

const { validExp } = require('../helpers/validator');
const { isValidObjectId } = require('mongoose');

const Expenses = require('../models/Expenses');
const ExpenseTypes = require('../models/ExpenseTypes');
const Categories = require('../models/Categories');

router.get('/', validate, async (req, res) => {

    const exps = await Expenses.find({ user: req.auth._id });
    if(!exps){
        res.status(500).send('Internal Error...');
        return;
    }

    const expArr = [];

    exps.forEach((exp)=>{
        expArr.push({ id: exp._id, cost: exp.cost, type: exp.type, date: exp.date});
    })

    res.status(200).send({expenses: expArr});

})

router.post('/date/', validate, async (req, res) => {
    const body = req.body;

    if(!body.filter){
        res.status(400).send('No filter provided');
        return;
    }

    let query = { user: req.auth._id };

    if(body.type){
        query.type = body.type;
    }

    switch(body.filter){
        case 'month':{
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            query.date = {"$gte": startDate, "$lt": endDate};
            break;
        }
        case 'range':{
            if(!body.range){
                res.status(400).send('No filter provided');
                return;
            }
            try{
                const startDate = new Date(body.range.start);
                const endDate = new Date(body.range.end);
                endDate.setHours(23,59,59,999);
                query.date = {"$gte": startDate, "$lt": endDate};
            }catch(err){
                res.status(400).send('Bad filter provided');
                return;
            }
            break;
        }
        default:{
            res.status(400).send('Invalid filter provided');
            return;
        }
    }

    let exps = await Expenses.find(query);
    if(!exps){
        res.status(500).send('Internal Error...');
        return;
    }

    const expArr = [];

    exps.forEach((exp)=>{
        expArr.push({ id: exp._id, cost: exp.cost, type: exp.type, date: exp.date});
    })

    res.status(200).send({expenses: expArr});
    

})

router.get('/p/:id', validate, async (req, res) => {
    const findId = req.params.id;

    if(!isValidObjectId(findId)){
        res.status(400).send('Invalid id');
        return;
    }

    const exp = await Expenses.findOne({ _id: findId, user: req.auth._id});
    if(!exp){
        res.status(404).send('Expense not found');
        return;
    }

    res.status(200).send({expense: { id: exp._id, cost: exp.cost, type: exp.type, date: exp.date}});

})

router.delete('/p/:id', validate, async (req, res) => {
    const findId = req.params.id;

    if(!isValidObjectId(findId)){
        res.status(400).send('Invalid id');
        return;
    }

    const exp = await Expenses.deleteOne({ _id: findId, user: req.auth._id});
    if(!exp){
        res.status(500).send('Internal Error...');
        return;
    }
    if(exp.n === 0){
        res.status(404).send('Expense not found');
        return;
    }

    res.status(200).send({ deleted: findId });

})

router.post('/', validate, async (req, res) => {
    const body = req.body;

    const valid = validExp(body);
    if(valid.error){
        res.status(400).send(valid.error.details[0].message);
        return;
    }

    if(!isValidObjectId(body.type)){
        res.status(400).send('Invalid ExpenseType id');
        return;
    }

    const type = await ExpenseTypes.findOne({ _id: body.type, user: req.auth._id});
    if(!type){
        res.status(404).send('ExpenseType not found');
        return;
    }

    const newExp = new Expenses({
        cost: body.cost,
        type: body.type,
        user: req.auth._id
    });

    newExp.save()
        .then((exp)=>{
            res.status(200).send({expense: { id: exp._id, cost: exp.cost, type: exp.type, date: new Date()}});
        })
        .catch((err)=>{
            res.status(400).send(err);
        });

})

router.put('/p/:id', validate, async (req, res) => {
    const body = req.body;
    const findId = req.params.id;

    const valid = validExp(body);
    if(valid.error){
        res.status(400).send(valid.error.details[0].message);
        return;
    }

    if(!isValidObjectId(findId)){
        res.status(400).send('Invalid id');
        return;
    }

    if(!isValidObjectId(body.type)){
        res.status(400).send('Invalid ExpenseType id');
        return;
    }

    let updateExp = await Expenses.findOne({_id: findId});

    if(!updateExp){
        res.status(404).send('Expense not found');
        return;
    }
    
    updateExp.set(body);
    
    updateExp.save().then((exp)=>{
        res.status(200).send({expense: { id: exp._id, cost: exp.cost, type: exp.type, date: exp.date}});
    }).catch((err)=>{
        res.status(400).send(err);
    });


})

module.exports = router;