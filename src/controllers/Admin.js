const Admin = require('../models/admin');
const Company = require('../models/company');
const Staff = require('../models/staff');
const Order = require('../models/order');
// const User = require('../models/user');

const createAdmin = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
};

// Get the number of companies
const getCompanyCount = async (req, res) => {
    try {
      // Retrieve the count of companies
      const companyCount = await Company.countDocuments();
  
      res.status(200).json({ companyCount });
    } catch (error) {

        console.error('Error retrieving company count:', error);
      res.status(500).json({ message: 'Error', error: error.message });
    }
};
  
// Get the number of staff
const getStaffCount = async (req, res) => {
    try {
        // Retrieve the count of staff
        const staffCount = await Staff.countDocuments();

        res.status(200).json({ staffCount });
    } catch (error) {
        
        console.error('Error retrieving staff count:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
};

// Get the number of users
// const getUserCount = async (req, res) => {
//     try {
//         // Retrieve the count of staff
//         const userCount = await User.countDocuments();

//         res.status(200).json({ userCount });
//     } catch (error) {
        
//         res.status(500).json({ message: 'Error', error: error.message });
//     }
// };





const acceptOrder = async (req, res) => {
    try {
        const { orderNumber } = req.body
    
        const order = await Order.findOne({ orderNumber });

        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }

        // Check if the order is in a state where it can be accepted
        if (order.status === 'pending') {
            // Update the order status to 'approved' or 'accepted'
            order.status = 'approved';
            await order.save();

            return res.status(200).json({ message: 'Order accepted successfully' });
        } else {
            return res.status(400).json({ message: 'Order cannot be accepted in its current state' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
};

const declineOrder = async (req, res) => {
    try {
        const { orderNumber } = req.body
    
        const order = await Order.findOne({ orderNumber });

        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }
    
        // Check if the order is in a state where it can be declined
        if (order.status === 'pending') {
          // Update the order status to 'declined'
          order.status = 'declined';
          await order.save();
    
            return res.status(200).json({ message: 'Order declined successfully' });
        } else {
            return res.status(400).json({ message: 'Order cannot be declined in its current state' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        // Retrieve all orders
        const orders = await Order.find();
    
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
};

module.exports = {
    createAdmin,
    getCompanyCount,
    getStaffCount,
    acceptOrder,
    declineOrder,
};