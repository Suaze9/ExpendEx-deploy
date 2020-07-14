const express = require('express');
const router = express.Router();
const validate = require('../helpers/tokenauth');

const { validCat } = require('../helpers/validator');
const { isValidObjectId } = require('mongoose');

const Categories = require('../models/Categories');

router.get('/', validate, async (req, res) => {

    const cats = await Categories.find({ user: req.auth._id });
    if(!cats){
        res.status(500).send('Internal Error...');
        return;
    }

    const catArr = [];

    cats.forEach((cat)=>{
        catArr.push({ id: cat._id, name: cat.name, size: cat.size});
    })

    res.status(200).send({categories: catArr});

})

router.get('/p/:id', validate, async (req, res) => {
    const findId = req.params.id;

    if(!isValidObjectId(findId)){
        res.status(400).send('Invalid id');
        return;
    }

    const cat = await Categories.findOne({ _id: findId, user: req.auth._id});
    if(!cat){
        res.status(404).send('Category not found');
        return;
    }

    res.status(200).send({category: { id: cat._id, name: cat.name, size: cat.size}});

})

router.delete('/p/:id', validate, async (req, res) => {
    const findId = req.params.id;

    if(!isValidObjectId(findId)){
        res.status(400).send('Invalid id');
        return;
    }

    const cat = await Categories.deleteOne({ _id: findId, user: req.auth._id});
    if(!cat){
        res.status(500).send('Internal Error...');
        return;
    }

    if(cat.n === 0){
        res.status(404).send('Category not found');
        return;
    }

    res.status(200).send({deleted: findId});

})

router.post('/', validate, (req, res) => {
    const body = req.body;

    const valid = validCat(body);
    if(valid.error){
        res.status(400).send(valid.error.details[0].message);
        return;
    }

    const newCat = new Categories({
        name: body.name,
        user: req.auth._id
    });

    newCat.save()
        .then((cat)=>{
            res.status(200).send({category: { id: cat._id, name: cat.name, size: cat.size}});
        })
        .catch((err)=>{
            res.status(400).send(err);
        });

})

router.put('/p/:id', validate, async (req, res) => {
    const body = req.body;
    const findId = req.params.id;

    const valid = validCat(body);
    if(valid.error){
        res.status(400).send(valid.error.details[0].message);
        return;
    }

    if(!isValidObjectId(findId)){
        res.status(400).send('Invalid id');
        return;
    }

    let updateCat = await Categories.findOne({_id: findId});

    if(!updateCat){
        res.status(404).send('Category not found');
        return;
    }
    
    updateCat.set(body);
    
    updateCat.save().then((cat)=>{
        res.status(200).send({category: { id: cat._id, name: cat.name, size: cat.size}});
    }).catch((err)=>{
        res.status(400).send(err);
    });


})

module.exports = router;