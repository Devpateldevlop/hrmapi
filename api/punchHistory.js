const mongoose = require("mongoose");

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
  // Connect to MongoDB
  await connectToMongoDB();

  // Example response
  res.status(200).json({ message: "Hello from Node.js API!" });
};
