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

def generate_checklist(query: str) -> str:
    """
    Generates a pre-launch checklist for a project.
    This is a placeholder and returns a mock checklist.
    """
    return """
    Pre-launch Checklist:
    1.  [ ] Finalize production environment configuration.
    2.  [ ] Complete user acceptance testing (UAT).
    3.  [ ] Set up monitoring and alerting (e.g., Sentry, Grafana).
    4.  [ ] Perform security audit and penetration testing.
    5.  [ ] Ensure database backups are in place and tested.
    6.  [ ] Prepare rollback plan.
    """

tools = [
    Tool(
        name="PreLaunchChecklistTool",
        func=generate_checklist,
        description="Generates a pre-launch checklist for a software project."
    )
]

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
    Main execution function for the checklist agent.
    """
    if len(sys.argv) > 1:
        user_input_json = sys.argv[1]
        user_input = json.loads(user_input_json)
        
        prompt = (
            f"Generate a pre-launch checklist for the following project: {user_input.get('description', 'Not specified')}. "
            f"Return ONLY a valid JSON object with keys: functionalTests (array), securityTasks (array), priorityChecklist (array). No markdown, no code block, no explanation."
        )
        prompt = limit_text(prompt, 600)
        response = agent.run(prompt)
        result = extract_json_from_response(response)
        if not result:
            result = {
                "functionalTests": ["User acceptance testing (UAT)", "End-to-end tests"],
                "securityTasks": ["Security audit", "Penetration testing"],
                "priorityChecklist": [response]
            }
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "No input provided"}))

if __name__ == "__main__":
    main() 