'use strict'

const User = require('./user.model');
const { encrypt } = require('../utils/validate');

exports.test = (req, res) => {
    return res.send({ message: 'Test function running User' });
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

exports.getById = async (req, res) => {
    try {
        let id = req.user.sub;
        let user = await User.findOne({ _id: id })
        if (!user) return res.send({ message: 'User not found' });
        return res.status(200).send({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting' });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const user = await User.find();
        return res.status(200).send({ user });
    } catch (err) {
        console.log(err);
    }
}