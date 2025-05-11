const Student = require('../models/Student');
const Drive = require('../models/Drive');

// Add a new student
exports.addStudent = async (req, res) => {
  const { name, studentId, class: studentClass } = req.body;
  try {
    const student = new Student({ name, studentId, class: studentClass });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all students or filtered students
exports.getStudents = async (req, res) => {
  const { name, class: classFilter, vaccinationStatus } = req.query;
  const query = {};

  if (name) query.name = { $regex: name, $options: 'i' };
  if (classFilter) query.class = classFilter;
  if (vaccinationStatus === 'vaccinated') {
    query.vaccinationRecords = { $exists: true, $ne: [] };
  } else if (vaccinationStatus === 'unvaccinated') {
    query.vaccinationRecords = { $eq: [] };
  }

  try {
    const students = await Student.find(query);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark a student as vaccinated
exports.markVaccinated = async (req, res) => {
  const { studentId, driveId } = req.body;

  try {
    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ error: 'Drive not found' });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const alreadyVaccinated = student.vaccinationRecords.some(
      (record) => record.driveId.toString() === driveId
    );
    if (alreadyVaccinated) {
      return res.status(400).json({ error: 'Student already vaccinated for this drive' });
    }

    student.vaccinationRecords.push({
      driveId,
      vaccineName: drive.vaccineName,
      date: new Date(),
    });

    await student.save();
    res.json({ message: 'Vaccination recorded successfully', student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
