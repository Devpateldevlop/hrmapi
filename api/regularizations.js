const mongoose = require('mongoose');
const express = require('express');
const Employee = require('../model/Employee');
const Leavebalance = require('../model/Leavebalance'); // Assuming model is in models folder
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*', // Allow all domains or restrict to your frontend's domain
    methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allow ed headers
}));
app.options('*', cors()); // This handles preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
});
app.get("/api/regulatization",(req,res)=>{
    res.send("welcome");
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});