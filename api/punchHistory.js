const mongoose = require('mongoose');
const express = require('express');
const PunchHistory = require('../model/PunchHistory'); // Assuming model is in models folder
const cors = require('cors');
const app = express();


app.use(cors({
    origin: '*', // Your frontend domain
    methods: ['GET', 'POST'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
}));
app.options('*', cors()); // This handles preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
app.get('/PunchHistory', async (req, res) => {
    try {
        const punchRecords = await PunchHistory.find();
        res.json(punchRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const punchHistories = await PunchHistory.find();
      res.status(200).json(punchHistories);
    } catch (err) {
      res.status(500).json({ error: 'Error retrieving punch history' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});