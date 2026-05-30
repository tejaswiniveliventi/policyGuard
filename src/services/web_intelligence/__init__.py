"""Web Intelligence Services - Bright Data integration."""

from src.services.web_intelligence.bright_data import BrightDataScraper

# Initialize Bright Data scraper
bright_data_scraper = BrightDataScraper()

__all__ = ['BrightDataScraper', 'bright_data_scraper']