const mongoose = require('mongoose');
const { type } = require('os');
mongoose.connect("mongodb+srv://pdev5771:rxHFzG2xPEkkocvM@cluster0.bso1d.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));

const AddressSchema = new mongoose.Schema({
    file: { type: String}
});

const Employee = mongoose.model('serviceworker', AddressSchema);
module.exports = Employee;
