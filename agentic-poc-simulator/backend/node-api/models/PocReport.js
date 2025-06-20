const mongoose = require('mongoose');

const PocReportSchema = new mongoose.Schema({
    projectDescription: {
        type: String,
        required: [true, 'Please add a project description'],
        trim: true
    },
    techStack: {
        type: String,
        required: [true, 'Please add a tech stack']
    },
    techFeasibility: {
        compatibilityReport: { type: String },
        scalabilityScore: { type: Number },
        riskScore: { type: Number },
        deprecatedWarnings: [{ type: String }]
    },
    integrationRisk: {
        apiFailurePoints: { type: String },
        securityAndRateLimits: { type: String },
        riskSeverity: { type: String },
        mitigation: { type: String }
    },
    budgetStressTest: {
        estimatedDevelopmentCosts: { type: String },
        timelineDelays: { type: String },
        highRiskCostAreas: [{ type: String }]
    },
    preLaunchChecklist: {
        functionalTests: [{ type: String }],
        securityTasks: [{ type: String }],
        priorityChecklist: [{ type: String }]
    },
    leanAlternative: {
        simplifiedStackAlternatives: [{ type: String }],
        estimatedCostTimeSavings: { type: String },
        prosCons: [{ type: String }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PocReport', PocReportSchema); 