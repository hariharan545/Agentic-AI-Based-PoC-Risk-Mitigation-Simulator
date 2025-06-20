# This script implements an autonomous AI agent using LangGraph's state machine framework.
# The agent is implemented as a LangGraph graph with a single node for lean MVP suggestions using a QA chain.
import os
import sys
import json
import time
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
# from langchain.vectorstores import Chroma

# Load environment variables
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    sys.exit("GEMINI_API_KEY not found in .env file")

# Try to import GeminiEmbeddings, fallback to OpenAIEmbeddings if not available
try:
    from langchain_community.embeddings import GeminiEmbeddings
    embedding = GeminiEmbeddings(api_key=gemini_api_key)
except ImportError:
    from langchain_community.embeddings import OpenAIEmbeddings
    embedding = OpenAIEmbeddings()

# Setup Vector Store and Retriever
# Note: This assumes the vector store has been created and populated by doc_ingestor.py
vectorstore_path = "../data/vector_store"
vectorstore = Chroma(persist_directory=vectorstore_path, embedding_function=embedding)
retriever = vectorstore.as_retriever()

# Setup QA Chain
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=gemini_api_key),
    chain_type="stuff",
    retriever=retriever
)

def lean_mvp_suggestion(state):
    user_input = state["user_input"]
    prompt = (
        f"Based on the following project description, suggest lean alternatives for the MVP. "
        f"Current Tech Stack: {user_input.get('techStack', 'Not specified')}. "
        f"Project Goals: {user_input.get('description', 'Not specified')}. "
        f"My main concern is: {user_input.get('concerns', 'Not specified')}."
    )
    response = qa_chain.run(prompt)
    return {"result": response}

# Define the LangGraph state and graph
class LeanAgentState(dict):
    pass

graph = StateGraph(LeanAgentState)
graph.add_node("lean_mvp", lean_mvp_suggestion)
graph.set_entry_point("lean_mvp")
graph.add_edge("lean_mvp", END)
graph.set_finish_point("lean_mvp")
lean_graph = graph.compile()

def main():
    """
    Main execution function for the lean agent using LangGraph.
    """
    if len(sys.argv) > 1:
        user_input_json = sys.argv[1]
        user_input = json.loads(user_input_json)
        state = {"user_input": user_input}
        result = lean_graph.invoke(state)
        print(json.dumps({"response": result["result"]}))
    else:
        print(json.dumps({"error": "No input provided"}))

if __name__ == "__main__":
    main() 