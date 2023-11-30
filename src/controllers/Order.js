const Cart = require('../models/cart');
const Order = require('../models/order');



const getShoppingHistory = async (req, res) => {
  try {
    // Query orders with 'delivered' status and populate orderItems
    const shoppingHistory = await Order.find({ status: 'delivered' })
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
};

module.exports = {
  getShoppingHistory,
};
