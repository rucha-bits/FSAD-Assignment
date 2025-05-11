const Student = require('../models/Student');

// GET /api/reports
// Optional query: vaccineName, page, limit
exports.getVaccinationReport = async (req, res) => {
  try {
    const { vaccineName = '', page = 1, limit = 10 } = req.query;

    // Step 1: Find all students with matching vaccination records
    const students = await Student.find({
      'vaccinationRecords.vaccineName': {
        $regex: vaccineName,
        $options: 'i',
      },
    }).select('name studentId class vaccinationRecords');

    // Step 2: Flatten data
    const allRows = [];
    students.forEach((s) => {
      (s.vaccinationRecords || []).forEach((r) => {
        if (!vaccineName || r.vaccineName.toLowerCase().includes(vaccineName.toLowerCase())) {
          allRows.push({
            name: s.name,
            studentId: s.studentId,
            class: s.class,
            vaccineName: r.vaccineName,
            date: r.date,
          });
        }
      });
    });

    // Step 3: Paginate
    const pg = parseInt(page);
    const lim = parseInt(limit);
    const start = (pg - 1) * lim;
    const paginated = allRows.slice(start, start + lim);

    res.json({
      total: allRows.length,
      page: pg,
      pages: Math.ceil(allRows.length / lim),
      data: paginated,
    });
  } catch (err) {
    console.error('Error generating vaccination report:', err);
    res.status(500).json({ error: err.message });
  }
};
