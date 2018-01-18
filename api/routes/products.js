const express = require('express');
const router = express.Router();

const multer = require('multer');

const ProductController = require('../controllers/products');
// middleware
const checkAuth = require('../middleware/check-auth');

// set upload configuration
// set storage path && filename
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	}
});
// fitler upload file type
const fileFilter = (req, file, cb) => {
	// reject a file
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(new Error('IMAGE Format Error'), false);
	}
};
// settings
const upload = multer({
	storage,
	limits: { fileSize: 1024 * 1024 * 5 },
	fileFilter
});

router.get('/', ProductController.get_all);

router.post(
	'/',
	checkAuth,
	upload.single('productImage'),
	ProductController.create
);

router.get('/:productId', ProductController.getOne);

router.patch('/:productId', checkAuth, ProductController.update);

router.delete('/:productId', checkAuth, ProductController.delete);

module.exports = router;
