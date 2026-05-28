"""Web Scraper Agent - fetches regulatory and threat intelligence."""

from typing import Dict, Any, List
from src.agents.base_agent import BaseAgent
from src.services.web_intelligence.bright_data import BrightDataScraper
from src.models.orm import WebDataSnapshot
import uuid
from datetime import datetime


class WebScraperAgent(BaseAgent):
    """
    Web Scraper Agent

    Fetches real-time regulatory updates, security threats, and industry benchmarks
    using Bright Data APIs.
    """

    def __init__(self, bright_data_api_key: str = None):
        """Initialize Web Scraper Agent."""
        super().__init__(
            name="web_scraper",
            role="Regulatory Intelligence Analyst",
            goal="Fetch real-time regulatory updates, security threats, and industry benchmarks",
        )
        self.scraper = BrightDataScraper(api_key=bright_data_api_key)

    def execute(
        self, org_id: str, industry: str, ai_use_cases: List[str], **kwargs
    ) -> Dict[str, Any]:
        """
        Execute web scraping task.

        Args:
            org_id: Organization ID
            industry: Industry type (healthcare, education, etc.)
            ai_use_cases: List of AI use cases (["diagnosis", "scheduling"])

        Returns:
            Dict with regulatory updates, threats, and benchmarks
        """
        self.log_start("web_scraping", org_id=org_id, industry=industry)

        try:
            # Fetch all three types of data
            regulatory = self.scraper.search_regulatory_updates(
                industry=industry, keywords=ai_use_cases
            )
            threats = self.scraper.search_threat_intelligence()
            benchmarks = self.scraper.search_industry_benchmarks(industry=industry)

            # Combine results
            result = {
                "status": "success",
                "org_id": org_id,
                "regulatory_updates": regulatory,
                "threat_intelligence": threats,
                "industry_benchmarks": benchmarks,
                "total_items": len(regulatory) + len(threats) + len(benchmarks),
                "timestamp": datetime.utcnow().isoformat(),
            }

            self.log_end(
                "web_scraping",
                status="completed",
                total_items=len(regulatory) + len(threats) + len(benchmarks),
            )
            return result

        except Exception as e:
            self.log_error("web_scraping", e)
            return {
                "status": "error",
                "org_id": org_id,
                "error": str(e),
                "regulatory_updates": [],
                "threat_intelligence": [],
                "industry_benchmarks": [],
            }

    def create_snapshots(
        self, org_id: str, web_data: Dict[str, Any]
    ) -> List[WebDataSnapshot]:
        """
        Create WebDataSnapshot objects from fetched data.

        These are stored in the database for audit trail and future reference.
        """
        snapshots = []

        # Process regulatory updates
        for update in web_data.get("regulatory_updates", []):
            snapshot = WebDataSnapshot(
                snapshot_id=str(uuid.uuid4()),
                org_id=org_id,
                data_type="regulatory_update",
                source=update.get("source", "unknown"),
                content_summary=update.get("snippet", ""),
                full_content=update.get("full_content", ""),
                relevance_score=update.get("relevance", 0.5),
                requires_policy_update=True,
            )
            snapshots.append(snapshot)

        # Process threats
        for threat in web_data.get("threat_intelligence", []):
            snapshot = WebDataSnapshot(
                snapshot_id=str(uuid.uuid4()),
                org_id=org_id,
                data_type="threat_intelligence",
                source=threat.get("source", "unknown"),
                content_summary=threat.get("snippet", ""),
                full_content=threat.get("full_content", ""),
                relevance_score=threat.get("relevance", 0.5),
                requires_policy_update=True,
            )
            snapshots.append(snapshot)

        # Process benchmarks
        for benchmark in web_data.get("industry_benchmarks", []):
            snapshot = WebDataSnapshot(
                snapshot_id=str(uuid.uuid4()),
                org_id=org_id,
                data_type="industry_benchmark",
                source=benchmark.get("source", "unknown"),
                content_summary=benchmark.get("snippet", ""),
                full_content=benchmark.get("full_content", ""),
                relevance_score=benchmark.get("relevance", 0.5),
                requires_policy_update=False,
            )
            snapshots.append(snapshot)

        self.logger.info(f"Created {len(snapshots)} data snapshots for {org_id}")
        return snapshots
