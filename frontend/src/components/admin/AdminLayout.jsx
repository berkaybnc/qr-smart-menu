import React from 'react';
import { Link } from 'react-router-dom';
import { useBranding } from '../../context/BrandingContext';
import { Toaster } from 'react-hot-toast';

const AdminLayout = ({ children, title = "Admin Panel", activeTab = "dashboard" }) => {
  const { ownerAvatarUrl, primaryColor } = useBranding();
  const dynamicRestaurantName = localStorage.getItem('tenantName') || 'Curator Suite';
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/20 min-h-screen flex overflow-hidden">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1c1a', color: '#fff', borderRadius: '12px' } }} />
      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#faf9f6] dark:bg-[#1a1c1a] flex-col py-8 gap-2 z-40 hidden md:flex border-r border-surface-container-high/50">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            {ownerAvatarUrl ? (
                <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center border border-outline-variant/20 shadow-sm bg-white shrink-0">
                   <img src={ownerAvatarUrl} alt="Owner Avatar" className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: primaryColor ? `${primaryColor}20` : '#f0f0f0' }}>
                  <span className="material-symbols-outlined" style={{ color: primaryColor, fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                </div>
            )}
            <div className="min-w-0">
              <h1 className="text-lg font-black text-[#1a1c1a] dark:text-[#faf9f6] leading-none font-headline tracking-tighter truncate max-w-[140px]">{dynamicRestaurantName}</h1>
              <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold mt-1" style={{ color: primaryColor }}>Admin Suite</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon="dashboard" label="Dashboard" active={activeTab === 'dashboard'} to="/admin" primaryColor={primaryColor} />
          <NavItem icon="inventory_2" label="Products" active={activeTab === 'products'} to="/admin/products" primaryColor={primaryColor} />
          <NavItem icon="campaign" label="Campaigns" active={activeTab === 'campaigns'} to="/admin/campaigns" primaryColor={primaryColor} />
          <NavItem icon="qr_code_2" label="QR Designer" active={activeTab === 'qr'} to="/admin/qr" primaryColor={primaryColor} />
          <NavItem icon="palette" label="Branding" active={activeTab === 'branding'} to="/admin/branding" primaryColor={primaryColor} />
          <NavItem icon="settings" label="Settings" active={activeTab === 'settings'} to="/admin/settings" primaryColor={primaryColor} />
        </nav>

        <div className="px-6 mt-auto border-t border-surface-container-high pt-6">
          <button 
             onClick={() => { localStorage.removeItem('adminAuth'); window.location.href = '/login'; }}
             className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-error/10 text-error/80 hover:bg-error hover:text-white transition-colors text-xs font-bold tracking-widest uppercase font-headline"
          >
             <span className="material-symbols-outlined text-sm">logout</span>
             Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Component */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-lg border-t border-surface-container-high/50 md:hidden z-50 flex justify-around items-center h-20 px-4">
          <MobileNav icon="dashboard" label="Dash" active={activeTab === 'dashboard'} to="/admin" primaryColor={primaryColor} />
          <MobileNav icon="inventory_2" label="Items" active={activeTab === 'products'} to="/admin/products" primaryColor={primaryColor} />
          
          <div className="relative -top-6">
              <button 
                  className="w-14 h-14 text-white rounded-full flex items-center justify-center shadow-lg shadow-black/10 active:scale-90 transition-transform"
                  style={{ backgroundColor: primaryColor }}
              >
                  <span className="material-symbols-outlined">add</span>
              </button>
          </div>
          
          <MobileNav icon="palette" label="Brand" active={activeTab === 'branding'} to="/admin/branding" primaryColor={primaryColor} />
          <MobileNav icon="qr_code_2" label="QR" active={activeTab === 'qr'} to="/admin/qr" primaryColor={primaryColor} />
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 h-screen flex flex-col relative overflow-y-auto overflow-x-hidden bg-background">
        <header className="bg-surface/80 backdrop-blur-xl sticky top-0 z-30 flex justify-between items-center w-full px-6 md:px-10 py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-on-surface font-headline tracking-tighter">{title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all duration-300">
               <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            </button>
          </div>
        </header>

        {/* Injected Content */}
        <div className="flex-1 flex flex-col pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, to, primaryColor }) => {
  if (active) {
    return (
      <Link to={to} className="flex items-center gap-3 px-6 py-3 bg-surface-container-low rounded-r-full font-headline font-semibold text-sm transition-transform duration-300 relative" style={{ color: primaryColor }}>
        <span className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full" style={{ backgroundColor: primaryColor }}></span>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        {label}
      </Link>
    );
  }

  return (
    <Link to={to} className="flex items-center gap-3 px-6 py-3 text-on-surface-variant/60 font-headline font-semibold text-sm hover:translate-x-1 hover:text-on-surface transition-all duration-300">
      <span className="material-symbols-outlined">{icon}</span>
      {label}
    </Link>
  );
};

const MobileNav = ({ icon, label, active, to, primaryColor }) => {
    return (
        <Link to={to} className={`flex flex-col items-center gap-1 ${!active ? 'text-on-surface-variant/60' : ''}`} style={active ? { color: primaryColor } : {}}>
            <span className="material-symbols-outlined" style={active ? {fontVariationSettings: "'FILL' 1"} : {}}>{icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
        </Link>
    );
};

export default AdminLayout;
