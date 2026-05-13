import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import Analyzer from './components/Analyzer';

const mockAnalyzeResponse = {
  status: "success",
  summary: "This is a mock analysis summary.",
  analysis_overview: {
    document_type: "NDA",
    signer_context: "Consultant",
    risk_score: "High",
    readability_band: "Complex"
  },
  key_clauses: [
    {
      section: "Confidentiality",
      text: "User shall not disclose...",
      explanation: "Standard confidentiality.",
      is_risky: false
    }
  ],
  risks: [
    {
      risk_title: "Indemnity",
      why_this_is_risky: "Uncapped liability.",
      severity_level: "high"
    }
  ]
};

const server = setupServer(
  http.post('http://localhost:8080/api/documents/analyze', () => {
    return HttpResponse.json(mockAnalyzeResponse);
  }),
  http.post('http://localhost:5001/api/analyses', () => {
    return HttpResponse.json({ message: "Saved" }, { status: 201 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Analyzer Integration Tests', () => {
  it('handles document upload, shows loading state, and renders results', async () => {
    render(
      <MemoryRouter>
        <Analyzer user={{ username: 'testuser' }} onLogout={() => {}} />
      </MemoryRouter>
    );

    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });
    
    // Find the hidden file input
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const fileInput = fileInputs[0];
    
    // Trigger file change
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Expect loading state
    expect(screen.getByText(/Analyzing document/i)).toBeInTheDocument();

    // Expect results to appear
    await waitFor(() => {
      expect(screen.getByText('DOCUMENT ANALYSIS: NDA')).toBeInTheDocument();
      expect(screen.getByText('This is a mock analysis summary.')).toBeInTheDocument();
      expect(screen.getByText(/Uncapped liability/i)).toBeInTheDocument();
    });
  });
});
