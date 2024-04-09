const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://21bmiit145:root@satnam-decor.kya4kd2.mongodb.net/db_145?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB");
});

// Define product schema
const productSchema = new mongoose.Schema({
    Product_Name: String,
    Price: Number,
    Quantity: Number,
    Purchase_Date: Date
});

const Product = mongoose.model('Products', productSchema);

const app = express();
app.use(bodyParser.json());

// Handle HTTP methods
app.get('/products/:id?', async (req, res) => {
    try {
        const productId = req.params.id;
        let query = {};
        if (productId) {
            query = { _id: productId };
        }
        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/products', async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const product = new Product(data);
        await product.save();
        res.json({ message: 'Product created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const data = req.body;
        await Product.findByIdAndUpdate(productId, data);
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    // res.redirect('/contact')
    res.send('Hello World!');
})

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
