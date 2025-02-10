const mongoose = require('mongoose');

const punchHistorySchema = new mongoose.Schema({
  date: { type: String, required: true },
  punchIn: { type: String, required: true },
  punchOut: { type: String, required: true },
  Inaddress: { type: String, required: true },
  Outaddress: { type: String, required: true }
});


const PunchHistory = mongoose.model('PunchHistory', punchHistorySchema);

module.exports = PunchHistory;
