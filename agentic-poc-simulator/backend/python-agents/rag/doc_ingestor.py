import os
import sys
from dotenv import load_dotenv
from langchain.document_loaders import DirectoryLoader, UnstructuredFileLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import GeminiEmbeddings
from langchain.vectorstores import Chroma

# Load environment variables
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    sys.exit("GEMINI_API_KEY not found in .env file")

# Define paths
RAW_DATA_PATH = "../data/raw"
VECTOR_STORE_PATH = "../data/vector_store"
PROCESSED_DATA_PATH = "../data/processed"

def ingest_documents():
    """
    Ingests documents from the raw data directory, processes them,
    and stores them in a Chroma vector store.
    """
    print("Starting document ingestion process...")

    # Ensure processed data directory exists
    if not os.path.exists(PROCESSED_DATA_PATH):
        os.makedirs(PROCESSED_DATA_PATH)

    # Load documents from the raw data directory
    # This loader will handle various file types like .txt, .pdf, .md
    loader = DirectoryLoader(RAW_DATA_PATH, glob="**/*.*", loader_cls=lambda p: UnstructuredFileLoader(p), show_progress=True)
    documents = loader.load()

    if not documents:
        print("No documents found in the raw data directory. Exiting.")
        return

    print(f"Loaded {len(documents)} documents.")

    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)
    print(f"Split documents into {len(chunks)} chunks.")

    # Save processed chunks for inspection (optional)
    for i, chunk in enumerate(chunks):
        with open(os.path.join(PROCESSED_DATA_PATH, f"chunk_{i}.txt"), "w", encoding="utf-8") as f:
            f.write(chunk.page_content)

    print("Creating embeddings and storing in ChromaDB...")
    # Create embeddings
    embeddings = GeminiEmbeddings(api_key=gemini_api_key)

    # Create and persist the vector store
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=VECTOR_STORE_PATH
    )

    # Persist the vector store
    vectorstore.persist()
    print(f"Successfully created and persisted vector store at {VECTOR_STORE_PATH}")

if __name__ == "__main__":
    ingest_documents() 