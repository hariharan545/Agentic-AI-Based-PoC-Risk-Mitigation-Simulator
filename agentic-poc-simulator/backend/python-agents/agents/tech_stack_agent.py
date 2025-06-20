# This script implements an autonomous AI agent using LangGraph's state machine framework.
# The agent is implemented as a LangGraph graph with a single node for tech stack analysis.
import os
import sys
import json
import time
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI

# Load environment variables
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    sys.exit("GEMINI_API_KEY not found in .env file")

# Tool for tech stack feasibility analysis
def analyze_tech_stack(state):
    user_input = state["user_input"]
    # You can expand this logic as needed
    return {
        "result": (
            "Based on a preliminary analysis, the selected tech stack appears to be viable for the project goals. "
            "However, consider potential scalability issues with the database choice."
        )
    }

# Define the LangGraph state and graph
class TechStackState(dict):
    pass

graph = StateGraph(TechStackState)
graph.add_node("analyze", analyze_tech_stack)
graph.set_entry_point("analyze")
graph.add_edge("analyze", END)
graph.set_finish_point("analyze")
tech_stack_graph = graph.compile()

def main():
    """
    Main execution function for the tech stack agent using LangGraph.
    """
    if len(sys.argv) > 1:
        user_input_json = sys.argv[1]
        user_input = json.loads(user_input_json)
        state = {"user_input": user_input}
        result = tech_stack_graph.invoke(state)
        print(json.dumps({"response": result["result"]}))
    else:
        print(json.dumps({"error": "No input provided"}))

if __name__ == "__main__":
    main() 