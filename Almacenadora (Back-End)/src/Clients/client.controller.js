'use strict'

const Client = require('./client.model');
const { validateData } = require('../utils/validate');
const Lease = require('../Lease/lease.model');

exports.test = (req, res) => {
    res.send({ message: 'test fuction is running' });
}

exports.add = async (req, res) => {
    try {
        let data = req.body;
        let clientExist = await Client.findOne({ identification: data.identification });
        if (clientExist) return res.send({ message: 'This client already exists' });
        let credentials = {
            name: data.name,
            surname: data.surname,
            identification: data.identification,
            residency: data.residency
        }
        let msg = validateData(credentials);
        if (msg) return res.send({ msg });
        let client = new Client(data);
        await client.save();
        return res.status(201).send({ message: 'Client created successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error adding' });
    }
};

exports.update = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let clientUpdate = await Client.findOneAndUpdate({ _id: id }, data, { new: true });
        if (!clientUpdate) return res.send({ message: 'Client not found and not deleted' });
        return res.status(200).send({ message: 'client updating', clientUpdate });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating' });
    }
};

exports.delete = async (req, res) => {
    try {
        let { id } = req.params;
        let clientLease = await Lease.findOne({ client: id })
        if (clientLease) return res.send({ message: 'This client is renting a warehouse' });
        let client = await Client.findOneAndDelete({ _id: id });
        if (!client) return res.send({ message: 'Client not found and not deleted' });
        return res.status(200).send({ message: `Client with identification ${client.identification} deleted successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting' });
    }
}

exports.get = async (req, res) => {
    try {
        let client = await Client.find();
        return res.status(200).send({ client });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting' });
    }
};

exports.getByIdentification = async (req, res) => {
    try {
        let { identification } = req.body;
        let clients = await Client.find({ identification: { $regex: identification } });
        return res.status(200).send({ clients });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting' });
    }
};

exports.getById = async (req, res) => {
    try {
        let { id } = req.params;
        console.log(id);
        let client = await Client.findOne({ _id: id });
        if (!client) return res.send({ message: 'Client not found' });
        return res.status(200).send({ client });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting' });
    }
}