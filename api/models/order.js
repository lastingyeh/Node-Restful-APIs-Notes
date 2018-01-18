const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
	_id: Schema.Types.ObjectId,
	product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
	quantity: { type: Number, default: 1 }
});

orderSchema.methods = {
	toJSON() {
		return {
			_id: this._id,
			product: this.product,
			quantity: this.quantity
		};
	}
};

module.exports = mongoose.model('Order', orderSchema);
