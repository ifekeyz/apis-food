const express = require('express');
const productController = require('../controllers/Product');
const Product = require('../models/product'); // Import the Product model
const multer = require('multer');
const router = express.Router();



const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({ storage: storage })

router.post('/createProduct', uploadOptions.single('image'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) { return res.status(400).send("No image in the request") }
        const fileName = req.file.filename
        const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        const { name, measurement, type, price,quantity } = req.body;

        const newProduct = new Product({
            name: name,
            measurement: measurement,
            type: type,
            price: price,
            quantity: quantity,
            image: `${basepath}${fileName}`,
        });

        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

router.get('/',async(req,res)=>{
        const products = await Product.find();
        if(!products){
            return res.status(500).json({ message: 'Error while fetching all the products'});
        }
        else{
            res.status(200).json(products);
        }
})

router.get('/:id', async(req, res)=>{

    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return res.status(500).send({ message: "error fetching the product" })
    }
    res.send(product);
})


router.put('/update', async(req, res)=>{})

module.exports = router;