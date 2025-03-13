const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
mongoose.connect('mongodb+srv://pdev5771:rxHFzG2xPEkkocvM@cluster0.bso1d.mongodb.net')
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log('MongoDB connection error: ' + err));
    const PunchHistory=require("./model/PunchHistory.js")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({orgin:'*'}));
app.get("/",async (req,res)=>{
  res.status(200).json({message:"welcome to sap dev api"});
})
app.get('/PunchHistory', async (req, res) => {
    try {
        const punchRecords = await PunchHistory.find();
        res.json(punchRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 
const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);

});

 