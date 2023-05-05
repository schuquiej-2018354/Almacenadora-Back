'use strict'

const jwt = require('jsonwebtoken');

exports.createToken = (account) => {
    try {
        let payload = {
            sub: account._id,
            name: account.name,
            surname: account.surname,
            username: account.username,
            email: account.email,
            role: account.role,
            nit: account.nit,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 120)
        }
        return jwt.sign(payload, `$(procces.env.SECRET_KEY)`);
    } catch (e) {
        console.error(e);
        return e;
    }
}