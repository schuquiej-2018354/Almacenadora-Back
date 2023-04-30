'use strict'

const Lease = require('./lease.model');
const Services = require('../AdditionalServices/additional.model')
const Cellar = require('../Cellars/cellars.model');
const Client = require('../Clients/client.model');

exports.test = (req, res)=>{
    res.send({message: 'Test fuction is running'});
}

exports.add = async(req, res)=>{
    try{
        let { cellar, client, services } = req.body;
        const lease = await Lease.findOne({$and: [{cellar: cellar}, {client: client}]});
        if(lease) return res.send({message: 'This lease already exists'});
        let total = 0;
        for(let i = 0; i<services.length; i++){
            let service = await Services.findOne({_id: services});
            total =+ parseInt(service.price);
        }
        let newLease = new Lease({cellar: cellar, client: client, services: services, amount: total});
        await newLease.save();
        return res.status(200).send({message: 'Lease created successfully'});  
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error adding'});
    }
}

exports.update = async(req, res)=>{
    try{
        let { id } = req.params;
        let data =  req.body;
        let cellar = await Cellar.findOne({_id: data.cellar});
        if(!cellar) return res.send({message: 'cellar not found'});
        if(cellar.availability == 'no disponible') return res.send({message: 'Cellar not available and not updated'});
        let leaseUpdate = await Lease.findOneAndUpdate({_id: id}, data, {new: true});
        if(!leaseUpdate) return res.send({message: 'Lease not found and not deleted'});
        return res.status(200).send({leaseUpdate});
    }catch(e){
        console.error(e);
        return res.status(500).send({message: 'Error updating'});
    }
}

exports.delete = async(req, res)=>{
    try{
        let { id } = req.params;
        let lease =  await Lease.findOneAndDelete({_id: id});
        if(!lease) return res.send({message: 'Lease not found and not deleted'});
        return res.status(200).send({message: "Lease deleted"});
    }catch(e){
        console.error(e);
        return res.status(500).send({message: 'Error deleting'});
    }
};

exports.get = async(req, res)=>{
    try{
        let leases = await Lease.find();
        return res.status(200).send({leases});
    }catch(e){
        console.error(e);
        return res.status(500).send({message: 'Error getting'});
    }
}

exports.getByCellarAndClient = async(req, res)=>{
    try{
        let { name, clientId } = req.body;
        let cellar = await Cellar.findOne({name: name});
        let client = await Client.findOne({identification: clientId});
        if(!client || !cellar) return res.send({message: 'Not Found'})
        let lease = await Lease.findOne({$and: [{cellar: cellar._id}, {client: client._id}]});
        if(!lease) res.send({message: 'Lease nor found'});
        return res.status(200).send({lease});
    }catch(e){  
        console.error(e);
        return res.status(500).send({message: 'Error getting'});
    } 
}