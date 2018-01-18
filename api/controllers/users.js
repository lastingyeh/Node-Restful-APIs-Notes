const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.userSignup = async (req, res, next) => {
	try {
		const user = await User.find({ email: req.body.email });

		if (user.length >= 1) {
			return res.status(409).json({
				message: 'Mail exists.'
			});
		} else {
			const cryptpassword = await bcrypt.hash(req.body.password, 10);

			const user = new User({
				_id: new mongoose.Types.ObjectId(),
				email: req.body.email,
				password: cryptpassword
			});

			const result = await user.save();

			return res.status(201).json({
				message: 'signup success',
				userID: result.email
			});
		}
	} catch (error) {
		return res.status(500).json({ error });
	}
};

exports.userLogin = async (req, res, next) => {
	try {
		const users = await User.find({ email: req.body.email });

		if (users.length < 1) {
			return res.status(401).json({
				message: 'Auth failed'
			});
		}

		const result = await bcrypt.compare(req.body.password, users[0].password);

		if (result) {
			const token = jwt.sign(
				{
					email: users[0].email,
					userId: users[0]._id
				},
				process.env.JWT_KEY,
				{
					expiresIn: '1h'
				}
			);

			return res.status(200).json({
				message: 'Auth successful',
				token
			});
		}
		return res.status(401).json({
			message: 'Auth failed'
		});
	} catch (error) {
		return res.status(500).json({ error });
	}
};

exports.userDelete = async (req, res, next) => {
	try {
		const id = req.params.userId;
		const result = await User.remove({ _id: id });

		return res.status(200).json({
			message: 'User deleted'
		});
	} catch (error) {
		return res.status(500).json({ error });
	}
};
