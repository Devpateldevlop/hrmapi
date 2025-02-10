const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const cors = require('cors');

const User = require('./model/User');

const PunchHistory = require('./model/PunchHistory');
 
const app = express();

const port = process.env.PORT || 8080;
 
mongoose.connect('mongodb+srv://pdev5771:rxHFzG2xPEkkocvM@cluster0.bso1d.mongodb.net')

    .then(() => console.log('MongoDB Connected...'))

    .catch((err) => console.log('MongoDB connection error: ' + err));
// Enable CORS with proper headers
 
app.use(express.json());

app.use(bodyParser.json());
 

// app.use(cors());

// Example for Vercel serverless functions

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
//   if (req.method === "OPTIONS") {
//       return res.status(200).end();
//   }
//   next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const corsOptions = {
  origin: '*', 
  methods: 'GET,POST,PUT,DELETE'
};

// const corsOptions = {
//   origin: '*',  // Allow specific origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE']  // Allowed headers
// };

// // Apply CORS middleware
// app.use(cors(corsOptions));

// module.exports = async (req, res) => {
//   // Handle CORS preflight (OPTIONS) requests
//   if (req.method === 'OPTIONS') {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     return res.status(200).end();
//   }

//   // Handle actual request (GET, POST, etc.)
//   await app(req, res);
// };


 
// Punch History Routes

app.get('/PunchHistory', async (req, res) => {

    try {

        const punchRecords = await PunchHistory.find();

        res.json(punchRecords);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});
 
app.post('/PunchHistory', async (req, res) => {

    const { date, punchIn, punchOut, Inaddress, Outaddress } = req.body;

    try {

        const newPunch = new PunchHistory({ date, punchIn, punchOut, Inaddress, Outaddress });

        await newPunch.save();

        res.status(201).json(newPunch);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});
 
app.delete('/PunchHistory/:id', async (req, res) => {

    try {

        const deletedPunch = await PunchHistory.findByIdAndDelete(req.params.id);

        if (!deletedPunch) {

            return res.status(404).json({ message: 'Punch record not found' });

        }

        res.status(200).json({ message: 'Punch record deleted' });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});
 
// User Routes

app.get('/users', async (req, res) => {

    try {

        const users = await User.find();

        res.json(users);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});
 
app.get('/users/:id', async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({ message: 'User not found' });

        }

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});
 
app.post('/users', async (req, res) => {

    const { name, email, age } = req.body;

    try {

        const newUser = new User({ name, email, age });

        await newUser.save();

        res.status(201).json(newUser);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});
 
app.put('/users/:id', async (req, res) => {

    try {

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedUser) {

            return res.status(404).json({ message: 'User not found' });

        }

        res.status(200).json(updatedUser);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});
 
app.delete('/users/:id', async (req, res) => {

    try {

        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {

            return res.status(404).json({ message: 'User not found' });

        }

        res.status(200).json({ message: 'User deleted' });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});
 
app.get('/', (req, res) => {

    res.send('Hello, welcome to the API!');

});
 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);

});

 