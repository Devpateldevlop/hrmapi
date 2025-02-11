const mongoose = require('mongoose');
const { type } = require('os');
mongoose.connect("mongodb+srv://pdev5771:rxHFzG2xPEkkocvM@cluster0.bso1d.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));

// Define the Address Schema for employee
const AddressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
});

const EmployeeSchema = new mongoose.Schema({
    EmployeeCode: { type: Number, required: true, unique: true },
    profile: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        Email: { type: String, required: true },
        MobileNumber: { type: String, required: true },
        department: { type: String, required: true },
        role: { type: String, required: true },
        hireDate: { type: Date, required: true },
        designation:{type:String},
        DateOfBirth:{type:String},
        PANNumber:{type:String},
        AadhaarNumber:{type:String},
        Designation:{type:String},
        Department:{type:String},
        Branch:{type:String},
        Grade:{type:String},
        DateofJoining:{type:String},
        DateofConfirmation:{type:String},
        ReportingManager:{type:String},
        ApprovingManager:{type:String},
        BankName:{type:String},
        BankAccountNumber:{type:String},
        BankIFSCCode:{type:String},
        salary: { type: Number, required: true },
        address: AddressSchema,
        profileImage: { type: String }
    },
    punchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PunchHistory' }],
    payslips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payslip' }],
    leaveBalance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LeaveBalance' }],
    leaveHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LeaveHistory' }]
});

const Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;
