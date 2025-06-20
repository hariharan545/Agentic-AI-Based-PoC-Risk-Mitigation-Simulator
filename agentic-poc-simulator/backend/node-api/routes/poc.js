const express = require('express');
const {
    submitPoc,
    getReport,
    getReports
} = require('../controllers/pocController');

const router = express.Router();

// @desc    Submit a PoC for analysis by all agents
// @route   POST /api/v1/poc/submit
router.post('/submit', submitPoc);

// @desc    Get a single report by ID
// @route   GET /api/v1/poc/reports/:id
router.get('/reports/:id', getReport);

// @desc    Get all reports
// @route   GET /api/v1/poc/reports
router.get('/reports', getReports);

module.exports = router; 