import os
import sys
import json
from dotenv import load_dotenv
from langchain.agents import initialize_agent, Tool
from langchain.chat_models import ChatOpenAI

# Load environment variables
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    sys.exit("OPENAI_API_KEY not found in .env file")

def stress_test_budget(query: str) -> str:
    """
    Stress-tests a budget against a timeline and project scope.
    This is a placeholder and returns a mock analysis.
    """
    # In a real implementation, this tool could use more structured input
    # (budget, timeline, team size) to perform calculations.
    return "Budget stress test indicates a potential 20% cost overrun if the project timeline is extended by one month. Recommend re-evaluating the scope of the MVP features."

tools = [
    Tool(
        name="BudgetStressTestTool",
        func=stress_test_budget,
        description="Stress-tests a budget against a project timeline and scope."
    )
]

agent = initialize_agent(
    tools=tools,
    llm=ChatOpenAI(openai_api_key=openai_api_key, temperature=0, model_name="gpt-3.5-turbo"),
    agent="zero-shot-react-description",
    verbose=True
)

def main():
    """
    Main execution function for the budget agent.
    """
    if len(sys.argv) > 1:
        user_input_json = sys.argv[1]
        user_input = json.loads(user_input_json)
        
        prompt = (
            f"Stress-test a budget of {user_input.get('budget', 'Not specified')} "
            f"for a project with timeline: {user_input.get('timeline', 'Not specified')} "
            f"and description: {user_input.get('description', 'Not specified')}."
        )
        
        response = agent.run(prompt)
        print(json.dumps({"response": response}))
    else:
        print(json.dumps({"error": "No input provided"}))

if __name__ == "__main__":
    main() 