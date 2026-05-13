import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import Vault from './components/Vault';

const mockAnalyses = {
  analyses: [
    {
      id: "doc-1",
      file_name: "Project_Alpha.pdf",
      created_at: new Date().toISOString(),
      risk_level: "high",
      document_type: "Contract",
      document_size: 15400
    },
    {
      id: "doc-2",
      file_name: "Beta_Terms.docx",
      created_at: new Date().toISOString(),
      risk_level: "low",
      document_type: "Terms",
      document_size: 12000
    }
  ]
};

const server = setupServer(
  http.get('http://localhost:5001/api/analyses', () => {
    return HttpResponse.json(mockAnalyses);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Vault Integration Tests', () => {
  it('renders documents and filters them properly', async () => {
    render(
      <MemoryRouter>
        <Vault user={{ username: 'testuser' }} onLogout={() => {}} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Project_Alpha.pdf')).toBeInTheDocument();
      expect(screen.getByText('Beta_Terms.docx')).toBeInTheDocument();
    });

    // Test Risk Level Filtering
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'low' } });

    await waitFor(() => {
      expect(screen.getByText('Beta_Terms.docx')).toBeInTheDocument();
      expect(screen.queryByText('Project_Alpha.pdf')).not.toBeInTheDocument();
    });
  });
});
