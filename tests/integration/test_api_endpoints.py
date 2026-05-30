# In Python REPL or test file
from src.services.web_intelligence import bright_data_scraper

# Test connection
is_valid = bright_data_scraper.validate_api_key()
print(f"Bright Data API valid: {is_valid}")

# Test search
results = bright_data_scraper.search_regulatory_updates(
    industry="healthcare",
    keywords=["HIPAA", "data privacy"]
)
print(f"Got {len(results)} results")