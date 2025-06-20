const runAgent = require('../utils/agentRunner');
const PocReport = require('../models/PocReport');

// Rate limiting and quota management
class ApiRateLimiter {
    constructor() {
        this.requestCount = 0;
        this.windowStart = Date.now();
        this.windowSize = 60000; // 1 minute window
        this.maxRequestsPerWindow = 10; // Adjust based on your quota
        this.lastRequestTime = 0;
        this.minDelay = 8000; // 8 seconds minimum between requests
    }

    async waitForRateLimit() {
        const now = Date.now();
        
        // Reset window if needed
        if (now - this.windowStart > this.windowSize) {
            this.requestCount = 0;
            this.windowStart = now;
        }

        // Check if we're hitting the rate limit
        if (this.requestCount >= this.maxRequestsPerWindow) {
            const waitTime = this.windowSize - (now - this.windowStart);
            console.log(`Rate limit reached, waiting ${waitTime}ms for new window...`);
            await this.delay(waitTime);
            this.requestCount = 0;
            this.windowStart = Date.now();
        }

        // Ensure minimum delay between requests
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.minDelay) {
            const waitTime = this.minDelay - timeSinceLastRequest;
            console.log(`Enforcing minimum delay, waiting ${waitTime}ms...`);
            await this.delay(waitTime);
        }

        this.requestCount++;
        this.lastRequestTime = Date.now();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const rateLimiter = new ApiRateLimiter();

// Enhanced retry logic with intelligent backoff
async function runAgentWithIntelligentRetry(agentType, userInput, maxRetries = 4) {
    const baseDelay = 10000; // Start with 10 seconds
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // Wait for rate limiting before each attempt
            await rateLimiter.waitForRateLimit();
            
            console.log(`Running ${agentType} agent (attempt ${attempt + 1}/${maxRetries})`);
            const result = await runAgent(agentType, userInput);
            
            // Success - return result
            return result;
            
        } catch (error) {
            const errorMessage = error.message.toLowerCase();
            console.error(`${agentType} agent failed (attempt ${attempt + 1}):`, error.message);
            
            // Handle different types of quota errors
            if (errorMessage.includes('429') || 
                errorMessage.includes('quota') || 
                errorMessage.includes('exhausted') ||
                errorMessage.includes('rate limit') ||
                errorMessage.includes('too many requests')) {
                
                if (attempt < maxRetries - 1) {
                    // Exponential backoff with jitter for quota errors
                    const backoffDelay = baseDelay * Math.pow(2, attempt) + Math.random() * 5000;
                    console.log(`Quota error detected, backing off for ${Math.round(backoffDelay)}ms...`);
                    await rateLimiter.delay(backoffDelay);
                    continue;
                } else {
                    throw new Error(`${agentType}: API quota exhausted after ${maxRetries} attempts. Please try again later.`);
                }
            } else if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
                // Handle network/timeout errors with shorter backoff
                if (attempt < maxRetries - 1) {
                    const networkDelay = 3000 + (attempt * 2000);
                    console.log(`Network error, retrying in ${networkDelay}ms...`);
                    await rateLimiter.delay(networkDelay);
                    continue;
                }
            }
            
            // For other errors, don't retry - fail fast
            throw error;
        }
    }
}

// Batch processing with intelligent scheduling
async function processBatchWithScheduling(agents, userInput) {
    const results = {};
    const batchSize = 2; // Process 2 agents at a time to spread load
    const batchDelay = 30000; // 30 seconds between batches
    
    // Split agents into batches
    const batches = [];
    for (let i = 0; i < agents.length; i += batchSize) {
        batches.push(agents.slice(i, i + batchSize));
    }
    
    console.log(`Processing ${agents.length} agents in ${batches.length} batches...`);
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        console.log(`Processing batch ${batchIndex + 1}/${batches.length}: [${batch.join(', ')}]`);
        
        // Process agents in current batch sequentially
        for (const agentType of batch) {
            try {
                results[agentType] = await runAgentWithIntelligentRetry(agentType, userInput);
                console.log(`✓ ${agentType} completed successfully`);
            } catch (error) {
                console.error(`✗ ${agentType} failed:`, error.message);
                results[agentType] = {
                    response: `Analysis temporarily unavailable: ${error.message}`,
                    error: true,
                    timestamp: new Date().toISOString()
                };
            }
        }
        
        // Wait between batches (except for the last batch)
        if (batchIndex < batches.length - 1) {
            console.log(`Batch ${batchIndex + 1} complete. Waiting ${batchDelay}ms before next batch...`);
            await rateLimiter.delay(batchDelay);
        }
    }
    
    return results;
}

