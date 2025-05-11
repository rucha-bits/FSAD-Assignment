const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  class: { type: String, required: true },
  vaccinationRecords: [
    {
      driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive' },
      vaccineName: { type: String },
      date: { type: Date },
    },
  ],
});

module.exports = mongoose.model('Student', studentSchema);
