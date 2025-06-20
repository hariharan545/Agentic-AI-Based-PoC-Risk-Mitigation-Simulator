const express = require('express');
const {
    submitPoc,
    getReport,
    getReports,
    runTechStackAgent,
    runIntegrationRiskAgent,
    runBudgetAgent,
    runChecklistAgent,
    runLeanAgent
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

// @desc    Run Tech Stack Feasibility Agent and update PoC report
// @route   POST /api/v1/poc/tech-stack
router.post('/tech-stack', runTechStackAgent);

// @desc    Run Integration Risk Agent and update PoC report
// @route   POST /api/v1/poc/integration
router.post('/integration', runIntegrationRiskAgent);

// @desc    Run Budget & Timeline Risk Agent and update PoC report
// @route   POST /api/v1/poc/budget
router.post('/budget', runBudgetAgent);

// @desc    Run Pre-Launch Checklist Agent and update PoC report
// @route   POST /api/v1/poc/checklist
router.post('/checklist', runChecklistAgent);

// @desc    Run Lean Recommendation Agent and update PoC report
// @route   POST /api/v1/poc/lean-options
router.post('/lean-options', runLeanAgent);

module.exports = router; 