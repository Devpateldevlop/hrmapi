// /api/punchHistory.js
const PunchHistory = require('../model/PunchHistory');
const mongoose = require('mongoose');
const cors = require('cors');
app.use(express.urlencoded({ extended: false }));
app.use(cors({orgin:'*'}));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const punchRecords = await PunchHistory.find();
      res.status(200).json(punchRecords);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
