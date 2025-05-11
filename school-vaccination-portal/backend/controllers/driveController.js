const Drive = require('../models/Drive');

// Create a vaccination drive
exports.createDrive = async (req, res) => {
  const { vaccineName, date, availableDoses, applicableClasses } = req.body;

  try {
    const drive = new Drive({
      vaccineName,
      date,
      availableDoses,
      applicableClasses,
    });

    await drive.save();
    res.status(201).json(drive);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all drives
exports.getDrives = async (req, res) => {
  try {
    const drives = await Drive.find();
    res.json(drives);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a vaccination drive
exports.updateDrive = async (req, res) => {
  const { id } = req.params;
  const { vaccineName, date, availableDoses, applicableClasses } = req.body;

  try {
    const updatedDrive = await Drive.findByIdAndUpdate(
      id,
      { vaccineName, date, availableDoses, applicableClasses },
      { new: true }
    );

    if (!updatedDrive) {
      return res.status(404).json({ error: 'Drive not found' });
    }

    res.json(updatedDrive);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a vaccination drive
exports.deleteDrive = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDrive = await Drive.findByIdAndDelete(id);

    if (!deletedDrive) {
      return res.status(404).json({ error: 'Drive not found' });
    }

    res.json({ message: 'Drive deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
