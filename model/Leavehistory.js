const mongoose = require('mongoose');

const LeaveHistorySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    type: { type: String, required: true },
    duration: { type: String, required: true },
    status: { type: String, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' } // Reference to Employee
});

const LeaveHistory = mongoose.model('calendar', LeaveHistorySchema);
module.exports = LeaveHistory;
