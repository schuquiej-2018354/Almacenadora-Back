'use strict'

const { encrypt } = require('../utils/validate');
const { checkPassword, validateData } = require('../utils/validate');
const { createToken } = require('../services/jwt');
const Accounts = require('./accounts.model');

exports.test = (req, res) => {
    res.send({ message: 'test fuction is running' });
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
        let user = await Accounts.findOne({ username: data.username });
        if (user && await checkPassword(data.password, user.password)) {
            let token = await createToken(user);
            let userLogged = {
                name: user.name,
                username: user.username,
                role: user.role
            }
            return res.send({ message: 'User logged successfully', token, userLogged });
        }
        return res.status(404).send({ message: 'Invalid Credentials' });
    } catch (e) {
        console.error(e);
        return res.status(404).send({ message: 'Error not logged' })
    }
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
        let existAdmin = await Accounts.findOne({ username: admin.username });
        if (existAdmin) return
        let adminDefault = new Accounts(admin);
        await adminDefault.save();
        return
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: 'Error creating admin default' });
    }
}

exports.addAccounts = async (req, res) => {
    try {
        let data = req.body;
        data.password = await encrypt(data.password);
        data.role = 'worker';
        let account = new Accounts(data);
        await account.save();
        return res.send({ message: 'Account created sucessfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating account', error: err.message });
    }
}

exports.updateAccount = async (req, res) => {
    try {
        let accountId = req.params.id;
        let data = req.body;
        let updateAccount = await Accounts.findOneAndUpdate({ _id: accountId }, data, { new: true });
        if (!updateAccount) return res.send({ message: 'Account not found' });
        return res.status(201).send({ message: 'Account updated successfully' });
    } catch (err) {
        console.error();
        return res.status(500).send({ message: 'Erro updating account' });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        let accountId = req.params.id;
        let deleteAccount = await Accounts.findOneAndRemove({ _id: accountId });
        if (!deleteAccount) return res.send({ message: 'Account not found and not deleted' });
        return res.status(200).send({ message: `Account with name ${deleteAccount.name} deleted successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting account' });
    }
}

exports.getAccounts = async (req, res) => {
    try {
        let accounts = await Accounts.find();
        return res.status(200).send({ accounts });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting accounts' });
    }
}

exports.getById = async (req, res) => {
    try {
        let { id } = req.params;
        let account = await Accounts.findOne({ _id: id });
        if (!account) return res.send({ message: 'Accout not found' });
        return res.status(200).send({ account });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting' });
    }
};

