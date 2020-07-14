const express = require('express');
const router = express.Router();
const validate = require('../helpers/tokenauth');

const { isValidObjectId } = require('mongoose');

const { groupByDayArr } = require('../helpers/tools');

const Expenses = require('../models/Expenses');
const ExpenseTypes = require('../models/ExpenseTypes');
const Categories = require('../models/Categories');

router.post('/total/full', validate, async (req, res) => {
    const body = req.body;

    if(!body.filter){
        res.status(400).send('No filter provided');
        return;
    }

    let query = { user: req.auth._id };

    let startDate = null;
    let endDate = null;

    switch(body.filter){
        case 'month':{
            const now = new Date();
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            query.date = {"$gte": startDate, "$lt": endDate};
            break;
        }
        case 'range':{
            if(!body.range){
                res.status(400).send('No filter provided');
                return;
            }
            try{
                startDate = new Date(body.range.start);
                endDate = new Date(body.range.end);
                endDate.setHours(23,59,59,999);
                query.date = {"$gte": startDate, "$lt": endDate};
            }catch(err){
                res.status(400).send('Bad filter provided');
                return;
            }
            break;
        }
        case 'all':{
            break;
        }
        default:{
            res.status(400).send('Invalid filter provided');
            return;
        }
    }

    const exps = await Expenses.find(query);
    if(!exps){
        res.status(500).send('Internal Error...');
        return;
    }
    const types = await ExpenseTypes.find({ user: req.auth._id });
    if(!types){
        res.status(500).send('Internal Error...');
        return;
    }
    const cats = await Categories.find({ user: req.auth._id });
    if(!cats){
        res.status(500).send('Internal Error...');
        return;
    }

    const expArr = [];

    exps.forEach((exp)=>{
        const typeExp = types.find( (type)=> type._id.toString() === exp.type);
        const catExp = cats.find( (cat)=> cat._id.toString() === typeExp.category);
        const typeIndex = types.indexOf(typeExp)
        types[typeIndex].total = types[typeIndex].total ? types[typeIndex].total + exp.cost : exp.cost;
        types[typeIndex].count = types[typeIndex].count ? types[typeIndex].count + 1 : 1;
        const catIndex = cats.indexOf(catExp)
        cats[catIndex].total = cats[catIndex].total ? cats[catIndex].total + exp.cost : exp.cost;
        cats[catIndex].count = cats[catIndex].count ? cats[catIndex].count + 1 : 1;
        expArr.push({
            id: exp._id,
            cost: exp.cost,
            type: {
                id: exp.type,
                name: typeExp.name,
            },
            category: {
                id: exp.type,
                name: catExp.name,
            },
            date: exp.date,
        });
    })

    const typeArr = [];
    types.forEach((type)=>{
        typeArr.push({
            id: type._id,
            name: type.name,
            total: type.total ? type.total : 0,
            count: type.count ? type.count : 0,
        })
    })

    const catArr = [];
    cats.forEach((cat)=>{
        catArr.push({
            id: cat._id,
            name: cat.name,
            total: cat.total ? cat.total : 0,
            count: cat.count ? cat.count : 0,
        })
    })

    const total = exps.reduce((sum, exp)=> sum + exp.cost, 0);
    let sendExpArr = expArr;

    if(body.filter === "month" || body.filter === "range"){
        sendExpArr = groupByDayArr(startDate.toISOString(), endDate.toISOString(), expArr);
        sendExpArr.sort((a, b)=>{
            return Date.parse(a.date) - Date.parse(b.date);
        })
    }

    res.status(200).send({expenses: sendExpArr, total, expenseTypes: typeArr, categories: catArr});

})

router.post('/total/nested', validate, async (req, res) => {
    const body = req.body;

    if(!body.filter){
        res.status(400).send('No filter provided');
        return;
    }

    let query = { user: req.auth._id };

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
        case 'all':{
            break;
        }
        default:{
            res.status(400).send('Invalid filter provided');
            return;
        }
    }

    const exps = await Expenses.find(query);
    if(!exps){
        res.status(500).send('Internal Error...');
        return;
    }
    const types = await ExpenseTypes.find({ user: req.auth._id });
    if(!types){
        res.status(500).send('Internal Error...');
        return;
    }
    const cats = await Categories.find({ user: req.auth._id });
    if(!cats){
        res.status(500).send('Internal Error...');
        return;
    }

    exps.forEach((exp)=>{
        const typeExp = types.find( (type)=> type._id.toString() === exp.type);
        const typeIndex = types.indexOf(typeExp);
        if(!types[typeIndex].expenses){
            types[typeIndex].expenses = [];
        }
        types[typeIndex].expenses.push({
            id: exp._id,
            cost: exp.cost,
            date: exp.date,
        })
        types[typeIndex].total = types[typeIndex].total ? types[typeIndex].total + exp.cost : exp.cost;
    })

    types.forEach((type)=>{
        const catExp = cats.find( (cat)=>  cat._id.toString() === type.category);
        const catIndex = cats.indexOf(catExp);
        if(!cats[catIndex].types){
            cats[catIndex].types = [];
        }
        const typeTotal = type.total ? type.total : 0;
        cats[catIndex].types.push({
            id: type._id,
            name: type.name,
            total: typeTotal,
            expenses: type.expenses ? type.expenses : [],
        });
        cats[catIndex].total = cats[catIndex].total ? cats[catIndex].total + typeTotal : typeTotal;
    })

    const catArr = [];
    cats.forEach((cat)=>{
        catArr.push({
            id: cat._id,
            name: cat.name,
            total: cat.total ? cat.total : 0,
            types: cat.types ? cat.types : [],
        })
    })

    const total = exps.reduce((sum, exp)=> sum + exp.cost, 0);

    res.status(200).send({total, categories: catArr});

})

router.post('/total/', validate, async (req, res) => {
    const body = req.body;

    if(!body.filter){
        res.status(400).send('No filter provided');
        return;
    }

    let query = { user: req.auth._id };

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
        case 'all':{
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

    const total = exps.reduce((sum, exp)=> sum + exp.cost, 0);

    res.status(200).send({ filter: body.filter, total });

})

router.post('/total/category/:id', validate, async (req, res) => {
    const body = req.body;
    const findId = req.params.id;

    if(!isValidObjectId(findId)){
        res.status(400).send('Invalid Category id');
        return;
    }
    
    const cat = await Categories.findOne({ _id: findId, user: req.auth._id});
    if(!cat){
        res.status(404).send('Category not found');
        return;
    }

    if(!body.filter){
        res.status(400).send('No filter provided');
        return;
    }

    let query = { user: req.auth._id, category: findId };

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
        case 'all':{
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

    const total = exps.reduce((sum, exp)=> sum + exp.cost, 0);

    res.status(200).send({ filter: body.filter, total });

})

router.post('/total/expenseType/:id', validate, async (req, res) => {
    const body = req.body;
    const findId = req.params.id;

    if(!isValidObjectId(findId)){
        res.status(400).send('Invalid ExpenseType id');
        return;
    }
    
    const exp = await ExpenseTypes.findOne({ _id: findId, user: req.auth._id});
    if(!exp){
        res.status(404).send('ExpenseType not found');
        return;
    }

    if(!body.filter){
        res.status(400).send('No filter provided');
        return;
    }

    let query = { user: req.auth._id, category: findId };

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
        case 'all':{
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

    const total = exps.reduce((sum, exp)=> sum + exp.cost, 0);

    res.status(200).send({ filter: body.filter, total });

})

module.exports = router;