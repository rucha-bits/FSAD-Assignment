const express = require('express');
const router = express.Router();
const driveController = require('../controllers/driveController');

router.post('/', driveController.createDrive);
router.get('/', driveController.getDrives);
router.put('/:id', driveController.updateDrive);
router.delete('/:id', driveController.deleteDrive);

module.exports = router;
