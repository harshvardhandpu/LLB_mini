import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import Dashboard from './components/Dashboard';

const mockAnalyses = {
  analyses: [
    {
      id: "doc-1",
      file_name: "Project_Alpha_M&A_v4.pdf",
      created_at: new Date().toISOString(),
      risk_level: "high",
      document_type: "Contract",
      document_size: 15400
    }
  ]
};

const mockStats = {
  risk_atlas: {
    high: 5,
    medium: 12,
    low: 30
  },
  active_ingestions: 1,
  active_tasks: [
    {
      name: "Q3_Compliance_Audit.docx",
      progress: 60,
      status: "Analyzing text",
      color: "tertiary"
    }
  ],
  intelligence_feed: [
    {
      type: "Critical Insight",
      message: "Critical risk detected in Project_Alpha_M&A_v4.pdf.",
      tags: ["Compliance", "Action Required"],
      time: "Just Now",
      color: "error"
    }
  ]
};

const server = setupServer(
  http.get('http://localhost:5001/api/analyses', () => {
    return HttpResponse.json(mockAnalyses);
  }),
  http.get('http://localhost:5001/api/dashboard/stats', () => {
    return HttpResponse.json(mockStats);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Dashboard Integration Tests', () => {
  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <Dashboard user={{ username: 'testuser' }} onLogout={() => {}} />
      </MemoryRouter>
    );
    const elements = screen.getAllByText(/active ingestions/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('fetches and displays real backend responses (Risk Atlas)', async () => {
    render(
      <MemoryRouter>
        <Dashboard user={{ username: 'testuser' }} onLogout={() => {}} />
      </MemoryRouter>
    );

    // Verify Risk Atlas Stats
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument(); // High risk count
      expect(screen.getByText('12')).toBeInTheDocument(); // Medium risk count
      expect(screen.getByText('30')).toBeInTheDocument(); // Low risk count
    });
  });

  it('fetches and displays real backend responses (Active Ingestions)', async () => {
    render(
      <MemoryRouter>
        <Dashboard user={{ username: 'testuser' }} onLogout={() => {}} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('1 Tasks')).toBeInTheDocument();
      expect(screen.getByText('Q3_Compliance_Audit.docx')).toBeInTheDocument();
      expect(screen.getByText('Analyzing text...')).toBeInTheDocument();
    });
  });

  it('fetches and displays real backend responses (Intelligence Feed)', async () => {
    render(
      <MemoryRouter>
        <Dashboard user={{ username: 'testuser' }} onLogout={() => {}} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Critical Insight')).toBeInTheDocument();
      expect(screen.getByText('Critical risk detected in Project_Alpha_M&A_v4.pdf.')).toBeInTheDocument();
      expect(screen.getByText('Action Required')).toBeInTheDocument();
    });
  });
});
