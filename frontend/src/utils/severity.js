export const SEVERITY_LEVELS = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function getSeverityColor(severity) {
  const colors = {
    critical: '#e04b4a',
    high: '#d49c00',
    medium: '#378add',
    low: '#0f7e56',
  };
  return colors[severity] || '#888780';
}

export function getSeverityLabel(severity) {
  const labels = {
    critical: 'CRITICAL',
    high: 'HIGH',
    medium: 'MEDIUM',
    low: 'LOW',
  };
  return labels[severity] || severity.toUpperCase();
}

export function calculateRiskScore(findings) {
  if (!findings || findings.length === 0) return 0;
  const totalWeight = findings.reduce((sum, f) => {
    return sum + (SEVERITY_LEVELS[f.severity] || 0);
  }, 0);
  return Math.min(10, (totalWeight / (findings.length * 4)) * 10);
}