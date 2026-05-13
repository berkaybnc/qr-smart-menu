import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBranding } from '../context/BrandingContext';

const CustomerCampaigns = () => {
  const { primaryColor } = useBranding();
  const navigate = useNavigate();
  const location = useLocation();
  const campaigns = location.state?.campaigns || [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black font-headline tracking-tighter text-on-surface">Digital Curations</h2>
      </div>

      <div className="space-y-6">
        {campaigns.length === 0 ? (
           <p className="text-sm font-body text-on-surface-variant leading-relaxed text-center py-10 opacity-60">There are no exclusive experiences curated at this time. Please check back later.</p>
        ) : (
           campaigns.map((camp, index) => (
             <div key={camp.id} className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-2xl shadow-on-surface-variant/5 relative overflow-hidden">
                {index === 0 && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>}
                <h3 className="text-2xl font-bold font-headline text-on-surface mb-2">{camp.title}</h3>
                <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-6">Gain access to specialized seasonal menus and exclusive offerings curated dynamically by the Executive Chef team.</p>
                <button 
                  className="w-full py-4 text-white font-headline font-bold rounded-full shadow-lg hover:shadow-xl transition-all uppercase tracking-widest text-sm" 
                  style={{ backgroundColor: primaryColor }}
                >
                  Redeem Experience
                </button>
             </div>
           ))
        )}
      </div>

      <div className="mt-12 text-center pb-8 border-t border-surface-container-high pt-12">
        <button 
           onClick={() => navigate(-1)} 
           className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors py-4 px-8 rounded-full bg-surface-container-highest shadow-sm active:scale-95"
        >
           &larr; Return to Main Menu
        </button>
      </div>
    </div>
  );
};

export default CustomerCampaigns;
