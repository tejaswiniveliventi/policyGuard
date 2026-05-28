"""Compliance Validator Agent - validates generated policies."""

from typing import Dict, Any, List
from src.agents.base_agent import BaseAgent
from src.services.llm.factory import llm_client
import json


class ValidatorAgent(BaseAgent):
    """
    Compliance Validator Agent

    Validates generated policies against best practices and compliance standards.
    Scores policies and flags issues for human review.
    """

    BEST_PRACTICE_CHECKLIST = [
        "Data minimization",
        "Clear consent procedures",
        "Explicit retention timelines",
        "Encryption standards",
        "Bias detection mechanisms",
        "Transparency about AI use",
        "Vendor security assessments",
        "Breach notification procedures",
        "Regular policy reviews",
        "Clear accountability",
    ]

    def __init__(self):
        """Initialize Validator Agent."""
        super().__init__(
            name="validator",
            role="Policy Validator",
            goal="Validate policies and ensure compliance, clarity, and actionability",
        )

    def execute(self, policy_draft: str, **kwargs) -> Dict[str, Any]:
        """
        Validate policy draft.

        Args:
            policy_draft: Generated policy text

        Returns:
            Dict with validation score, issues, recommendations
        """
        self.log_start("policy_validation")

        try:
            # Call LLM to validate
            validation = self._validate_with_llm(policy_draft)

            result = {
                "status": "success",
                "is_ready_for_review": validation.get("is_ready_for_review", False),
                "validation_score": validation.get("validation_score", 0),
                "issues": validation.get("issues", []),
                "summary": validation.get("summary", ""),
                "has_issues": len(validation.get("issues", [])) > 0,
            }

            self.log_end(
                "policy_validation",
                status="completed",
                score=result["validation_score"],
            )
            return result

        except Exception as e:
            self.log_error("policy_validation", e)
            return {
                "status": "error",
                "error": str(e),
                "validation_score": 0,
                "is_ready_for_review": False,
                "issues": [],
            }

    def _validate_with_llm(self, policy_draft: str) -> Dict[str, Any]:
        """Call LLM to validate policy."""
        prompt = f"""
You are a strict compliance validator. Review this policy:

{policy_draft}

Against this checklist:
{chr(10).join([f'- {item}' for item in self.BEST_PRACTICE_CHECKLIST])}

For EACH major section, evaluate:
1. Is every statement sourced or clearly flagged [ASSUMPTION]?
2. Are there vague phrases ("should," "typically," "may")?
3. Is it understandable for a non-lawyer?
4. Are there contradictions?
5. Does it address the compliance gaps?

Return ONLY valid JSON (no markdown):
{{
  "is_ready_for_review": boolean,
  "validation_score": 0-100,
  "issues": [
    {{
      "severity": "low|medium|high",
      "section": "string",
      "issue": "string",
      "suggestion": "string"
    }}
  ],
  "summary": "string"
}}

Validation score should be:
- 90-100: Ready for immediate review
- 70-89: Ready with minor clarifications
- 50-69: Needs significant revision
- <50: Reject and regenerate
        """

        try:
            response = llm_client.call(prompt, max_tokens=1500, temperature=0.0)
            parsed = json.loads(response)
            return parsed
        except json.JSONDecodeError:
            self.logger.error(f"Failed to parse validation response")
            return {
                "is_ready_for_review": False,
                "validation_score": 50,
                "issues": [
                    {
                        "severity": "high",
                        "section": "N/A",
                        "issue": "Validation parsing error",
                        "suggestion": "Manual review required",
                    }
                ],
                "summary": "Validation failed, manual review needed",
            }
