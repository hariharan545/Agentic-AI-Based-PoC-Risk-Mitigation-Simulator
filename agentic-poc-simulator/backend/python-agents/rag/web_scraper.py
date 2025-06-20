import os
import sys
import argparse
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

# Define the path to save raw scraped data
SAVE_DIR = "../data/raw"

def is_valid_url(url):
    """Checks if the url is valid."""
    parsed = urlparse(url)
    return bool(parsed.netloc) and bool(parsed.scheme)

def save_content(url, content):
    """Saves the content to a file in the specified directory."""
    if not os.path.exists(SAVE_DIR):
        os.makedirs(SAVE_DIR)

    # Create a filename from the URL
    filename = url.replace("https://", "").replace("http://", "").replace("/", "_") + ".txt"
    filepath = os.path.join(SAVE_DIR, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Saved content from {url} to {filepath}")

def scrape_url(url):
    """Scrapes a single URL and saves its text content."""
    if not is_valid_url(url):
        print(f"Invalid URL: {url}")
        return

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # Raise an exception for bad status codes
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract text from the body
        body_content = soup.body.get_text(separator='\n', strip=True)
        save_content(url, body_content)

    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
    except Exception as e:
        print(f"An error occurred while processing {url}: {e}")

def main():
    """
    Main function to run the web scraper.
    Accepts one or more URLs as command-line arguments.
    """
    parser = argparse.ArgumentParser(description="Scrape text content from web pages.")
    parser.add_argument("urls", nargs='+', help="The URL(s) to scrape.")
    
    args = parser.parse_args()
    
    for url in args.urls:
        scrape_url(url)

if __name__ == "__main__":
    main() 