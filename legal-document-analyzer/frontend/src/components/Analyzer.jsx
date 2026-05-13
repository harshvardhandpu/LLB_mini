import { useState, useRef } from 'react';
import Layout from './Layout';

const API_URL = 'http://localhost:8080/api';

function Analyzer({ user, onLogout }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);

    if (!selected.name.toLowerCase().endsWith('.pdf') && !selected.name.toLowerCase().endsWith('.docx')) {
      setError('Only PDF and DOCX files are supported');
      return;
    }
    if (selected.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit');
      return;
    }

    setLoading(true);
    setError('');
    setStartTime(Date.now());

    try {
      const formData = new FormData();
      formData.append('file', selected);
      
      const response = await fetch(`${API_URL}/documents/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Analysis failed');
      }
      
      const data = await response.json();
      if (data.status === 'failed') {
        throw new Error(data.error || 'Analysis failed');
      }
      
      data.fileName = selected.name;
      setResults(data);

      try {
        await fetch('http://localhost:5001/api/analyses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(data)
        });
      } catch (saveErr) {
        console.error("Failed to save analysis to history:", saveErr);
      }

    } catch (err) {
      setError(err.message || 'Failed to analyze document');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!results) return;
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `legal-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="flex w-full h-[calc(100vh-6rem)] gap-gutter bg-background">
        {/* Left Pane: Document Viewer (60%) */}
        <section className="w-[60%] flex flex-col border border-outline-variant/20 rounded bg-surface-container-low/50 backdrop-blur-sm overflow-hidden">
          <div className="h-12 border-b border-outline-variant/20 flex items-center justify-between px-4 bg-surface-container/80">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">description</span>
              <span className="font-data-tabular text-data-tabular text-on-surface">{file ? file.name : 'No Document Selected'}</span>
              {file && <span className="px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant font-label-caps text-[10px]">{formatFileSize(file.size)}</span>}
            </div>
            {results && (
              <div className="flex items-center gap-2">
                <button onClick={downloadReport} className="p-1 text-on-surface-variant hover:text-primary rounded hover:bg-white/5" title="Download Report">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-grow overflow-y-auto p-8 bg-surface/30 flex justify-center">
            {!file && (
              <div className="text-center self-center flex flex-col items-center">
                <input type="file" ref={fileInputRef} onChange={(e) => handleFiles(e.target.files)} accept=".pdf,.docx" hidden />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary px-6 py-3 rounded font-body-ui text-body-ui flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined">upload</span>
                  Upload Document
                </button>
                <p className="text-on-surface-variant mt-4 text-sm">Upload PDF or DOCX up to 50MB</p>
                {error && <p className="text-error mt-4">{error}</p>}
              </div>
            )}
            
            {loading && (
              <div className="text-center self-center flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-primary font-body-ui">Analyzing document...</p>
              </div>
            )}

            {results && (
              <article className="max-w-3xl w-full bg-surface-container p-12 shadow-sm rounded border border-outline-variant/10 font-body-ui text-on-background/90 leading-relaxed text-[15px]">
                <h2 className="font-display-md text-display-md text-center font-bold mb-8 text-on-surface tracking-tight">
                  DOCUMENT ANALYSIS: {results.analysis_overview?.document_type?.toUpperCase() || 'DOCUMENT'}
                </h2>
                
                <p className="mb-6 text-justify">{results.summary}</p>

                {results.key_clauses && results.key_clauses.map((clause, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-bold mt-8 mb-4 text-on-surface">{clause.section || 'Extracted Clause'}</h3>
                    <p className="mb-4 text-justify">{clause.explanation}</p>
                    <div className={`relative p-4 border-l-2 rounded-r ${clause.is_risky ? 'border-error-container bg-error-container/5' : 'border-primary bg-primary/5'}`}>
                      {clause.is_risky && <span className="absolute -left-2 -top-2 w-4 h-4 bg-error text-error-container rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">!</span>}
                      <p className="text-justify font-data-tabular text-data-tabular">"{clause.text}"</p>
                    </div>
                  </div>
                ))}
              </article>
            )}
          </div>
        </section>

        {/* Right Pane: AI Insights Sidebar (40%) */}
        <section className="w-[40%] flex flex-col gap-component-gap h-full">
          {/* Top: Executive Summary */}
          <div className="bg-surface-container/60 backdrop-blur-md border border-outline-variant/20 rounded p-4 shadow-sm flex-shrink-0">
            <div className="flex items-center justify-between mb-4 border-b border-outline-variant/20 pb-2">
              <h3 className="font-label-caps text-label-caps text-primary flex items-center gap-2">
                <div className="pulse-dot"></div>
                AI Executive Summary
              </h3>
            </div>
            <div className="space-y-3 font-body-fixed text-body-fixed text-on-surface-variant">
              {results ? (
                results.risks?.map((risk, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className={`material-symbols-outlined text-[16px] shrink-0 mt-0.5 ${risk.severity_level === 'high' ? 'text-error' : risk.severity_level === 'low' ? 'text-primary' : 'text-tertiary'}`}>
                      {risk.severity_level === 'high' ? 'warning' : risk.severity_level === 'low' ? 'verified' : 'info'}
                    </span>
                    <p><strong>{risk.risk_title}:</strong> {risk.why_this_is_risky}</p>
                  </div>
                )) || <p>No significant risks identified.</p>
              ) : (
                <p>Upload a document to view AI insights.</p>
              )}
            </div>
          </div>

          {/* Bottom: Identified Entities (Expands) */}
          <div className="bg-surface-container/40 border border-outline-variant/20 rounded p-4 flex-grow flex flex-col min-h-[150px]">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-3 border-b border-outline-variant/20 pb-2">Analysis Overview</h3>
            <div className="flex flex-col gap-3 overflow-y-auto">
              {results ? (
                <>
                  <div>
                    <span className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest mb-1 block">Context</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-surface-variant text-on-surface font-data-tabular text-data-tabular rounded border border-outline-variant/30 flex items-center gap-1">
                        Signer: {results.analysis_overview?.signer_context || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest mb-1 block">Risk</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-secondary-container/30 text-secondary font-data-tabular text-data-tabular rounded border border-secondary/20">
                        Score: {results.analysis_overview?.risk_score || 'N/A'}
                      </span>
                      <span className="px-2 py-1 bg-secondary-container/30 text-secondary font-data-tabular text-data-tabular rounded border border-secondary/20">
                        Readability: {results.analysis_overview?.readability_band || 'N/A'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-on-surface-variant text-sm text-center mt-4">Waiting for document analysis</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Analyzer;
