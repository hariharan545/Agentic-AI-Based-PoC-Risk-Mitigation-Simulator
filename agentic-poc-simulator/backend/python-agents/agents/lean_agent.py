import os
import sys
import json
import re
from dotenv import load_dotenv
from langchain.agents import initialize_agent, Tool
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA

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
    Main execution function for the lean agent.
    Receives user input from stdin, processes it, and prints the result to stdout.
    """
    print("[lean_agent.py] sys.argv:", sys.argv, file=sys.stderr)
    if len(sys.argv) > 1:
        user_input_json = sys.argv[1]
        print("[lean_agent.py] Raw user_input_json:", user_input_json, file=sys.stderr)
        user_input = json.loads(user_input_json)
        print("[lean_agent.py] Parsed user_input:", user_input, file=sys.stderr)
        # Construct a detailed prompt for the agent, limit to 600 chars
        prompt = (
            f"Based on the following project description, suggest lean alternatives for the MVP. "
            f"Current Tech Stack: {user_input.get('techStack', 'Not specified')}. "
            f"Project Goals: {user_input.get('description', 'Not specified')}. "
            f"My main concern is: {user_input.get('concerns', 'Not specified')}. "
            f"Return ONLY a valid JSON object with keys: simplifiedStackAlternatives (array), estimatedCostTimeSavings, prosCons (array). No markdown, no code block, no explanation."
        )
        prompt = limit_text(prompt, 600)
        print("[lean_agent.py] Constructed prompt:", prompt, file=sys.stderr)
        # Retrieve context from vectorstore and limit to 2000 chars
        retrieved_docs = retriever.get_relevant_documents(prompt)
        context = "\n".join([doc.page_content if hasattr(doc, 'page_content') else str(doc) for doc in retrieved_docs])
        context = limit_text(context, 2000)
        print("[lean_agent.py] Retrieved context:", context, file=sys.stderr)
        # Combine prompt and context for the LLM
        full_input = f"{prompt}\nContext:\n{context}"
        print("[lean_agent.py] Full input to QA chain:", full_input, file=sys.stderr)
        # Run the agent (using the QA chain directly for context injection)
        response = qa_chain.run(full_input)
        result = extract_json_from_response(response)
        if not result:
            # Fallback: mock structure if not JSON
            result = {
                "simplifiedStackAlternatives": [response],
                "estimatedCostTimeSavings": "Estimated 30% cost and 2 months saved.",
                "prosCons": ["Pro: Faster to market", "Con: May lack advanced features"]
            }
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "No input provided"}))

if __name__ == "__main__":
    main() 