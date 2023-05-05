'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3200;

const cellarRoutes = require('../src/Cellars/cellars.routes')
const userRoutes = require('../src/User/user.routes');
const clientRoutes = require('../src/Clients/client.routes');
const accountRoutes = require('../src/Accounts/accounts.routes');
const additionalServicesRoutes = require('../src/AdditionalServices/additional.routes');
const leasesRoutes = require('../src/Lease/lease.routes')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/cellar', cellarRoutes);
app.use('/user', userRoutes);
app.use('/client', clientRoutes)
app.use('/account', accountRoutes);
app.use('/service', additionalServicesRoutes);
app.use('/lease', leasesRoutes)


exports.initServer = () => {
    app.listen(port);
    console.log(`Server http running in port ${port}`);
}