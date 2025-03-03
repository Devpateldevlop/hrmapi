const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://pdev5771:rxHFzG2xPEkkocvM@cluster0.bso1d.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));
const LeaveHistorySchema = new mongoose.Schema({
    LeaveType: { type: String, required: false },
    LeaveBalance: { type: Number, required: false },
    FromDate: { type: String, required: false },
    FromDateDayType: { type: String, required: false },
    ToDate: { type: String, required: false },
    ToDateDayType: { type: String, required: false },
    TotalLeaveDay: { type: Number, required: false },
    Remarks: { type: String, required: false },
    EmailNotificationTo: { type: String, required: false },
    Attachment: { type: String, required: false },
    lastName: { type: String, required: false },
    firstName: { type: String, required: false },
    employeeCode: { type: String, required: false },
    stat: { type: String, required: false },
    appliedDateTime:{ type: String, required: false },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
});


const LeaveHistory = mongoose.model('Leavehistory', LeaveHistorySchema);
module.exports = LeaveHistory;
