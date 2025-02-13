const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://pdev5771:rxHFzG2xPEkkocvM@cluster0.bso1d.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));
const LeaveBalanceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' } // Reference to Employee
});

const LeaveBalance = mongoose.model('LeaveBalance', LeaveBalanceSchema);
module.exports = LeaveBalance;
