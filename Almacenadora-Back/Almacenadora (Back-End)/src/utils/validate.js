'use strict'

const bcrypt = require('bcrypt');

exports.validateData = (data) => {
    let keys = Object.keys(data), msg = '';
    for (let key of keys) {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
        msg += `The params ${key} is required\n`
    }
    return msg.trim();
}

// Encriptar la contraseña 
exports.encrypt = async (password) => {
    try {
        return await bcrypt.hashSync(password, 10);
    } catch (e) {
        console.error(e);
        return e;
    }
}

exports.checkPassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (e) {
        console.error(e);
        return false;
    }
}

exports.deleteSensitiveData = (user) => {
    try {
        delete user._id
    } catch (err) {
        console.error(err);
        return err;
    }
}