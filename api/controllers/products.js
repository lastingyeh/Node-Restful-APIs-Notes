const mongoose = require('mongoose');

const Product = require('../models/product');

exports.get_all = async (req, res, next) => {
	try {
		const docs = await Product.find();

		const response = {
			count: docs.length,
			products: docs.map(doc => {
				return {
					...doc.toJSON(),
					request: {
						type: 'GET',
						url: 'http://localhost:3000/products/' + doc._id
					}
				};
			})
		};
		res.status(200).json(response);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error });
	}
};

exports.create = async (req, res, next) => {
	// body-parser
	// POST Method -> raw (Body) -> JSON(application/json)
	// use Models of product
	console.log(req.file);

	try {
		const product = new Product({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
			price: req.body.price,
			productImage: req.file.path
		});

		const result = await product.save();

		console.log(result);

		res.status(201).json({
			message: 'Created product successfully',
			createdProduct: {
				name: result.name,
				price: result.price,
				_id: result._id,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products/' + result._id
				}
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error });
	}
};

exports.getOne = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const doc = await Product.findById(id);

		if (doc) {
			res.status(200).json({
				product: doc.toJSON(),
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products'
				}
			});
		} else {
			res.status(404).json({ message: 'No valid entry found for provided ID' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error });
	}
};

exports.update = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const updateOps = {};

		for (const ops of req.body) {
			updateOps[ops.propName] = ops.value;
		}

		const result = await Product.update({ _id: id }, { $set: updateOps });

		res.status(200).json({
			message: 'Product updated',
			request: {
				type: 'GET',
				url: 'http://localhost:3000/products/' + id
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error });
	}
};

exports.delete = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const result = await Product.remove({ _id: id }).exec();
		res.status(200).json({
			message: 'Product deleted',
			request: {
				type: 'POST',
				url: 'http://localhost:3000/products',
				body: { name: 'String', price: 'Number' }
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error });
	}
};
