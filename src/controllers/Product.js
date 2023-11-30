const Product = require('../models/product'); // Import the Product model

// const createProduct = async (req, res) => {
  
//   try {
//     const { name, measurement, type, price,quantity } = req.body;
//     const image = req.file.image
//     const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`;

//     const newProduct = new Product({
//       name: name,
//       measurement: measurement,
//       type: type,
//       price: price,
//       quantity: quantity,
//       image: `${basepath}${image}`,
//     });

//     const savedProduct = await newProduct.save();

//     res.status(401).json(savedProduct);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating product', error: error.message });
//   }
// }

const getPrice = async (req, res) => {
  try {
    const { name, measurement, type } = req.query;

    const product = await Product.findOne({ name, measurement, type });

    if (product) {
      res.status(200).json({ price: product.price });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error getting price', error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    // Query the database to get all products
    const products = await Product.find();

    // Return the list of products as a JSON response
    return res.status(200).json(products);
  } catch (error) {
    // Handle errors, e.g., log the error or return a 500 Internal Server Error status
    console.error('Error getting products:', error);
    return res.status(500).json({ message: 'Error', error: error.message });
  }
}

module.exports = {
  // createProduct,
  getPrice,
  getAllProducts
};
