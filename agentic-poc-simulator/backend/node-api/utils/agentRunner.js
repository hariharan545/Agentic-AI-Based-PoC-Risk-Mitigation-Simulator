const { spawn } = require('child_process');
const path = require('path');
const sys = require('sys');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isRateLimitError(errorMessage) {
    const rateLimitKeywords = [
        '429',
        'rate limit',
        'quota',
        'exhausted',
        'ResourceExhausted',
        'Exceeded retry attempts due to rate limiting'
    ];
    return rateLimitKeywords.some(keyword => errorMessage.toLowerCase().includes(keyword.toLowerCase()));
}

function getFallbackResponse(agentName, errorMessage) {
    return {
        error: 'rate_limit_exceeded',
        message: `API rate limit exceeded for ${agentName}. Please try again later.`,
        fallback_data: {
            agent: agentName,
            reason: errorMessage,
            confidence: 0.0
        }
    };
}

const runAgent = async (agentName, userInput) => {
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds
    const maxDelay = 30000; // 30 seconds
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        let result = '';
        let error = '';
        try {
            const agentPath = path.join(__dirname, '..', '..', 'python-agents', 'agents', `${agentName}.py`);
            const pythonPath = 'C:/Learn Stack/Agentic-AI-Based-PoC-Risk-Mitigation-Simulator/agentic-poc-simulator/backend/python-agents/venv/Scripts/python.exe';
            const pythonProcess = spawn(pythonPath, [agentPath, JSON.stringify(userInput)]);

            pythonProcess.stdout.on('data', (data) => {
                result += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                error += data.toString();
            });

            const exitCode = await new Promise((resolve) => {
                pythonProcess.on('close', resolve);
            });

            if (exitCode !== 0) {
                if (isRateLimitError(error)) {
                    throw new Error(error);
                }
                console.error(`stderr from ${agentName}: ${error}`);
                throw new Error(`Agent ${agentName} exited with code ${exitCode}. Error: ${error}`);
            }
            try {
                // Extract the last line that looks like JSON
                const lines = result.trim().split('\n');
                const lastLine = lines.reverse().find(line => line.trim().startsWith('{') && line.trim().endsWith('}'));
                if (!lastLine) throw new Error(`Could not find JSON in agent output: ${result}`);
                const jsonResult = JSON.parse(lastLine);
                return jsonResult;
            } catch (e) {
                if (isRateLimitError(result)) {
                    throw new Error(result);
                }
                console.error(`Failed to parse JSON from ${agentName}: ${result}`);
                throw new Error(`Could not parse response from agent ${agentName}.`);
            }
        } catch (err) {
            if (isRateLimitError(err.message)) {
                if (attempt < maxRetries - 1) {
                    // Exponential backoff with jitter
                    const delay = Math.min(baseDelay * (2 ** attempt), maxDelay);
                    const jitter = Math.random() * 0.5 * delay;
                    const totalDelay = delay + jitter;
                    console.warn(`Rate limit hit for ${agentName} (attempt ${attempt + 1}). Retrying in ${(totalDelay / 1000).toFixed(2)} seconds...`);
                    await sleep(totalDelay);
                    continue;
                } else {
                    console.error(`Max retries exceeded for ${agentName} due to rate limits.`);
                    return getFallbackResponse(agentName, err.message);
                }
            } else {
                throw err;
            }
        }
    }
    // Should not reach here, but fallback just in case
    return getFallbackResponse(agentName, 'Unknown error after retries');
};

// New: Run the orchestrator script for full pipeline
const runOrchestrator = async (userInput) => {
    const orchestratorPath = path.join(__dirname, '..', '..', 'python-agents', 'main_orchestrator.py');
    const pythonPath = 'C:/Learn Stack/Agentic-AI-Based-PoC-Risk-Mitigation-Simulator/agentic-poc-simulator/backend/python-agents/venv/Scripts/python.exe';
    return new Promise((resolve, reject) => {
        let result = '';
        let error = '';
        const pythonProcess = spawn(pythonPath, [orchestratorPath, JSON.stringify(userInput)]);
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });
        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });
        pythonProcess.on('close', (exitCode) => {
            if (exitCode !== 0) {
                console.error(`stderr from orchestrator: ${error}`);
                reject(new Error(`Orchestrator exited with code ${exitCode}. Error: ${error}`));
            } else {
                try {
                    // Extract the last line that looks like JSON
                    const lines = result.trim().split('\n');
                    const lastLine = lines.reverse().find(line => line.trim().startsWith('{') && line.trim().endsWith('}'));
                    if (!lastLine) throw new Error(`Could not find JSON in orchestrator output: ${result}`);
                    const jsonResult = JSON.parse(lastLine);
                    resolve(jsonResult);
                } catch (e) {
                    console.error(`Failed to parse JSON from orchestrator: ${result}`);
                    reject(new Error(`Could not parse response from orchestrator.`));
                }
            }
        });
    });
};

module.exports = { runAgent, runOrchestrator }; 