// @desc    Submit a PoC for analysis and get a report
// @route   POST /api/v1/poc/submit
// @access  Public
exports.submitPoc = async (req, res, next) => {
    const startTime = Date.now();
    
    try {
        // No input truncation - send full data to agents
        const userInput = req.body;
        
        console.log('Starting comprehensive PoC analysis...');
        console.log(`Input data size: ${JSON.stringify(userInput).length} characters`);
        
        const agents = [
            'tech_stack_agent',
            'integration_risk_agent', 
            'budget_agent',
            'checklist_agent',
            'lean_agent'
        ];

        // Process agents with intelligent scheduling
        const results = await processBatchWithScheduling(agents, userInput);
        
        // Consolidate results with full data preservation
        const finalReport = {
            // Preserve full input data
            projectDescription: userInput.description,
            techStack: userInput.techStack,
            timeline: userInput.timeline,
            budget: userInput.budget,
            requirements: userInput.requirements,
            constraints: userInput.constraints,
            goals: userInput.goals,
            
            // Analysis results
            techFeasibility: results.tech_stack_agent?.response || 'Analysis pending - please retry',
            integrationRisk: results.integration_risk_agent?.response || 'Analysis pending - please retry',
            budgetStressTest: results.budget_agent?.response || 'Analysis pending - please retry',
            preLaunchChecklist: results.checklist_agent?.response || 'Analysis pending - please retry',
            leanAlternative: results.lean_agent?.response || 'Analysis pending - please retry',
            
            // Metadata
            timestamp: new Date().toISOString(),
            processingTimeMs: Date.now() - startTime,
            agentStatus: Object.fromEntries(
                Object.entries(results).map(([agent, result]) => [
                    agent, 
                    result?.error ? 'failed' : 'completed'
                ])
            ),
            hasErrors: Object.values(results).some(r => r?.error),
            successfulAgents: Object.values(results).filter(r => !r?.error).length,
            totalAgents: agents.length
        };

        // TODO: Save the complete report to MongoDB
        // const report = await PocReport.create(finalReport);

        const statusCode = finalReport.hasErrors ? 206 : 200; // 206 for partial content
        
        res.status(statusCode).json({
            success: true,
            data: finalReport,
            message: finalReport.hasErrors ? 
                `Analysis completed with ${finalReport.successfulAgents}/${finalReport.totalAgents} agents successful. Failed agents can be retried.` :
                'Complete analysis generated successfully',
            processingTime: `${((Date.now() - startTime) / 1000).toFixed(1)}s`
        });

    } catch (error) {
        console.error('Critical error in PoC submission:', error);
        
        const isQuotaError = error.message.toLowerCase().includes('quota') || 
                           error.message.toLowerCase().includes('429');
        
        res.status(isQuotaError ? 503 : 500).json({ 
            success: false, 
            error: isQuotaError ? 'Service Temporarily Unavailable' : 'Server Error',
            message: isQuotaError ? 
                'API quota temporarily exhausted. Please try again in 5-10 minutes.' : 
                'An unexpected error occurred during analysis.',
            retryAfter: isQuotaError ? 600 : null, // 10 minutes for quota errors
            processingTime: `${((Date.now() - startTime) / 1000).toFixed(1)}s`
        });
    }
};

