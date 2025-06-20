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
        type: String,
        required: true
    },
    integrationRisk: {
        type: String,
        required: true
    },
    budgetStressTest: {
        type: String,
        required: true
    },
    preLaunchChecklist: {
        type: String,
        required: true
    },
    leanAlternative: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PocReport', PocReportSchema); 