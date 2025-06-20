const { runOrchestrator } = require('../utils/agentRunner');
const PocReport = require('../models/PocReport'); // Assuming a Mongoose model

// @desc    Submit a PoC for analysis and get a report
// @route   POST /api/v1/poc/submit
// @access  Public
exports.submitPoc = async (req, res, next) => {
    try {
        // Ensure required fields are present
        const userInput = {
            project_name: req.body.project_name || "Default Project Name",
            description: req.body.description || "Default project description.",
            ...req.body
        };

        // Run the full orchestrator pipeline
        const orchestratorResult = await runOrchestrator(userInput);
        const finalReport = orchestratorResult.final_report || orchestratorResult;

        // TODO: Save the report to MongoDB
        // const report = await PocReport.create(finalReport);

        res.status(200).json({
            success: true,
            data: finalReport // In production, you'd return the saved `report` object
        });

    } catch (error) {
        console.error('Error in PoC submission:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all reports
// @route   GET /api/v1/poc/reports
// @access  Public
exports.getReports = async (req, res, next) => {
    // TODO: Implement logic to fetch all reports from MongoDB
    res.status(200).json({ success: true, data: [] });
};

// @desc    Get a single report
// @route   GET /api/v1/poc/reports/:id
// @access  Public
exports.getReport = async (req, res, next) => {
    // TODO: Implement logic to fetch a single report by ID from MongoDB
    res.status(200).json({ success: true, data: { id: req.params.id } });
}; 