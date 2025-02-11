const mongoose = require('mongoose');
const express = require('express');
const PunchHistory = require('../model/PunchHistory'); // Assuming model is in models folder
const cors = require('cors');
const app = express();


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({orgin:'*'}));
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
