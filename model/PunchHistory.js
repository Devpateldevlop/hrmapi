const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://pdev5771:rxHFzG2xPEkkocvM@cluster0.bso1d.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));
const punchHistorySchema = new mongoose.Schema({
  date: { type: String, required: true },
  punchIn: { type: String},
  punchOut: { type: String},
  Inaddress: { type: String},
  Outaddress: { type: String},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
});

const PunchHistory = mongoose.model('PunchHistory', punchHistorySchema);

module.exports = PunchHistory;
