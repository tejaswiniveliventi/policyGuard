"""
Enterprise Assessor Agent - Comprehensive risk assessment
"""

import logging
import json
from src.services.llm import llm_client

logger = logging.getLogger("policyguard.agents.enterprise_assessor")

class EnterpriseAssessor:
    """Comprehensive assessment of enterprise organization."""
    
    def assess_enterprise(
        self,
        discovery_data: Dict,
        code_scan_results: Dict,
        integration_scan_results: Dict,
        web_intelligence: Dict,
    ) -> Dict:
        """
        Comprehensive assessment combining all data sources.
        """
        
        assessment_prompt = f"""
You are an enterprise AI governance expert. Conduct a comprehensive assessment.

ORGANIZATION PROFILE (from discovery):
{json.dumps(discovery_data, indent=2)[:2000]}

CODE ANALYSIS (from repository scan):
{json.dumps(code_scan_results, indent=2)[:1500]}

INTEGRATION ANALYSIS (from system scan):
{json.dumps(integration_scan_results, indent=2)[:1000]}

REGULATORY INTELLIGENCE:
{json.dumps(web_intelligence, indent=2)[:1500]}

Identify:
1. CRITICAL VIOLATIONS (regulatory breaches)
2. HIGH-RISK AREAS (significant gaps)
3. MEDIUM-RISK ISSUES (compliance gaps)
4. EXISTING STRENGTHS (what's working)
5. DATA FLOW RISKS (where data is vulnerable)
6. AI/ML GOVERNANCE GAPS
7. ACCESS CONTROL ISSUES
8. ENCRYPTION/SECURITY GAPS
9. AUDIT & LOGGING DEFICIENCIES
10. VENDOR MANAGEMENT GAPS

RESPOND WITH VALID JSON:
{{
  "assessment_summary": "",
  "critical_findings": [
    {{"area": "", "issue": "", "regulation": "", "impact": "", "remediation": ""}}
  ],
  "high_risk_areas": [...],
  "medium_risk_issues": [...],
  "policy_priorities": [],
  "estimated_effort_days": 0,
  "estimated_cost": ""
}}
"""
        
        response = self.llm.call(assessment_prompt, max_tokens=3000)
        
        try:
            result = json.loads(response)
            logger.info(f"Enterprise assessment complete")
            return result
        except:
            logger.error("Failed to parse assessment")
            return {"status": "error"}