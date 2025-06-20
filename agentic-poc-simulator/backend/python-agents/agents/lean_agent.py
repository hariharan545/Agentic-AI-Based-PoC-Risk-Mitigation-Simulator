import os
import sys
import json
from dotenv import load_dotenv
from langchain.agents import initialize_agent, Tool
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.retrievers import ChromaRetriever
from langchain.chains import RetrievalQA
from langchain.vectorstores import Chroma

# Load environment variables
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    sys.exit("GEMINI_API_KEY not found in .env file")

# Setup Vector Store and Retriever
vectorstore_path = "../data/vector_store"
embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=gemini_api_key)
vectorstore = Chroma(persist_directory=vectorstore_path, embedding_function=embedding)
retriever = vectorstore.as_retriever()

# Setup QA Chain
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatGoogleGenerativeAI(model="models/gemini-1.5-flash", google_api_key=gemini_api_key, temperature=0),
    chain_type="stuff",
    retriever=retriever
)

# Define Tools
tools = [
    Tool(
        name="LeanMVPSuggestion",
        func=qa_chain.run,
        description="Used to find lean alternatives and MVP strategies from case studies. Input should be a detailed query about the user's tech stack or product idea."
    )
]

# Initialize Agent
agent = initialize_agent(
    tools=tools,
    llm=ChatGoogleGenerativeAI(model="models/gemini-1.5-flash", google_api_key=gemini_api_key, temperature=0.2),
    agent="chat-conversational-react-description",
    verbose=True
)

def main():
    """
    Main execution function for the lean agent.
    Receives user input from stdin, processes it, and prints the result to stdout.
    """
    if len(sys.argv) > 1:
        user_input_json = sys.argv[1]
        user_input = json.loads(user_input_json)
        
        # Construct a detailed prompt for the agent
        prompt = (
            f"Based on the following project description, suggest lean alternatives for the MVP. "
            f"Current Tech Stack: {user_input.get('techStack', 'Not specified')}. "
            f"Project Goals: {user_input.get('description', 'Not specified')}. "
            f"My main concern is: {user_input.get('concerns', 'Not specified')}."
        )

        # Run the agent
        response = agent.run(prompt)
        
        # Print the result as a JSON string to stdout
        print(json.dumps({"response": response}))
    else:
        print(json.dumps({"error": "No input provided"}))

if __name__ == "__main__":
    main() 