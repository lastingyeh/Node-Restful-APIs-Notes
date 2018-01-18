const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

// set aws cloud mongodb connection uri
const dbConnectionString = process.env.CONNECTION_STRING

mongoose.connect(dbConnectionString, { useMongoClient: true });

mongoose.Promise = global.Promise;

// logs
app.use(morgan('dev'));

// static file settings
app.use('/uploads/', express.static('uploads'));

// parser Handle following body-format
// JSON body parser
// Raw body parser
// Text body parser
// URL-encoded form body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Type', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

// routers
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// error handle
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 401;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);

	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;
