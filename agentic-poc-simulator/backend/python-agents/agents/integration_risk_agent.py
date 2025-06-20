import os
import sys
import json
from dotenv import load_dotenv
from langchain.agents import initialize_agent, Tool
from langchain_google_genai import ChatGoogleGenerativeAI

# Load environment variables
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    sys.exit("GEMINI_API_KEY not found in .env file")

def predict_integration_risk(query: str) -> str:
    """
    Predicts potential integration risks between different components of a tech stack.
    This is a placeholder and returns a mock analysis.
    """
    return "Potential integration risk identified: The legacy CRM API may have rate limits that could be exceeded by the new microservice architecture. Recommend implementing a queueing system."

tools = [
    Tool(
        name="IntegrationRiskPredictionTool",
        func=predict_integration_risk,
        description="Predicts integration risks for a given tech stack and project description."
    )
]

agent = initialize_agent(
    tools=tools,
    llm=ChatGoogleGenerativeAI(model="models/gemini-1.5-flash", google_api_key=gemini_api_key, temperature=0),
    agent="zero-shot-react-description",
    verbose=True
)

def main():
    """
    Main execution function for the integration risk agent.
    """
    if len(sys.argv) > 1:
        user_input_json = sys.argv[1]
        user_input = json.loads(user_input_json)
        
        prompt = (
            f"Analyze the integration risks for a project with this tech stack: {user_input.get('techStack', 'Not specified')} "
            f"and description: {user_input.get('description', 'Not specified')}."
        )
        
        response = agent.run(prompt)
        print(json.dumps({"response": response}))
    else:
        print(json.dumps({"error": "No input provided"}))

if __name__ == "__main__":
    main() 