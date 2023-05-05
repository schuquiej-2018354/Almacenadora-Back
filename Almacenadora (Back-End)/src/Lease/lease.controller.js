'use strict'

const Lease = require('./lease.model');
const Services = require('../AdditionalServices/additional.model')
const Cellar = require('../Cellars/cellars.model');
const Client = require('../Clients/client.model');

exports.test = (req, res) => {
    res.send({ message: 'Test fuction is running' });
}

exports.add = async (req, res) => {
    try {
        let { cellar, client, services } = req.body;
        const lease = await Lease.findOne({ $and: [{ cellar: cellar }, { client: client }] });
        if (lease) return res.send({ message: 'This lease already exists' });
        const cellarA = await Cellar.findOne({ _id: cellar });
        if (!cellarA) return res.send({ message: 'cellar not found' });
        if (cellarA.availability == 'No disponible') return res.send({ message: 'Esta bodega no esta disponible' });
        let total = 0;
        for (let i = 0; i < services.length; i++) {
            const service = await Services.findOne({ _id: services[i] });
            total = parseInt(total) + parseInt(service.price);
        }
        let newLease = new Lease({ cellar: cellar, client: client, services: services, amount: total + parseInt(cellarA.price) });
        await newLease.save();
        let cellarUpdate = await Cellar.findOneAndUpdate({ _id: cellar }, { availability: 'No disponible' }, { new: true });
        return res.status(200).send({ message: 'Lease created successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error adding' });
    }
}

exports.update = async(req, res)=>{
    try{
        let { id } = req.params;
        let data =  req.body;
        let cellar = await Cellar.findOne({_id: data.cellar});
        if(!cellar) return res.send({message: 'cellar not found'});
        if(cellar.availability == 'no disponible') return res.send({message: 'Cellar not available and not updated'});
        let lease =  await Lease.findOne({_id: id});
        let cellarPrice = await Cellar.findOne({_id: lease.cellar});
        let price = cellarPrice.price;
        let newCellarPrice = cellar.price;
        let newAmount = (lease.amount-price)+newCellarPrice;
        console.log(newAmount);
        let leaseUpdate = await Lease.findOneAndUpdate({_id: id}, {cellar: data.cellar, amount: newAmount}, {new: true});
        let oldCellarUpdate = await Cellar.findOneAndUpdate({_id: lease.cellar}, { availability: 'Disponible' }, {new: true});
        let newCellarUpdate = await Cellar.findOneAndUpdate({_id: data.cellar}, { availability: 'No disponible' }, {new: true})
        if(!leaseUpdate) return res.send({message: 'Lease not found and not deleted'});
        return res.status(200).send({leaseUpdate});
    }catch(e){
        console.error(e);
        return res.status(500).send({message: 'Error updating'});
    }
}

exports.delete = async (req, res) => {
    try {
        let { id } = req.params;
        let cellarLease = await Lease.findOne({ _id: id });
        let lease = await Lease.findOneAndDelete({ _id: id });
        if (!lease) return res.send({ message: 'Lease not found and not deleted' });
        let updateCellar = await Cellar.findOneAndUpdate({ _id: cellarLease.cellar }, { availability: 'Disponible' }, { new: true });
        return res.status(200).send({ message: "Lease deleted" });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: 'Error deleting' });
    }
};

exports.get = async (req, res) => {
    try {
        let leases = await Lease.find().populate('cellar').populate('client').populate('services');
        return res.status(200).send({ leases });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: 'Error getting' });
    }
}

exports.getByCellarAndClient = async (req, res) => {
    try {
        let { name, clientId } = req.body;
        let cellar = await Cellar.findOne({ name: name });
        let client = await Client.findOne({ identification: clientId });
        if (!client || !cellar) return res.send({ message: 'Not Found' })
        let lease = await Lease.findOne({ $and: [{ cellar: cellar._id }, { client: client._id }] });
        if (!lease) res.send({ message: 'Lease nor found' });
        return res.status(200).send({ lease });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: 'Error getting' });
    }
}

exports.getById = async (req, res) => {
    try {
        let { id } = req.params;
        let lease = await Lease.findOne({ _id: id });
        if (!lease) return res.send({ message: 'Lease not found' })
        return res.status(200).send({ lease });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting' })
    }
}