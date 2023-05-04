'use strict'

const { encrypt } = require('../utils/validate');
const Accounts = require('./accounts.model');

exports.test = (req, res)=>{
    res.send({message: 'test fuction is running'});
}

exports.addAccounts = async(req, res)=>{
    try{
        let data = req.body;
        data.password = await encrypt(data.password);
        data.role = 'client';
        let account = new Accounts(data);
        await account.save();
        return res.send({message: 'Account created sucessfully'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating account', error: err.message});
    }
}

exports.updateAccount = async(req, res)=>{
    try{
        let accountId = req.params.id;
        let data = req.body;
        let updateAccount = await Accounts.findOneAndUpdate({_id: accountId}, data, {new: true});
        if(!updateAccount) return res.send({message: 'Account not found'});
        return res.status(201).send({message: 'Account updated successfully'});
    }catch(err){
        console.error();
        return res.status(500).send({message: 'Erro updating account'});
    }
};

exports.deleteAccount = async(req, res)=>{
    try{
        let accountId = req.params.id;
        let deleteAccount = await Accounts.findOneAndRemove({_id: accountId});
        if(!deleteAccount) return res.send({message: 'Account not found and not deleted'});
        return res.status(200).send({message: `Account with name ${deleteAccount.name} deleted successfully`});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting account'});
    }
}

exports.getAccounts = async(req, res)=>{
    try{
        let accounts = await Accounts.find();
        return res.status(200).send({accounts});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting accounts'});
    }
}

exports.getById = async(req, res)=>{
    try{
        let { id } = req.params;
        let account = await Accounts.findOne({_id: id});
        if(!account) return res.send({message: 'Accout not found'});
        return res.status(200).send({account});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting'});
    }
};