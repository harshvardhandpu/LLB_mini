import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

function Dashboard({ user, onLogout }) {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({ risk_atlas: { high: 0, medium: 0, low: 0 }, active_ingestions: 0, active_tasks: [], intelligence_feed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [docsRes, statsRes] = await Promise.all([
          fetch('http://localhost:5001/api/analyses', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5001/api/dashboard/stats', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        if (docsRes.ok) {
          const docsData = await docsRes.json();
          setDocuments((docsData.analyses || []).slice(0, 5));
        }
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="grid grid-cols-12 gap-gutter h-[400px]">
        <section className="col-span-3 glass-panel rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/50">
            <h2 className="font-label-caps text-label-caps text-primary">Active Ingestions</h2>
            <span className="font-data-tabular text-data-tabular text-on-surface-variant">{stats.active_ingestions} Tasks</span>
          </div>
          <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            {stats.active_ingestions === 0 || !stats.active_tasks?.length ? (
               <div className="flex-1 flex items-center justify-center text-on-surface-variant font-body-ui text-[12px]">No active ingestions</div>
            ) : (
               stats.active_tasks.map((task, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-end">
                    <span className="font-body-fixed text-body-fixed text-on-surface truncate pr-2">{task.name}</span>
                    <span className="font-data-tabular text-data-tabular text-tertiary">{task.progress}%</span>
                  </div>
                  <div className="h-1 w-full bg-surface-variant rounded-full overflow-hidden">
                    <div className={`h-full w-[${task.progress}%] relative bg-${task.color || 'primary'}`}>
                      <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                  <div className="font-data-tabular text-[10px] text-on-surface-variant">{task.status}...</div>
                </div>
               ))
            )}
          </div>
        </section>

        <section className="col-span-5 glass-panel rounded-lg flex flex-col overflow-hidden relative">
          <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/50">
            <h2 className="font-label-caps text-label-caps text-primary">Risk Atlas Overview</h2>
            <div className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-error self-center"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary self-center"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary self-center"></span>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="flex-1 flex flex-col justify-center gap-8 mb-4">
              <div className="bg-surface-container-high/30 border border-outline-variant/20 rounded p-6 text-center shadow-sm">
                <div className="font-display-md text-display-md text-error mb-2 text-4xl">{stats.risk_atlas?.high || 0}</div>
                <div className="font-label-caps text-label-caps text-on-surface-variant">High Risk Documents</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-high/30 border border-outline-variant/20 rounded p-4 text-center">
                  <div className="font-display-md text-display-md text-tertiary mb-1 text-2xl">{stats.risk_atlas?.medium || 0}</div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant">Medium Risk</div>
                </div>
                <div className="bg-surface-container-high/30 border border-outline-variant/20 rounded p-4 text-center">
                  <div className="font-display-md text-display-md text-primary mb-1 text-2xl">{stats.risk_atlas?.low || 0}</div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant">Low Risk</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="col-span-4 glass-panel rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/50">
            <h2 className="font-label-caps text-label-caps text-primary">AI Intelligence Feed</h2>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">rss_feed</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
            {!stats.intelligence_feed?.length ? (
              <div className="flex-1 flex items-center justify-center text-on-surface-variant font-body-ui text-[12px]">No recent intelligence</div>
            ) : (
              stats.intelligence_feed.map((feed, idx) => (
                <div key={idx} className={`bg-surface-container-high/40 border border-${feed.color}/20 rounded p-3 hover:bg-surface-container-high/60 transition-colors cursor-pointer`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full bg-${feed.color} ${feed.color === 'error' ? 'ai-pulse' : ''}`}></div>
                    <span className={`font-label-caps text-label-caps text-${feed.color}`}>{feed.type}</span>
                    <span className="font-data-tabular text-[10px] text-on-surface-variant ml-auto">{feed.time}</span>
                  </div>
                  <p className="font-body-ui text-body-ui text-on-surface mb-2 leading-relaxed">{feed.message}</p>
                  <div className="flex gap-2">
                    {feed.tags.map((tag, tIdx) => (
                      <span key={tIdx} className={`font-data-tabular text-[10px] ${tIdx === 0 && feed.color === 'error' ? 'bg-error/10 text-error border border-error/20' : 'bg-surface-variant text-on-surface-variant'} px-1.5 py-0.5 rounded`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="glass-panel rounded-lg flex flex-col flex-1 mt-gutter min-h-[300px]">
        <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/50">
          <h2 className="font-label-caps text-label-caps text-primary">Recent Vault Activity</h2>
          <Link to="/vault" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
            View Full Vault <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-4 border-b border-outline-variant/20 bg-surface-container/30">Document ID</th>
                <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-4 border-b border-outline-variant/20 bg-surface-container/30">Title</th>
                <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-4 border-b border-outline-variant/20 bg-surface-container/30 text-right">Date Added</th>
              </tr>
            </thead>
            <tbody className="font-data-tabular text-data-tabular">
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-on-surface-variant">Loading recent activity...</td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-on-surface-variant">No recent documents found.</td>
                </tr>
              ) : (
                documents.map((doc, idx) => (
                  <tr key={doc.id || idx} className="hover:bg-white/5 transition-colors border-b border-outline-variant/10">
                    <td className="py-2.5 px-4 text-primary">DOC-{doc.id ? doc.id.slice(-4) : 'NEW'}</td>
                    <td className="py-2.5 px-4 text-on-surface">{doc.file_name}</td>
                    <td className="py-2.5 px-4 text-right text-on-surface-variant">{new Date(doc.created_at).toLocaleDateString()} {new Date(doc.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}

export default Dashboard;
