"""Policy Generator Agent - generates policy drafts."""

from typing import Dict, Any
from src.agents.base_agent import BaseAgent
from src.services.llm.factory import llm_client
from src.exceptions import LLMError


class GeneratorAgent(BaseAgent):
    """
    Policy Generator Agent

    Generates comprehensive AI policy drafts based on identified gaps
    and industry best practices.
    """

    def __init__(self):
        """Initialize Generator Agent."""
        super().__init__(
            name="generator",
            role="AI Policy Architect",
            goal="Generate comprehensive, actionable AI policies for organizations",
        )

    def execute(
        self,
        org_name: str,
        industry: str,
        ai_use_cases: list,
        gaps: Dict[str, Any],
        web_data: Dict[str, Any],
        **kwargs,
    ) -> Dict[str, Any]:
        """
        Generate policy draft.

        Args:
            org_name: Organization name
            industry: Industry type
            ai_use_cases: List of AI use cases
            gaps: Identified compliance gaps
            web_data: Web intelligence data

        Returns:
            Dict with generated policy draft
        """
        self.log_start("policy_generation", org_name=org_name)

        try:
            # Generate policy using LLM
            policy_draft = self._generate_with_llm(
                org_name=org_name,
                industry=industry,
                ai_use_cases=ai_use_cases,
                gaps=gaps,
                web_data=web_data,
            )

            result = {
                "status": "success",
                "policy_draft": policy_draft,
                "word_count": len(policy_draft.split()),
                "has_policy": len(policy_draft) > 100,
            }

            self.log_end(
                "policy_generation", status="completed", word_count=result["word_count"]
            )
            return result

        except Exception as e:
            self.log_error("policy_generation", e)
            return {
                "status": "error",
                "error": str(e),
                "policy_draft": "",
                "has_policy": False,
            }

    def _generate_with_llm(
        self,
        org_name: str,
        industry: str,
        ai_use_cases: list,
        gaps: Dict[str, Any],
        web_data: Dict[str, Any],
    ) -> str:
        """Call LLM to generate policy."""

        # Format gaps for prompt
        gaps_text = ""
        for gap in gaps.get("gaps", [])[:5]:  # Top 5 gaps
            gaps_text += f"- {gap.get('severity', 'medium').upper()}: {gap.get('description', '')}\n"

        # Format recommendations
        recommendations = "\n".join(
            [g.get("recommendation", "") for g in gaps.get("gaps", [])]
        )

        prompt = f"""
You are an AI Policy Architect for {industry} organizations. Generate a comprehensive AI policy for {org_name}.

ORGANIZATION CONTEXT:
- Name: {org_name}
- Industry: {industry}
- AI Use Cases: {', '.join(ai_use_cases)}

COMPLIANCE GAPS TO ADDRESS:
{gaps_text}

Generate a detailed, actionable AI policy in Markdown format that includes:

1. **Data Privacy & Retention**
   - Data collection practices
   - Retention periods (specific timelines)
   - Deletion procedures
   - Beneficiary consent requirements

2. **Bias & Fairness**
   - Bias detection mechanisms
   - Fairness assessments (quarterly minimum)
   - Regular audits (frequency and scope)
   - Mitigation strategies

3. **Transparency & Explainability**
   - When beneficiaries learn about AI use
   - How decisions are explained
   - Audit trail requirements
   - Disclosure obligations

4. **Security & Vendor Compliance**
   - Data security measures (encryption standards)
   - Vendor assessment criteria
   - Breach notification procedures (timeline)
   - Access controls and authentication

5. **Governance & Oversight**
   - Policy review schedule (annual minimum)
   - Accountability mechanisms
   - Stakeholder engagement process
   - Escalation procedures for issues

Write for a non-technical audience. Include specific, actionable items (not vague).
Use simple language. Include implementation timelines where applicable.

START WITH: # AI Policy for {org_name}
        """

        try:
            policy = llm_client.call(prompt, max_tokens=3000, temperature=0.0)
            return policy
        except Exception as e:
            self.logger.error(f"LLM policy generation failed: {e}")
            raise LLMError(f"Failed to generate policy: {e}", provider="unknown")
