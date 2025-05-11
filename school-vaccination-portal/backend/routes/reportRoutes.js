const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Add report routes here
router.get('/', reportController.getVaccinationReport);

module.exports = router;
