import os
import sys
import json
import re
from dotenv import load_dotenv
from langchain.agents import initialize_agent, Tool
from langchain_google_genai import ChatGoogleGenerativeAI

# Load environment variables
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    sys.exit("GEMINI_API_KEY not found in .env file")

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

print("gemini_api_key",gemini_api_key)
agent = initialize_agent(
    tools=tools,
    llm=ChatGoogleGenerativeAI(model="models/gemini-1.5-flash", google_api_key=gemini_api_key, temperature=0),
    agent="zero-shot-react-description",
    verbose=True
)

def limit_text(text, max_length):
    return text[:max_length] if isinstance(text, str) and len(text) > max_length else text

def extract_json_from_response(response):
    cleaned = re.sub(r"^```json|^```|```$", "", response.strip(), flags=re.MULTILINE).strip()
    try:
        return json.loads(cleaned)
    except Exception:
        return None

def main():
    """
    Main execution function for the budget agent.
    """
    if len(sys.argv) > 1:
        user_input_json = sys.argv[1]
        user_input = json.loads(user_input_json)
        
        # Sanitize input
        sanitized_user_input = {
            **user_input,
            "description": user_input.get('description', '')[:500],
            "timeline": user_input.get('timeline', '')[:500],
            "budget": user_input.get('budget', 'Not specified')[:100]
        }
        prompt = (
            f"Stress-test a budget of {sanitized_user_input['budget']} "
            f"for a project with timeline: {sanitized_user_input['timeline']} "
            f"and description: {sanitized_user_input['description']}. "
            f"Return ONLY a valid JSON object with keys: estimatedDevelopmentCosts, timelineDelays, highRiskCostAreas (array). No markdown, no code block, no explanation."
        )
        prompt = limit_text(prompt, 600)
        response = agent.run(prompt)
        result = extract_json_from_response(response)
        if not result:
            result = {
                "estimatedDevelopmentCosts": response,
                "timelineDelays": "Potential 20% cost overrun if timeline slips by 1 month.",
                "highRiskCostAreas": ["MVP features", "API integrations"]
            }
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "No input provided"}))

if __name__ == "__main__":
    main() 