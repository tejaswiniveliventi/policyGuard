"""Policy Analyzer Agent - identifies compliance gaps."""

from typing import Dict, Any, List
from src.agents.base_agent import BaseAgent
from src.services.llm.factory import llm_client
from src.exceptions import LLMError
import json


class AnalyzerAgent(BaseAgent):
    """
    Policy Analyzer Agent

    Analyzes gaps between current policies and new intelligence.
    Uses LLM to identify missing requirements and risk areas.
    """

    def __init__(self):
        """Initialize Analyzer Agent."""
        super().__init__(
            name="analyzer",
            role="Compliance Gap Analyzer",
            goal="Identify gaps between current policies and regulatory requirements",
        )

    def execute(
        self, current_policies: str, web_data: Dict[str, Any], **kwargs
    ) -> Dict[str, Any]:
        """
        Analyze compliance gaps.

        Args:
            current_policies: String of current org policies
            web_data: Dict with regulatory updates, threats, benchmarks

        Returns:
            Dict with identified gaps, severity scores, recommendations
        """
        self.log_start("gap_analysis")

        try:
            # Format web data for LLM analysis
            intelligence_summary = self._format_intelligence(web_data)

            # Call LLM to analyze gaps
            gaps = self._analyze_with_llm(current_policies, intelligence_summary)

            result = {
                "status": "success",
                "gaps": gaps.get("gaps", []),
                "summary": gaps.get("summary", ""),
                "requires_policy_update": gaps.get("requires_policy_update", False),
                "severity_distribution": self._calculate_severity_distribution(
                    gaps.get("gaps", [])
                ),
            }

            self.log_end(
                "gap_analysis", status="completed", gap_count=len(gaps.get("gaps", []))
            )
            return result

        except Exception as e:
            self.log_error("gap_analysis", e)
            return {
                "status": "error",
                "error": str(e),
                "gaps": [],
                "requires_policy_update": False,
            }

    def _format_intelligence(self, web_data: Dict[str, Any]) -> str:
        """Format web data for LLM analysis."""
        regulatory = web_data.get("regulatory_updates", [])
        threats = web_data.get("threat_intelligence", [])
        benchmarks = web_data.get("industry_benchmarks", [])

        summary = "REGULATORY UPDATES:\n"
        for item in regulatory[:3]:  # Top 3
            summary += f"- {item.get('title', '')}: {item.get('snippet', '')}\n"

        summary += "\nTHREAT INTELLIGENCE:\n"
        for item in threats[:3]:
            summary += f"- {item.get('title', '')}: {item.get('snippet', '')}\n"

        summary += "\nINDUSTRY BENCHMARKS:\n"
        for item in benchmarks[:3]:
            summary += f"- {item.get('title', '')}: {item.get('snippet', '')}\n"

        return summary

    def _analyze_with_llm(
        self, current_policies: str, intelligence: str
    ) -> Dict[str, Any]:
        """Call LLM to analyze gaps."""
        prompt = f"""
You are a Compliance Gap Analyzer. Analyze the following:

CURRENT POLICIES:
{current_policies if current_policies else 'No existing policies'}

NEW INTELLIGENCE (Regulatory Updates, Threats, Best Practices):
{intelligence}

Identify:
1. Direct conflicts or non-compliance risks
2. Missing policy areas
3. Severity level for each gap (low/medium/high/critical)
4. Recommended actions

Return ONLY valid JSON (no markdown, no extra text):
{{
  "gaps": [
    {{
      "gap_type": "string",
      "severity": "low|medium|high|critical",
      "description": "string",
      "recommendation": "string"
    }}
  ],
  "summary": "string",
  "requires_policy_update": boolean
}}
        """

        try:
            response = llm_client.call(prompt, max_tokens=1500, temperature=0.0)
            # Parse JSON response
            parsed = json.loads(response)
            return parsed
        except json.JSONDecodeError:
            self.logger.error(f"Failed to parse LLM response: {response}")
            return {
                "gaps": [],
                "summary": "Error parsing analysis",
                "requires_policy_update": False,
            }

    def _calculate_severity_distribution(self, gaps: List[Dict]) -> Dict[str, int]:
        """Calculate severity distribution."""
        distribution = {"low": 0, "medium": 0, "high": 0, "critical": 0}
        for gap in gaps:
            severity = gap.get("severity", "medium")
            distribution[severity] = distribution.get(severity, 0) + 1
        return distribution
