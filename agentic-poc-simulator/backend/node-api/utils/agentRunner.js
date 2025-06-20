const { spawn } = require('child_process');
const path = require('path');

const runAgent = (agentName, userInput) => {
    return new Promise((resolve, reject) => {
        const agentPath = path.join(__dirname, '..', '..', 'python-agents', 'agents', `${agentName}.py`);
        const pythonProcess = spawn('python', [agentPath, JSON.stringify(userInput)]);

        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`stderr from ${agentName}: ${error}`);
                return reject(new Error(`Agent ${agentName} exited with code ${code}. Error: ${error}`));
            }
            try {
                const jsonResult = JSON.parse(result);
                resolve(jsonResult);
            } catch (e) {
                console.error(`Failed to parse JSON from ${agentName}: ${result}`);
                reject(new Error(`Could not parse response from agent ${agentName}.`));
            }
        });
    });
};

module.exports = runAgent; 