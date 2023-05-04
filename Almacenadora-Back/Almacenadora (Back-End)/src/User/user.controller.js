'use strict'

const User = require('./user.model');
const { checkPassword, encrypt, validateData } = require('../utils/validate');
const { createToken } = require('../services/jwt');

exports.test = (req, res) => {
    return res.send({ message: 'Test function running User' });
}

exports.adminDefault = async (req, res) => {
    try {
        let admin = {
            name: 'Admin',
            surname: 'Admin',
            username: 'admin',
            password: 'admin',
            email: 'admin@gmail.com',
            phone: '12345678',
            role: 'ADMIN',
        }
        admin.password = await encrypt(admin.password);
        let existAdmin = await User.findOne({ username: admin.username });
        if (existAdmin) return
        let adminDefault = new User(admin);
        await adminDefault.save();
        return
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: 'Error creating admin default' });
    }
}

exports.registerClient = async (req, res) => {
    try {
        let data = req.body;
        data.password = await encrypt(data.password);
        data.role = 'CLIENT';
        let existsUser = await User.findOne({ username: data.username })
        if (existsUser) return res.send({ message: 'This user already exists' });
        let user = new User(data);
        await user.save();
        return res.send({ message: 'Account created succesfully' });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: 'Error creating account', error: e.message });
    }
}

exports.login = async (req, res) => {
    try {
        let data = req.body;
        let credentials = {
            username: data.username,
            password: data.password
        }
        let msg = validateData(credentials);
        if (msg) return res.status(400).send({ msg });
        let user = await User.findOne({ username: data.username });
        if (user && await checkPassword(data.password, user.password)) {
            let token = await createToken(user);
            return res.send({ message: 'User logged', token });
        }
        return res.status(404).send({ message: 'Invalid Credentials' });
    } catch (e) {
        console.error(e);
        return res.status(404).send({ message: 'Error not logged' })
    }
}

exports.getById = async(req, res)=>{
    try{
        let { id } = req.params;
        let user = await User.findOne({_id: id})
        if(!user) return res.send({message: 'User not found'});
        return res.status(200).send({user});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting'});
    }
}