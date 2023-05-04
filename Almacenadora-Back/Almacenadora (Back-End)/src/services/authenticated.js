'use strict'

const jwt = require('jsonwebtoken');

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: `Doesn't contain headers "authorization"` });
    } else {
        try {
            let token = req.headers.authorization.replace(/[' "]+/g, '')
            var payload = jwt.decode(token, `${process.env.SECRET_KEY}`);
            console.log(payload.exp, payload.iat, Date.now());
            if (Math.floor(Date.now() / 1000) >= payload.exp) {
                return res.status(401).send({ message: 'Expired Token' });
            }
        } catch (e) {
            console.error(e);
            return res.status(400).send({ message: 'Invalid Token' });
        }
        req.user = payload;
        next();
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        let user = req.user;
        if (user.role !== 'ADMIN') return res.status(403).send({ message: 'Unauthorized user' })
        next();
    } catch (e) {
        console.error(e);
        return e;
    }
}

