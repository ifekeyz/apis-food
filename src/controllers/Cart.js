const Cart = require('../models/cart'); // Import the Cart model
const Product = require('../models/product')

const addToCart = async (req, res) => {
  const userId = req.body.userId
    try {
        const { name, measurement, type,image,totalPrice,quantity } = req.body;
    
        // Fetch the product details from the database using name, measurement, and type
        const product = await Product.findOne({ name, measurement, type,image });
    
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        // Check if the cart item already exists in the user's cart
        let cart = await Cart.findOne({ userId });
    
        if (!cart) {
          cart = new Cart({
            userId,
            items: [],
          });
        }
    
        const existingItem = cart.items.find(
          (item) => item.name === name && item.image === image  && item.totalPrice === totalPrice
           && item.quantity === quantity && item.measurement === measurement && item.type === type
        );
    
        if (existingItem) {
          // If item exists, increment its quantity by 1
          existingItem.quantity += 1;
        } else {
          // If item doesn't exist, create a new cart item
          const cartItem = {
            name,
            image,
            measurement,
            type,
            quantity,
            totalPrice,
          };
    
          cart.items.push(cartItem);
        }
    
        // Update the cart in the database
        await cart.save();
    
        res.status(200).json({ message: 'Item added to cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
};



module.exports = {
    addToCart
};
