const mongoose = require('mongoose');

const LeaveHistorySchema = new mongoose.Schema({
    LeaveType: { type: String, required: false },
    LeaveBalance: { type: Number, required: false },
    FromDate: { type: Date, required: false },
    FromDateDayType: { type: String, required: false },
    ToDate: { type: Date, required: false },
    ToDateDayType: { type: String, required: false },
    TotalLeaveDay: { type: Number, required: false },
    Remarks: { type: String, required: false },
    EmailNotificationTo: { type: String, required: true },
    Attachment: { type: String, required: false },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' } 
});

const LeaveHistory = mongoose.model('Leavehistory', LeaveHistorySchema);
module.exports = LeaveHistory;
