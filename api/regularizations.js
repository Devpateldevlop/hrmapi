const mongoose = require('mongoose');
const express = require('express');
const Employee = require('../model/Employee');
const Leavebalance = require('../model/Leavebalance'); // Assuming model is in models folder
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'], 
    allowedHeaders: ['Content-Type'], 
}));
app.options('*', cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));

app.get("/api/regularization/:id",(req,res)=>{
    var id = req.params.id
    res.send("welcome "+id);
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});