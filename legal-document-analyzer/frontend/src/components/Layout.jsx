import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children, user, onLogout }) => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SideNavBar */}
      <nav className="fixed left-0 top-0 h-screen w-64 border-r border-outline-variant/20 bg-surface-container/60 backdrop-blur-xl flex flex-col py-gutter px-4 z-50">
        <div className="mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
            </div>
            <div>
              <h1 className="font-display-md text-display-md font-bold tracking-tight text-primary">LexiCore AI</h1>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Legal Intelligence</p>
            </div>
          </div>
          <Link to="/analyze" className="mt-4 w-full bg-primary hover:bg-primary/90 text-on-primary font-body-ui text-body-ui font-medium py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Analysis
          </Link>
        </div>

        <ul className="flex-1 flex flex-col gap-1">
          <li>
            <Link to="/" className={`flex items-center gap-3 px-3 py-2 rounded font-body-ui text-body-ui ${path === '/' ? 'text-primary font-bold border-r-2 border-primary bg-primary/5' : 'text-on-surface-variant font-medium hover:bg-white/5 hover:text-on-surface transition-colors duration-200'}`}>
              <span className="material-symbols-outlined" style={path === '/' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
              Command Center
            </Link>
          </li>
          <li>
            <Link to="/analyze" className={`flex items-center gap-3 px-3 py-2 rounded font-body-ui text-body-ui ${path === '/analyze' ? 'text-primary font-bold border-r-2 border-primary bg-primary/5' : 'text-on-surface-variant font-medium hover:bg-white/5 hover:text-on-surface transition-colors duration-200'}`}>
              <span className="material-symbols-outlined" style={path === '/analyze' ? { fontVariationSettings: "'FILL' 1" } : {}}>analytics</span>
              Analysis Studio
            </Link>
          </li>
          <li>
            <Link to="/vault" className={`flex items-center gap-3 px-3 py-2 rounded font-body-ui text-body-ui ${path === '/vault' ? 'text-primary font-bold border-r-2 border-primary bg-primary/5' : 'text-on-surface-variant font-medium hover:bg-white/5 hover:text-on-surface transition-colors duration-200'}`}>
              <span className="material-symbols-outlined" style={path === '/vault' ? { fontVariationSettings: "'FILL' 1" } : {}}>account_balance_wallet</span>
              Vault
            </Link>
          </li>
        </ul>

        <ul className="mt-auto flex flex-col gap-1 pt-4 border-t border-outline-variant/20">
          <li>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded text-on-surface-variant font-medium hover:bg-white/5 hover:text-error transition-colors duration-200 font-body-ui text-body-ui">
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <div className="flex-1 ml-64 flex flex-col min-h-screen relative overflow-hidden">
        {/* TopAppBar */}
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 border-b border-outline-variant/20 bg-surface/40 backdrop-blur-md shadow-sm flex items-center justify-between px-gutter z-40">
          <div className="flex items-center gap-6 flex-1">
            {/* Empty space where search used to be */}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-on-surface-variant font-body-ui text-[14px]">
              <span>Welcome,</span>
              <span className="text-primary font-bold">{user?.username || 'User'}</span>
            </div>
          </div>
        </header>

        <div className="pt-16 p-container-padding flex-1 overflow-y-auto flex flex-col custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
