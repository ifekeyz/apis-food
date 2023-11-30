const Cart = require('../models/cart'); // Import the Cart model
const Product = require('../models/product')
const express = require('express');
const cartController = require('../controllers/Cart');
const router = express.Router();

router.post('/addToCart', cartController.addToCart);

router.get('/getCartItems', async (req, res) => {
    const userId = req.query.userId
    try {
        // Find all cart items with the specified userId
        const cartItems = await Cart.findOne({ userId }).select('items');

        if (!cartItems) {
            // Handle the case where no cart items were found for the given userId
            return res.status(201).json({ message: "Empty Cart" });
        }

        // Extract the items array from the cart document and return it
        return res.status(200).json({ items: cartItems.items });

    } catch (error) {
        // Handle any errors that occur during the query
        console.error('Error getting cart items:', error);

        res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
});

router.delete('/deleteCartItem/:userId/:itemId', async (req, res) => {
    const userId = req.params.userId;
    const itemId = req.params.itemId;

    try {
        // Find the cart document for the specified user
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Opps! Cart not found " });
        }

        // Find the index of the cart item to remove
        const itemIndex = cart.items.findIndex(item => item._id === itemId);

        if (itemIndex === 0) {
            return res.status(404).json({ message: "Item not found in the cart" });
        }

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);

        // Save the updated cart document
        await cart.save();

        // Respond with a success message or updated cart data
        return res.status(200).json({ message: "Cart item deleted successfully", updatedCart: cart });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'Error deleting cart item', error: error.message });
    }
});


module.exports = router;