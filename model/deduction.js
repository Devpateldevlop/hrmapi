const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://pdev5771:rxHFzG2xPEkkocvM@cluster0.bso1d.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));

const deductionSchema = new mongoose.Schema({
    name: { type: String}, 
    amount: {type: Number},
    description: {type: String },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
});

const Deduction = mongoose.model('Deduction', deductionSchema);
module.exports = Deduction;