// @desc    Retry failed agents for a specific report
// @route   POST /api/v1/poc/retry/:reportId
// @access  Public
exports.retryFailedAgents = async (req, res, next) => {
    try {
        // TODO: Fetch the original report and identify failed agents
        // const report = await PocReport.findById(req.params.reportId);
        // const failedAgents = Object.entries(report.agentStatus)
        //     .filter(([agent, status]) => status === 'failed')
        //     .map(([agent, status]) => agent);
        
        res.status(200).json({
            success: true,
            message: "Retry functionality coming soon"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all reports
// @route   GET /api/v1/poc/reports
// @access  Public
exports.getReports = async (req, res, next) => {
    try {
        // TODO: Implement logic to fetch all reports from MongoDB
        // const reports = await PocReport.find()
        //     .select('-__v')
        //     .sort({ createdAt: -1 })
        //     .limit(50);
        res.status(200).json({ success: true, data: [] });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get a single report
// @route   GET /api/v1/poc/reports/:id
// @access  Public
exports.getReport = async (req, res, next) => {
    try {
        // TODO: Implement logic to fetch a single report by ID from MongoDB
        // const report = await PocReport.findById(req.params.id);
        res.status(200).json({ success: true, data: { id: req.params.id } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Run Tech Stack Feasibility Agent and update PoC report
// @route   POST /api/v1/poc/tech-stack
// @access  Public
exports.runTechStackAgent = async (req, res, next) => {
    try {
        const { projectId, techStack, features, ...rest } = req.body;
        if (!projectId || !techStack || !features) {
            return res.status(400).json({ success: false, message: 'projectId, techStack, and features are required.' });
        }

        // Run the tech_stack_agent
        const agentInput = { techStack, features, ...rest };
        const agentResult = await runAgentWithIntelligentRetry('tech_stack_agent', agentInput);

        // Parse agentResult to extract structured fields
        // (Assume agentResult.response is an object with the required fields)
        const techFeasibility = agentResult.response || {};

        // Update or create the PoC report
        const updatedReport = await PocReport.findOneAndUpdate(
            { _id: projectId },
            {
                $set: {
                    techStack,
                    techFeasibility,
                    // Optionally update other fields if provided
                    ...rest
                }
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: updatedReport,
            message: 'Tech Stack Feasibility analysis complete.'
        });
    } catch (error) {
        console.error('Error in runTechStackAgent:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Run Integration Risk Agent and update PoC report
// @route   POST /api/v1/poc/integration
// @access  Public
exports.runIntegrationRiskAgent = async (req, res, next) => {
    try {
        const { projectId, techStack, description, externalApis, ...rest } = req.body;
        if (!projectId || !techStack || !description) {
            return res.status(400).json({ success: false, message: 'projectId, techStack, and description are required.' });
        }

        // Prepare input for the agent
        const agentInput = { techStack, description, externalApis, ...rest };
        const agentResult = await runAgentWithIntelligentRetry('integration_risk_agent', agentInput);

        // Parse agentResult.response into structured fields (mock parsing for now)
        // In production, ensure the agent returns a JSON object with these fields
        let integrationRisk = {
            apiFailurePoints: '',
            securityAndRateLimits: '',
            riskSeverity: '',
            mitigation: ''
        };
        if (typeof agentResult.response === 'object') {
            integrationRisk = agentResult.response;
        } else if (typeof agentResult.response === 'string') {
            // Simple parsing for demonstration
            integrationRisk.apiFailurePoints = agentResult.response;
        }

        // Update or create the PoC report
        const updatedReport = await PocReport.findOneAndUpdate(
            { _id: projectId },
            {
                $set: {
                    integrationRisk,
                    // Optionally update other fields if provided
                    ...rest
                }
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: updatedReport,
            message: 'Integration Risk analysis complete.'
        });
    } catch (error) {
        console.error('Error in runIntegrationRiskAgent:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Run Budget & Timeline Risk Agent and update PoC report
// @route   POST /api/v1/poc/budget
// @access  Public
exports.runBudgetAgent = async (req, res, next) => {
    try {
        const { projectId, budget, timeline, ...rest } = req.body;
        if (!projectId || !budget || !timeline) {
            return res.status(400).json({ success: false, message: 'projectId, budget, and timeline are required.' });
        }

        // Prepare input for the agent
        const agentInput = { budget, timeline, ...rest };
        const agentResult = await runAgentWithIntelligentRetry('budget_agent', agentInput);

        // Parse agentResult.response into structured fields (mock parsing for now)
        // In production, ensure the agent returns a JSON object with these fields
        let budgetStressTest = {
            estimatedDevelopmentCosts: '',
            timelineDelays: '',
            highRiskCostAreas: []
        };
        if (typeof agentResult.response === 'object') {
            budgetStressTest = agentResult.response;
        } else if (typeof agentResult.response === 'string') {
            budgetStressTest.estimatedDevelopmentCosts = agentResult.response;
        }

        // Update or create the PoC report
        const updatedReport = await PocReport.findOneAndUpdate(
            { _id: projectId },
            {
                $set: {
                    budgetStressTest,
                    ...rest
                }
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: updatedReport,
            message: 'Budget & Timeline Risk analysis complete.'
        });
    } catch (error) {
        console.error('Error in runBudgetAgent:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Run Pre-Launch Checklist Agent and update PoC report
// @route   POST /api/v1/poc/checklist
// @access  Public
exports.runChecklistAgent = async (req, res, next) => {
    try {
        const { projectId, ...rest } = req.body;
        if (!projectId) {
            return res.status(400).json({ success: false, message: 'projectId is required.' });
        }

        // Prepare input for the agent
        const agentInput = { ...rest };
        const agentResult = await runAgentWithIntelligentRetry('checklist_agent', agentInput);

        // Parse agentResult.response into structured fields (mock parsing for now)
        // In production, ensure the agent returns a JSON object with these fields
        let preLaunchChecklist = {
            functionalTests: [],
            securityTasks: [],
            priorityChecklist: []
        };
        if (typeof agentResult.response === 'object') {
            preLaunchChecklist = agentResult.response;
        } else if (typeof agentResult.response === 'string') {
            preLaunchChecklist.priorityChecklist = [agentResult.response];
        }

        // Update or create the PoC report
        const updatedReport = await PocReport.findOneAndUpdate(
            { _id: projectId },
            {
                $set: {
                    preLaunchChecklist,
                    ...rest
                }
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: updatedReport,
            message: 'Pre-Launch Checklist analysis complete.'
        });
    } catch (error) {
        console.error('Error in runChecklistAgent:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Run Lean Recommendation Agent and update PoC report
// @route   POST /api/v1/poc/lean-options
// @access  Public
exports.runLeanAgent = async (req, res, next) => {
    try {
        const { projectId, ...rest } = req.body;
        if (!projectId) {
            return res.status(400).json({ success: false, message: 'projectId is required.' });
        }

        // Prepare input for the agent
        const agentInput = { ...rest };
        const agentResult = await runAgentWithIntelligentRetry('lean_agent', agentInput);

        // Parse agentResult.response into structured fields (mock parsing for now)
        // In production, ensure the agent returns a JSON object with these fields
        let leanAlternative = {
            simplifiedStackAlternatives: [],
            estimatedCostTimeSavings: '',
            prosCons: []
        };
        if (typeof agentResult.response === 'object') {
            leanAlternative = agentResult.response;
        } else if (typeof agentResult.response === 'string') {
            leanAlternative.simplifiedStackAlternatives = [agentResult.response];
        }

        // Update or create the PoC report
        const updatedReport = await PocReport.findOneAndUpdate(
            { _id: projectId },
            {
                $set: {
                    leanAlternative,
                    ...rest
                }
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: updatedReport,
            message: 'Lean Recommendation analysis complete.'
        });
    } catch (error) {
        console.error('Error in runLeanAgent:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};