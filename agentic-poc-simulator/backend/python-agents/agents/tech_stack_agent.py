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

# Placeholder for a tool that analyzes tech stack feasibility.
# In a real implementation, this could call an API, a database, or another model.
def analyze_tech_stack(query: str) -> str:
    """
    Analyzes the feasibility of a given tech stack based on the project description.
    This is a placeholder and returns a mock analysis.
    """
    return "Based on a preliminary analysis, the selected tech stack appears to be viable for the project goals. However, consider potential scalability issues with the database choice."

tools = [
    Tool(
        name="TechStackFeasibilityTool",
        func=analyze_tech_stack,
        description="Analyzes the feasibility of a proposed tech stack for a new project."
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
    Main execution function for the tech stack agent.
    """
    if len(sys.argv) > 1:
        user_input_json = sys.argv[1]
        user_input = json.loads(user_input_json)
        
        prompt = (
            f"Analyze the feasibility of the following tech stack: {user_input.get('techStack', 'Not specified')} "
            f"for a project described as: {user_input.get('description', 'Not specified')}."
        )
        
        response = agent.run(prompt)
        print(json.dumps({"response": response}))
    else:
        print(json.dumps({"error": "No input provided"}))

if __name__ == "__main__":
    main() 