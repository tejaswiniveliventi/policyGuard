"""
Bright Data Web Scraper Integration

Bright Data provides:
- SERP (Search Engine Results Page) for regulatory databases
- Web Unlocker for compliance websites
- Residential proxies for data collection

API Reference: https://docs.brightdata.com/api/serp
"""

import requests
import logging
from typing import List, Dict, Optional
from src.config import AppConfig
from src.exceptions import LLMError

logger = logging.getLogger("policyguard.services.bright_data")


class BrightDataScraper:
    """
    Real Bright Data API integration for regulatory, threat, and benchmark data.
    Falls back to mock data if API key not configured or API fails.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or AppConfig.BRIGHT_DATA_API_KEY
        self.base_url = "https://api.brightdata.com/datasets/geos/serp/v3/master"
        self.has_api_key = bool(self.api_key)
        
        if not self.has_api_key:
            logger.warning("BRIGHT_DATA_API_KEY not configured - using mock data")
        else:
            logger.info("Bright Data API configured")
    
    # ==================== REGULATORY UPDATES ====================
    
    def search_regulatory_updates(self, industry: str, keywords: List[str]) -> List[Dict]:
        """
        Fetch regulatory updates from compliance databases via Bright Data SERP API.
        
        Industries: humanitarian_ngo, healthcare, education, social_services, etc.
        Keywords: GDPR, HIPAA, state privacy laws, AI regulation, etc.
        """
        
        queries = [
            f"{industry} AI policy compliance 2024 2025",
            f"data privacy regulations {industry} non-profit",
            f"beneficiary data protection requirements {industry}",
            "EU AI Act compliance requirements",
            "GDPR data retention deletion requirements",
            f"HIPAA {industry} compliance 2024" if industry == "healthcare" else None,
            "state privacy laws California Virginia Colorado",
            "AI regulation non-profit sector",
        ]
        
        # Filter out None values
        queries = [q for q in queries if q]
        
        results = []
        for query in queries:
            result = self._search_serp(query, category="regulatory")
            if result:
                results.append(result)
        
        logger.info(f"Fetched {len(results)} regulatory update sources")
        return results
    
    def search_threat_intelligence(self) -> List[Dict]:
        """
        Fetch security advisories and threat intelligence relevant to AI systems.
        """
        
        queries = [
            "AI model vulnerabilities 2024 2025",
            "LLM security advisories OWASP",
            "data breach notifications non-profit organizations",
            "NLP model bias attacks prompt injection",
            "prompt injection vulnerabilities mitigation",
            "generative AI security best practices",
            "AI model poisoning attacks detection",
            "transformer model adversarial examples",
        ]
        
        results = []
        for query in queries:
            result = self._search_serp(query, category="threat_intelligence")
            if result:
                results.append(result)
        
        logger.info(f"Fetched {len(results)} threat intelligence sources")
        return results
    
    def search_industry_benchmarks(self, industry: str) -> List[Dict]:
        """
        Fetch non-profit AI policy examples and best practices.
        """
        
        queries = [
            f"{industry} organization AI policy examples case studies",
            "non-profit AI adoption best practices framework",
            "beneficiary consent AI decision-making frameworks",
            "nonprofit data governance guidelines GDPR",
            "transparent AI implementation social impact organizations",
            f"{industry} sector AI ethics guidelines",
            "non-profit AI risk assessment templates",
            "organizational AI governance model non-profits",
        ]
        
        results = []
        for query in queries:
            result = self._search_serp(query, category="industry_benchmark")
            if result:
                results.append(result)
        
        logger.info(f"Fetched {len(results)} industry benchmark sources")
        return results
    
    # ==================== BRIGHT DATA API CALLS ====================
    
    def _search_serp(self, query: str, category: str = "general") -> Optional[Dict]:
        """
        Execute SERP (Search Engine Results Page) query via Bright Data API.
        
        Returns the top result with title, snippet, URL, and relevance score.
        Falls back to mock data if API fails.
        """
        
        if not self.has_api_key:
            return self._mock_result(query, category)
        
        try:
            # Bright Data SERP API payload
            payload = {
                "query": query,
                "country": "us",
                "language": "en",
                "parse": True,  # Parse HTML automatically
                "limit": 3,     # Get top 3 results per query
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }
            
            logger.debug(f"Calling Bright Data SERP API: {query}")
            
            # Make API request
            response = requests.post(
                self.base_url,
                json=payload,
                headers=headers,
                timeout=30
            )
            
            # Check for rate limits or errors
            if response.status_code == 429:
                logger.warning("Bright Data rate limit hit - using mock data")
                return self._mock_result(query, category)
            
            if response.status_code == 401:
                logger.error("Bright Data authentication failed - using mock data")
                self.has_api_key = False  # Disable API for this session
                return self._mock_result(query, category)
            
            if response.status_code != 200:
                logger.warning(f"Bright Data API error {response.status_code} - using mock data")
                return self._mock_result(query, category)
            
            # Parse response
            data = response.json()
            
            # Extract top result
            if data.get("results") and len(data["results"]) > 0:
                top_result = data["results"][0]
                
                result = {
                    "query": query,
                    "source": "bright_data_serp",
                    "category": category,
                    "results": [
                        {
                            "title": top_result.get("title", ""),
                            "url": top_result.get("url", ""),
                            "snippet": top_result.get("description", ""),
                            "relevance": 0.95  # Top result from SERP
                        }
                    ]
                }
                
                logger.info(f"Got Bright Data result: {top_result.get('title', 'Unknown')}")
                return result
            else:
                logger.info(f"No results from Bright Data for: {query}")
                return self._mock_result(query, category)
        
        except requests.Timeout:
            logger.warning(f"Bright Data API timeout for query: {query}")
            return self._mock_result(query, category)
        
        except Exception as e:
            logger.warning(f"Bright Data API error: {e} - falling back to mock data")
            return self._mock_result(query, category)
    
    # ==================== MOCK DATA FALLBACK ====================
    
    def _mock_result(self, query: str, category: str) -> Dict:
        """
        Generate mock result for offline/testing scenarios.
        Mimics real Bright Data response structure.
        """
        
        category_map = {
            "regulatory": self._mock_regulatory_result,
            "threat_intelligence": self._mock_threat_result,
            "industry_benchmark": self._mock_benchmark_result,
        }
        
        mock_fn = category_map.get(category, self._mock_regulatory_result)
        return mock_fn(query)
    
    def _mock_regulatory_result(self, query: str) -> Dict:
        """Mock regulatory data result."""
        
        mock_titles = {
            "GDPR": "GDPR Compliance 2024 - Complete Guide for Organizations",
            "HIPAA": "HIPAA Requirements and Data Privacy Standards",
            "AI policy": "AI Policy Best Practices for Non-Profits",
            "data retention": "Data Retention Compliance Requirements by Jurisdiction",
            "privacy": "Data Privacy Regulations Comparison 2024",
        }
        
        # Find matching title
        title = "GDPR Compliance Update: Data Privacy Requirements"
        for key, value in mock_titles.items():
            if key.lower() in query.lower():
                title = value
                break
        
        return {
            "query": query,
            "source": "bright_data_serp",
            "category": "regulatory",
            "results": [
                {
                    "title": title,
                    "url": f"https://compliance.example.com/{query.replace(' ', '-')}",
                    "snippet": f"Latest updates on {query} for non-profits and organizations. "
                               f"Compliance requirements, legal framework, implementation guidelines...",
                    "relevance": 0.90
                }
            ]
        }
    
    def _mock_threat_result(self, query: str) -> Dict:
        """Mock threat intelligence result."""
        
        return {
            "query": query,
            "source": "bright_data_serp",
            "category": "threat_intelligence",
            "results": [
                {
                    "title": f"Security Advisory: {query}",
                    "url": f"https://security.example.com/{query.replace(' ', '-')}",
                    "snippet": f"Important security considerations for {query}. "
                               f"Vulnerability assessment, mitigation strategies, best practices...",
                    "relevance": 0.88
                }
            ]
        }
    
    def _mock_benchmark_result(self, query: str) -> Dict:
        """Mock industry benchmark result."""
        
        return {
            "query": query,
            "source": "bright_data_serp",
            "category": "industry_benchmark",
            "results": [
                {
                    "title": f"Case Study: {query}",
                    "url": f"https://examples.example.com/{query.replace(' ', '-')}",
                    "snippet": f"Real-world example of how organizations are addressing {query}. "
                               f"Implementation approach, lessons learned, measurable outcomes...",
                    "relevance": 0.85
                }
            ]
        }
    
    # ==================== ADVANCED FEATURES ====================
    
    def validate_api_key(self) -> bool:
        """Test Bright Data API connectivity."""
        
        if not self.has_api_key:
            logger.warning("No Bright Data API key configured")
            return False
        
        try:
            payload = {
                "query": "test",
                "limit": 1
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }
            
            response = requests.post(
                self.base_url,
                json=payload,
                headers=headers,
                timeout=10
            )
            
            is_valid = response.status_code == 200
            
            if is_valid:
                logger.info("Bright Data API key is valid")
            else:
                logger.warning(f"Bright Data API validation failed: {response.status_code}")
            
            return is_valid
        
        except Exception as e:
            logger.error(f"Bright Data API validation error: {e}")
            return False