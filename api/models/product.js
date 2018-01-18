const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true },
	price: { type: Number, require: true },
	productImage: { type: String, required: true }
});

productSchema.methods = {
	toJSON() {
		return {
			_id: this._id,
			name: this.name,
			price: this.price,
			productImage: this.productImage
		};
	}
};

module.exports = mongoose.model('Product', productSchema);
