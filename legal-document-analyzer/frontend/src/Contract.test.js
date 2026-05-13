import { describe, it, expect } from 'vitest';

// Contract definitions
const checkDashboardStatsContract = (data) => {
  expect(data).toHaveProperty('risk_atlas');
  expect(data.risk_atlas).toHaveProperty('high');
  expect(typeof data.risk_atlas.high).toBe('number');
  
  expect(data).toHaveProperty('active_ingestions');
  expect(typeof data.active_ingestions).toBe('number');
  
  expect(data).toHaveProperty('active_tasks');
  expect(Array.isArray(data.active_tasks)).toBe(true);

  expect(data).toHaveProperty('intelligence_feed');
  expect(Array.isArray(data.intelligence_feed)).toBe(true);
};

const checkAnalysisContract = (data) => {
  expect(data).toHaveProperty('status');
  expect(data).toHaveProperty('summary');
  expect(data).toHaveProperty('analysis_overview');
  expect(data.analysis_overview).toHaveProperty('document_type');
  expect(data.analysis_overview).toHaveProperty('risk_score');
  
  expect(data).toHaveProperty('key_clauses');
  expect(Array.isArray(data.key_clauses)).toBe(true);
  
  expect(data).toHaveProperty('risks');
  expect(Array.isArray(data.risks)).toBe(true);
};

describe('API Contract Tests', () => {
  it('Dashboard Stats payload conforms to contract', () => {
    // This payload represents what the backend is expected to return
    const payload = {
      "active_ingestions": 0,
      "active_tasks": [],
      "intelligence_feed": [
        {
          "color": "error",
          "message": "Critical risk detected in test.pdf.",
          "tags": ["Compliance", "Action Required"],
          "time": "Recently",
          "type": "Critical Insight"
        }
      ],
      "risk_atlas": {
        "high": 1,
        "low": 0,
        "medium": 0
      }
    };
    
    checkDashboardStatsContract(payload);
  });

  it('Analysis Response payload conforms to contract', () => {
    // This payload represents what the Spring Boot AI backend returns
    const payload = {
      "status": "success",
      "summary": "The document is a Service Agreement...",
      "analysis_overview": {
        "document_type": "Service Agreement",
        "signer_context": "Party A",
        "risk_score": "high",
        "readability_band": "Postgraduate"
      },
      "key_clauses": [
        {
          "section": "Confidentiality",
          "text": "All information is confidential.",
          "explanation": "Standard confidentiality clause.",
          "is_risky": false
        }
      ],
      "risks": [
        {
          "risk_title": "Unlimited Liability",
          "why_this_is_risky": "There is no cap on damages.",
          "severity_level": "high"
        }
      ]
    };
    
    checkAnalysisContract(payload);
  });
});
