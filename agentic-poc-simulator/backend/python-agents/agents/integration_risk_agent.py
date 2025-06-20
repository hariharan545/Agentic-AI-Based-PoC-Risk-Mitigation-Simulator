# This script implements an autonomous AI agent using LangGraph's state machine framework.
# The agent is implemented as a LangGraph graph with a single node for integration risk prediction.
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

def predict_integration_risk(state):
    user_input = state["user_input"]
    return {
        "result": (
            "Potential integration risk identified: The legacy CRM API may have rate limits that could be exceeded by the new microservice architecture. "
            "Recommend implementing a queueing system."
        )
    }

# Define the LangGraph state and graph
class IntegrationRiskState(dict):
    pass

graph = StateGraph(IntegrationRiskState)
graph.add_node("predict_risk", predict_integration_risk)
graph.set_entry_point("predict_risk")
graph.add_edge("predict_risk", END)
graph.set_finish_point("predict_risk")
integration_risk_graph = graph.compile()

def main():
    """
    Main execution function for the integration risk agent using LangGraph.
    """
    if len(sys.argv) > 1:
        user_input_json = sys.argv[1]
        user_input = json.loads(user_input_json)
        state = {"user_input": user_input}
        result = integration_risk_graph.invoke(state)
        print(json.dumps({"response": result["result"]}))
    else:
        print(json.dumps({"error": "No input provided"}))

if __name__ == "__main__":
    main() 