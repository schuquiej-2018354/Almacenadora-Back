'use strict'

const Additional = require('./additional.model');

exports.test = (req, res)=>{
    res.send({message: 'test fuction is running'});
}

exports.addAdditional = async(req, res)=>{
    try{
        let data = req.body;
        let additionalExist = await Additional.findOne({name: data.name});
        if(additionalExist) return res.send({message: 'Additional service already exists'});
        let additional = new Additional(data);
        await additional.save();
        return res.status(201).send({message: 'Additional service added successfully'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error adding additional service'});
    }
}

exports.updateAdditional = async(req, res)=>{
    try{
        let additionalId = req.params.id;
        let data = req.body;
        let updateAdditional = await Additional.findOneAndUpdate({_id: additionalId}, data, {new: true});
        if(!updateAdditional) return res.send({message: 'Additional service not found'});
        return res.status(201).send({message: 'Additional service updated successfully'});
    }catch(err){
        console.error();
        return res.status(500).send({message: 'Error updating additional service'});
    }
};

exports.getAdditional = async(req, res)=>{
    try{
        let additional = await Additional.find();
        return res.status(200).send({additional});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting additional services'});
    }
}

exports.getById = async(req, res)=>{
    try{
        let { id } = req.params;
        let service = await Additional.findOne({_id: id});
        if(!service) return res.send({message: 'Service not found'});
        return res.status(200).send({service});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting'});
    }
}