const mongoose = require("mongoose");
const PunchHistory = require('../model/PunchHistory');
const connectToMongoDB = async () => {
  const uri = process.env.MONGO_URI;
  if (mongoose.connections[0].readyState) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
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
  
