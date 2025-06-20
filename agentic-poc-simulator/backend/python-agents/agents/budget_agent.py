# This script implements an autonomous AI agent using LangGraph's state machine framework.
# The agent is implemented as a LangGraph graph with a single node for budget stress testing.
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

def stress_test_budget(state):
    user_input = state["user_input"]
    # In a real implementation, this tool could use more structured input
    # (budget, timeline, team size) to perform calculations.
    return {
        "result": (
            "Budget stress test indicates a potential 20% cost overrun if the project timeline is extended by one month. "
            "Recommend re-evaluating the scope of the MVP features."
        )
    }

# Define the LangGraph state and graph
class BudgetState(dict):
    pass

graph = StateGraph(BudgetState)
graph.add_node("stress_test", stress_test_budget)
graph.set_entry_point("stress_test")
graph.add_edge("stress_test", END)
graph.set_finish_point("stress_test")
budget_graph = graph.compile()

def main():
    """
    Main execution function for the budget agent using LangGraph.
    """
    if len(sys.argv) > 1:
        user_input_json = sys.argv[1]
        user_input = json.loads(user_input_json)
        state = {"user_input": user_input}
        result = budget_graph.invoke(state)
        print(json.dumps({"response": result["result"]}))
    else:
        print(json.dumps({"error": "No input provided"}))

if __name__ == "__main__":
    main() 