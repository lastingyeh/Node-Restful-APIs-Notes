const express = require('express');

const router = express.Router();

// middleware
const checkAuth = require('../middleware/check-auth');

// controllers
const OrdersController = require('../controllers/orders');

// routers
router.get('/', checkAuth, OrdersController.get_all);

router.post('/', checkAuth, OrdersController.create);

router.get('/:orderId', checkAuth, OrdersController.getOne);

router.patch('/:orderId', checkAuth, OrdersController.update);

router.delete('/:orderId', checkAuth, OrdersController.delete);

// exports
module.exports = router;
