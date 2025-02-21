const mongoose = require('mongoose');
const { type } = require('os');
mongoose.connect("mongodb+srv://pdev5771:rxHFzG2xPEkkocvM@cluster0.bso1d.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));

const calendarSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
});

const calendar = mongoose.model('calendar', calendarSchema);
module.exports = calendar;
