const mongoose = require('mongoose');
const express = require('express');
// const Employee = require('../model/Employee');
const servicework = require('../model/serviceworker'); // Assuming model is in models folder
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*', // Allow all domains or restrict to your frontend's domain
    methods: ['GET', 'POST', 'PUT','OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
}));
app.options('*', cors()); // This handles preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));


app.post('/api/servicework', async (req, res) => {
    try {
      const { file } = req.body;
      const newAddress = new servicework({ file:file });
      await newAddress.save();
      res.status(201).json({
        message: 'service worker created successfully',
        file: newAddress.file
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
 app.get('/api/servicework', async (req, res) => {
  try {
    const addresses = await servicework.find();

    // Iterate over each address and parse the 'file' field if it's a valid JSON string
    const parsedAddresses = addresses.map(address => {
      try {
        address.file = JSON.parse(address.file);
      } catch (err) {
        console.error('Error parsing file content:', err);
        address.file = err; // or keep the raw string if it can't be parsed
      }
      return address;
    });

    res.status(200).json(parsedAddresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  
  app.put('/servicework/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { file } = req.body;
  
      const updatedAddress = await servicework.findByIdAndUpdate(id, { file }, { new: true });
  
      if (!updatedAddress) {
        return res.status(404).json({ error: 'Address not found' });
      }
  
      res.status(200).json(updatedAddress);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  


app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
