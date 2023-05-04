'use strict'
const Cellar = require('./cellars.model');
const Lease = require('../Lease/lease.model')
const fs = require('fs');


exports.test = (req, res) => {
    res.send({ message: 'test fuction is running' });
}

exports.Add = async (req, res) => {
    try {
        let data = req.body;
        let cellarExist = await Cellar.findOne({ name: data.name });
        if (cellarExist) return res.send({ message: 'Cellar already exists' });
        let cellar = new Cellar(data);
        await cellar.save();
        return res.status(201).send({ message: 'Cellar added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error adding cellar' });
    }
}

exports.update = async (req, res) => {
    try {
        let cellarId = req.params.id;
        let data = req.body;
        let updateCellar = await Cellar.findOneAndUpdate({ _id: cellarId }, data, { new: true });
        if (!updateCellar) return res.send({ message: 'Cellar not found' });
        return res.status(201).send({ message: 'cellar updating successfully' });
    } catch (err) {
        console.error();
        return res.status(500).send({ message: 'Erro updating' });
    }
};

exports.delete = async (req, res) => {
    try {
        let cellarId = req.params.id;
        let cellarInLease = await Lease.findOne({ cellar: cellarId });
        if (cellarInLease) return res.send({ message: 'You cannot delete this cellar because it is leased' });
        let deleteCeller = await Cellar.findOneAndRemove({ _id: cellarId });
        if (!deleteCeller) return res.send({ message: 'Cellar not found and not deleted' });
        return res.status(200).send({ message: `Cellar with name ${deleteCeller.name} deteled successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting' });
    }
}

exports.getById = async (req, res) => {
    try {
        let { id } = req.params;
        let cellar = await Cellar.findOne({ _id: id });
        if (!cellar) return req.send({ message: 'Cellar not found' });
        return res.status(200).send({ cellar });
    } catch (e) {
        console.error(e);
    }
}

exports.getCellars = async (req, res) => {
    try {
        let cellar = await Cellar.find();
        return res.status(200).send({ cellar });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting cellars' });
    }
}

exports.getByLocation = async (req, res) => {
    try {
        let { location } = req.body;
        let cellars = await Cellar.find({ location: location });
        if (!cellars) return res.send({ message: 'There are no cellars at this location' });
        return res.status(200).send({ cellars });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting cellars' });
    }
};

exports.getByPrice = async (req, res) => {
    try {
        let { minPrice, maxPrice } = req.body;
        let cellars = await Cellar.find({ price: { $gte: minPrice, $lte: maxPrice } });
        if (!cellars) return res.sedn({ message: 'There are no cellars for this price' });
        return res.status(200).send({ cellars });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'error getting cellars' });
    }
}

exports.uploadImage = async (req, res) => {
    try {
        /* const cellarId = req.params.id;
        const alreadyImage = await Cellar.findOne({ _id: cellarId })
        let pathFile = './upload/cellar/'

        if (!req.files.image || !req.files.image.type) return res.status(400).send({ message: 'Havent sent image' })
        
        if (alreadyImage.image) fs.unlinkSync(`${pathFile}${alreadyImage.image}`)
        const filePath = req.files.image.path
        const fileSplit = filePath.split('\\')
        const fileName = fileSplit[2]
        const extension = fileName.split('\.')
        const fileExt = extension[1]
        if (
            fileExt == 'png' ||
            fileExt == 'jpg' ||
            fileExt == 'jpeg' ||
            fileExt == 'gif'
        ) {
            const updatedCellar = await Cellar.findOneAndUpdate(
                { _id: cellarId },
                { image: fileName },
                { new: true }
            )
            if (!updatedCellar) return res.status(404).send({ message: 'Cellar not found, not updated' })
            return res.send({ message: 'Uploaded image', updatedCellar })
        }
        fs.unlinkSync(filePath)
        return res.status(400).send({ message: 'Invalid extension' }) */
        const cellarId = req.params.id;
        const alreadyImage = await Cellar.findOne({ _id: cellarId })
        let pathFile = './upload/cellar/'
        if (!req.files.image || !req.files.image.type) return res.status(400).send({ message: 'Havent sent image' })
        const filePath = req.files.image.path
        const fileSplit = filePath.split('\\')
        const fileName = fileSplit[2]
        const extension = path.extname(fileName).toLowerCase();
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
        if (!allowedExtensions.includes(extension)) {
            fs.unlinkSync(filePath)
            return res.status(400).send({ message: 'Invalid extension' })
        }
        if (alreadyImage.image && extension !== path.extname(alreadyImage.image).toLowerCase()) {
            fs.unlinkSync(`${pathFile}${alreadyImage.image}`)
        }
        const updatedCellar = await Cellar.findOneAndUpdate(
            { _id: cellarId },
            { image: fileName },
            { new: true }
        )
        if (!updatedCellar) return res.status(404).send({ message: 'Cellar not found, not updated' })
        return res.send({ message: 'Uploaded image', updatedCellar })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error upload image' });
    }
}
