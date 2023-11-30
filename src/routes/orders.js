const { User } = require('../models/user');
const Cart = require('../models/cart');
const Order = require('../models/order')
const express = require('express');
const orderController = require('../controllers/Order');
const router = express.Router();

router.post('/createOrder', async (req, res) => {
  const userId = req.body.userId
  const { deliveryDetails, allItemsTotalPrice, userFullname } = req.body;
  try {
    const cart = await Cart.findOne({ userId }).populate('items');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }


    const orderItems = cart.items.map((item) => ({
      name: item.name,
      measurement: item.measurement,
      type: item.type,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    }));

    // Create a new order with delivery details
    const newOrder = new Order({
      userId,
      orderItems,
      deliveryDetails: {
        city: deliveryDetails.city,
        state: deliveryDetails.state,
        location: deliveryDetails.location,
        phoneNumber: deliveryDetails.phoneNumber,
      },
      allItemsTotalPrice,
      userFullname
    });

    // Save the new order
    await newOrder.save();

    // Clear the user's cart since items have been ordered
    cart.items = [];
    await cart.save();

    res.status(200).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});


router.get('/singleOrder/:id', async (req, res) => {
  try {
    const {id} = req.params

    orderList = await Order.findById(id)
    if (!orderList) {
      return res.status(201).json({ message: "Empty Order" });
    }

    return res.status(200).json(orderList);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
})

router.get('/getUserTotalPrice/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all orders for the given user
    const orders = await Order.find({ userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for the user' });
    }

    // Calculate the sum of allItemsTotalPrice across all orders
    const totalAllItemsTotalPrice = orders.reduce((total, order) => total + order.allItemsTotalPrice, 0);

    res.status(200).json({ userId, totalAllItemsTotalPrice });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching total price', error: error.message });
  }
});



router.get('/getShoppingHistory', async (req, res) => {
  try {
      // Query orders with 'delivered' status and populate orderItems
      const shoppingHistory = await Order.find({ status: 'approved' })
          .populate({
              path: 'orderItems',
              select: 'name measurement type quantity totalPrice',
          })
          .select('_id status orderDate') // Select additional fields if needed
          .sort('-orderDate'); // Sort orders by orderDate in descending order

      res.status(200).json(shoppingHistory);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching shopping history', error: error.message });
  }
});


router.get('/getShoppingHistory/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by userId
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Query orders with 'delivered' status and populate orderItems
    const shoppingHistory = await Order.find({ status: 'approved', userId: user._id })
      .populate({
        path: 'orderItems',
        select: 'name measurement type quantity totalPrice',
      })
      .select('_id status orderDate allItemsTotalPrice userFullname orderNumber userId') // Select additional fields if needed
      .sort('-orderDate'); // Sort orders by orderDate in descending order

    res.status(200).json(shoppingHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shopping history', error: error.message });
  }
});


module.exports = router;