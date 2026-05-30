"""
Code Repository Scanner - Analyzes codebase for AI systems, data handling, security
"""

import os
import re
from typing import Dict, List
import logging

logger = logging.getLogger("policyguard.services.code_scanner")

class CodeRepositoryScanner:
    """Scan codebases for AI/ML systems, data flows, and security patterns."""
    
    def scan_repository(self, repo_path: str) -> Dict:
        """Scan entire repository."""
        
        findings = {
            "ai_ml_systems": self._find_ml_systems(repo_path),
            "data_handling": self._find_data_handling(repo_path),
            "security_practices": self._find_security(repo_path),
            "cloud_integrations": self._find_cloud_services(repo_path),
            "third_party_libs": self._find_dependencies(repo_path),
            "logging_patterns": self._find_logging(repo_path),
            "database_patterns": self._find_databases(repo_path),
        }
        
        return findings
    
    def _find_ml_systems(self, repo_path: str) -> List[Dict]:
        """Find ML/AI systems in code."""
        
        ml_indicators = {
            'sklearn': 'scikit-learn models',
            'tensorflow': 'TensorFlow models',
            'keras': 'Keras models',
            'pytorch': 'PyTorch models',
            'xgboost': 'XGBoost models',
            'lightgbm': 'LightGBM models',
            'spacy': 'spaCy NLP models',
            'transformers': 'Hugging Face transformers',
        }
        
        systems = []
        for root, dirs, files in os.walk(repo_path):
            for file in files:
                if file.endswith('.py'):
                    filepath = os.path.join(root, file)
                    with open(filepath, 'r', errors='ignore') as f:
                        content = f.read()
                        
                        for lib, desc in ml_indicators.items():
                            if f"import {lib}" in content or f"from {lib}" in content:
                                systems.append({
                                    "type": desc,
                                    "file": filepath,
                                    "description": f"Found {desc} usage"
                                })
        
        return systems
    
    def _find_data_handling(self, repo_path: str) -> List[Dict]:
        """Find how data is handled (encrypted, logged, transmitted)."""
        
        patterns = {
            "encryption": r"(encrypt|AES|RSA|crypto)",
            "hashing": r"(hash|md5|sha256|bcrypt)",
            "tokenization": r"(token|mask|redact)",
            "logging_data": r"(log\.debug|logger\.|print\(.*password|print\(.*token)",
            "api_calls": r"(requests\.|httpx\.|urllib)",
        }
        
        findings = []
        for root, dirs, files in os.walk(repo_path):
            for file in files:
                if file.endswith('.py'):
                    filepath = os.path.join(root, file)
                    with open(filepath, 'r', errors='ignore') as f:
                        content = f.read()
                        for pattern_name, pattern in patterns.items():
                            if re.search(pattern, content, re.IGNORECASE):
                                findings.append({
                                    "pattern": pattern_name,
                                    "file": filepath,
                                    "found": True
                                })
        
        return findings
    
    def _find_security(self, repo_path: str) -> List[Dict]:
        """Find security patterns and issues."""
        
        issues = []
        
        for root, dirs, files in os.walk(repo_path):
            for file in files:
                if file.endswith('.py'):
                    filepath = os.path.join(root, file)
                    with open(filepath, 'r', errors='ignore') as f:
                        lines = f.readlines()
                        
                        for i, line in enumerate(lines):
                            # SQL injection risk
                            if re.search(r"execute\(.*format|execute\(.*%|execute\(.*\+", line):
                                issues.append({
                                    "type": "sql_injection_risk",
                                    "file": filepath,
                                    "line": i + 1,
                                    "severity": "high"
                                })
                            
                            # Hardcoded secrets
                            if re.search(r"(password|api_key|secret|token)\s*=\s*['\"]", line):
                                issues.append({
                                    "type": "hardcoded_secret",
                                    "file": filepath,
                                    "line": i + 1,
                                    "severity": "critical"
                                })
                            
                            # Insecure deserialization
                            if "pickle.loads" in line or "yaml.load" in line:
                                issues.append({
                                    "type": "insecure_deserialization",
                                    "file": filepath,
                                    "line": i + 1,
                                    "severity": "high"
                                })
        
        return issues
    
    def _find_cloud_services(self, repo_path: str) -> List[str]:
        """Detect cloud service usage."""
        
        cloud_services = set()
        
        cloud_indicators = {
            'boto3': 'AWS',
            'azure': 'Azure',
            'google.cloud': 'Google Cloud',
            'digitalocean': 'DigitalOcean',
        }
        
        for root, dirs, files in os.walk(repo_path):
            for file in files:
                if file.endswith(('.py', '.txt', '.yml', '.yaml')):
                    filepath = os.path.join(root, file)
                    with open(filepath, 'r', errors='ignore') as f:
                        content = f.read()
                        for lib, service in cloud_indicators.items():
                            if lib in content:
                                cloud_services.add(service)
        
        return list(cloud_services)
    
    def _find_dependencies(self, repo_path: str) -> List[str]:
        """Extract third-party dependencies."""
        
        dependencies = set()
        
        # Check requirements.txt
        req_file = os.path.join(repo_path, 'requirements.txt')
        if os.path.exists(req_file):
            with open(req_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        pkg = line.split('==')[0].split('>')[0].split('<')[0]
                        dependencies.add(pkg)
        
        return list(dependencies)
    
    def _find_logging(self, repo_path: str) -> Dict:
        """Check logging practices."""
        
        logging_config = {
            "has_centralized_logging": False,
            "log_level_config": False,
            "log_files_configured": False,
        }
        
        for root, dirs, files in os.walk(repo_path):
            for file in files:
                if file.endswith('.py'):
                    filepath = os.path.join(root, file)
                    with open(filepath, 'r', errors='ignore') as f:
                        content = f.read()
                        
                        if 'basicConfig' in content or 'getLogger' in content:
                            logging_config["has_centralized_logging"] = True
                        
                        if 'DEBUG' in content or 'INFO' in content:
                            logging_config["log_level_config"] = True
                        
                        if 'handlers' in content or 'FileHandler' in content:
                            logging_config["log_files_configured"] = True
        
        return logging_config
    
    def _find_databases(self, repo_path: str) -> List[str]:
        """Detect database systems used."""
        
        databases = set()
        
        db_indicators = {
            'pymongo': 'MongoDB',
            'psycopg': 'PostgreSQL',
            'mysql': 'MySQL',
            'sqlalchemy': 'Multiple SQL databases',
            'redis': 'Redis',
            'elasticsearch': 'Elasticsearch',
        }
        
        for root, dirs, files in os.walk(repo_path):
            for file in files:
                if file.endswith(('.py', '.txt')):
                    filepath = os.path.join(root, file)
                    with open(filepath, 'r', errors='ignore') as f:
                        content = f.read()
                        for lib, db in db_indicators.items():
                            if lib in content:
                                databases.add(db)
        
        return list(databases)