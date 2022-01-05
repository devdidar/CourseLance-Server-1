const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

// Read from ENV
require('dotenv').config();
const port = process.env.PORT || 9000;
const uri = process.env.MONGODB_URI;

// Initialize App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connection to MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const dbConnect = async () => {
    try {
        await client.connect();
        const courseLance = client.db("courseLance");
        const coursesDB = courseLance.collection('courses');

        // GET requests
        app.get('/courses', async (req, res) => {
            const cursor = coursesDB.find({});
            if ((await cursor.count()) === 0) {
                res.json([]);
            }
            else {
                const products = await cursor.toArray();
                const orderedProducts = products.reverse();
                res.json(orderedProducts);
            }
        })
    }
    finally {
        console.log('Database is Online!');
    }
}

dbConnect();

app.get('/', (req, res) => {
    res.send('Listening for requests!')
});

app.listen(port, () => {
    console.log(`Listening at port: ${port}`)
});