const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.get_all = async (req, res, next) => {
	try {
		const docs = await Order.find().populate('product');

		res.status(200).json({
			count: docs.length,
			orders: docs.map(doc => {
				return {
					...doc.toJSON(),
					request: {
						type: 'GET',
						url: 'http://localhost:3000/orders/' + doc._id
					}
				};
			})
		});
	} catch (error) {
		res.status(500).json({
			error
		});
	}
};

exports.create = async (req, res, next) => {
	try {
		const product = await Product.findById(req.body.productId);

		if (!product) {
			return res.status(404).json({
				message: 'Product not found'
			});
		} else {
			const order = new Order({
				_id: mongoose.Types.ObjectId(),
				quantity: req.body.quantity,
				product: req.body.productId
			});

			const result = await order.save();

			console.log(result);

			res.status(201).json({
				message: 'Order stored',
				createdOrder: {
					_id: result._id,
					product: result.product,
					quantity: result.quantity
				},
				request: {
					type: 'GET',
					url: 'http://localhost:3000/orders/' + result._id
				}
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error });
	}
};

exports.getOne = async (req, res, next) => {
	try {
		const order = await Order.findById(req.params.orderId).populate('product');

		if (!order) {
			return res.status(404).json({
				message: 'Order not found'
			});
		}

		res.status(200).json({
			order: order.toJSON(),
			request: {
				type: 'GET',
				url: 'http://localhost:3000/orders'
			}
		});
	} catch (error) {
		res.status(500).json({ error });
	}
};

exports.update = async (req, res, next) => {
	try {
		const id = req.params.orderId;
		const updateOps = {};

		const order = await Order.findById(id);

		if (order) {
			for (const ops of req.body) {
				updateOps[ops.propName] = ops.value;
			}

			const result = await Order.update({ _id: id }, { $set: updateOps });

			console.log(result);
			res.status(200).json({
				message: 'Order updated',
				request: {
					type: 'GET',
					url: 'http://localhost:3000/orders/' + id
				}
			});
		} else {
			res.status(404).json({
				message: 'Order Not Found'
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error });
	}
};

exports.delete = async (req, res, next) => {
	try {
		const result = await Order.remove({ _id: req.params.orderId });

		res.status(200).json({
			message: 'Order deleted',
			request: {
				type: 'POST',
				url: 'http://localhost:3000/orders',
				body: { productId: 'ID', quantity: 'Number' }
			}
		});
	} catch (error) {
		res.status(500).json({ error });
	}
};
