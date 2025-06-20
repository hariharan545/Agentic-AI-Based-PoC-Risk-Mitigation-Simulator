# This script implements an autonomous AI agent using LangGraph's state machine framework.
# The agent is implemented as a LangGraph graph with a single node for generating a pre-launch checklist.
import os
import sys
import json
import time
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END

# Load environment variables
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    sys.exit("GEMINI_API_KEY not found in .env file")

def generate_checklist(state):
    user_input = state["user_input"]
    return {
        "result": """
    Pre-launch Checklist:
    1.  [ ] Finalize production environment configuration.
    2.  [ ] Complete user acceptance testing (UAT).
    3.  [ ] Set up monitoring and alerting (e.g., Sentry, Grafana).
    4.  [ ] Perform security audit and penetration testing.
    5.  [ ] Ensure database backups are in place and tested.
    6.  [ ] Prepare rollback plan.
    """
    }

# Define the LangGraph state and graph
class ChecklistState(dict):
    pass

graph = StateGraph(ChecklistState)
graph.add_node("generate_checklist", generate_checklist)
graph.set_entry_point("generate_checklist")
graph.add_edge("generate_checklist", END)
graph.set_finish_point("generate_checklist")
checklist_graph = graph.compile()

def main():
    """
    Main execution function for the checklist agent using LangGraph.
    """
    if len(sys.argv) > 1:
        user_input_json = sys.argv[1]
        user_input = json.loads(user_input_json)
        state = {"user_input": user_input}
        result = checklist_graph.invoke(state)
        print(json.dumps({"response": result["result"]}))
    else:
        print(json.dumps({"error": "No input provided"}))

if __name__ == "__main__":
    main() 