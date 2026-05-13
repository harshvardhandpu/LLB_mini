import { useState, useEffect } from 'react';
import Layout from './Layout';

function Vault({ user, onLogout }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/analyses', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        setDocuments(data.analyses || []);
      } catch (err) {
        console.error("Failed to fetch vault", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const [riskFilter, setRiskFilter] = useState('All');

  const getRiskColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'high': return 'bg-error/10 text-error border-error/30';
      case 'medium': return 'bg-tertiary/10 text-tertiary border-tertiary/30';
      case 'low': return 'bg-primary/10 text-primary border-primary/30';
      default: return 'bg-surface-container-high text-on-surface-variant border-outline-variant/30';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (riskFilter === 'All') return true;
    return doc.risk_level?.toLowerCase() === riskFilter.toLowerCase();
  });

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="flex-1 flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-3 rounded-lg">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select 
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="appearance-none bg-surface-container border border-outline-variant/30 rounded pl-3 pr-8 py-1.5 font-body-ui text-body-ui text-on-surface focus:outline-none focus:border-primary/50"
              >
                <option value="All">Any Risk Level</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">expand_more</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant text-sm">
            {filteredDocuments.length} Documents
          </div>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-component-gap">
          {loading ? (
            <div className="col-span-full text-center text-on-surface-variant py-10">Loading Vault...</div>
          ) : filteredDocuments.length === 0 ? (
            <div className="col-span-full text-center text-on-surface-variant py-10">No documents found matching the criteria.</div>
          ) : (
            filteredDocuments.map((doc, i) => (
              <div key={doc.id || i} className="glass-panel rounded-lg p-4 flex flex-col gap-3 group hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-xl ${doc.file_name?.endsWith('.pdf') ? 'text-error' : 'text-primary'}`}>
                      {doc.file_name?.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                    </span>
                    <h3 className="font-body-ui text-body-ui font-semibold text-on-surface truncate pr-2" title={doc.file_name}>{doc.file_name}</h3>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-data-tabular border ${getRiskColor(doc.risk_level)} capitalize`}>
                    {doc.risk_level || 'Unknown'} Risk
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-data-tabular bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
                    {doc.document_type || 'Document'}
                  </span>
                </div>
                <div className="mt-auto pt-3 border-t border-outline-variant/20 flex justify-between items-center text-on-surface-variant font-data-tabular text-data-tabular text-[10px]">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">schedule</span> Analyzed: {new Date(doc.created_at).toLocaleDateString()}</span>
                  <span>{(doc.document_size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Vault;
