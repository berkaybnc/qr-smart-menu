import React, { useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBranding } from '../../context/BrandingContext';
import toast from 'react-hot-toast';

const BrandingEngine = () => {
  const { primaryColor, setPrimaryColor, restaurantLogo, setRestaurantLogo, logoBorderRadius, setLogoBorderRadius, darkMode, setDarkMode } = useBranding();
  const fileInputRef = useRef(null);

  const predefinedColors = [
    '#a93702', // Orange (Default)
    '#45645e', // Tertiary Green
    '#1a1c1a', // Charcoal
    '#7a9b93', // Muted Green
    '#0060a8', // Deep Blue
    '#703164'  // Aubergine
  ];

  const getRadiusStyle = (key) => key === 'none' ? '0px' : key === 'md' ? '0.75rem' : '9999px';

  // Real handle logo upload to API
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      try {
          const api = (await import('../../api/axiosInstance')).default;
          const res = await api.post('/admin/upload', formData);
          setRestaurantLogo(res.data.imageUrl);
      } catch(e) {
          console.error("Upload error", e);
          const reader = new FileReader();
          reader.onloadend = () => {
            setRestaurantLogo(reader.result);
          };
          reader.readAsDataURL(file);
      }
    }
  };

  return (
    <AdminLayout title="Branding Engine" activeTab="branding">
      <div className="px-6 md:px-10 pb-20 flex-1 flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Controls */}
        <div className="w-full md:w-1/2 lg:w-7/12 space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface font-headline">Appearance Settings</h2>
            <p className="text-sm text-on-surface-variant mt-1">Define your visual signature instantly across all customer touchpoints.</p>
          </div>

          {/* Color Palette Container */}
          <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_40px_60px_-15px_rgba(88,66,58,0.05)] border border-surface-container-low">
            <label className="text-sm font-bold text-on-surface tracking-widest uppercase font-headline">Primary Brand Color</label>
            <p className="text-xs text-on-surface-variant/70 mb-6 mt-1">Select the dominant accent color for CTAs, highlights, and borders.</p>
            
            <div className="flex flex-wrap gap-4 items-center">
              {/* Custom Color Input Wrapper */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-inner border border-surface-container-high shrink-0 hover:scale-105 transition-transform cursor-pointer group">
                 <input 
                   type="color" 
                   value={primaryColor} 
                   onChange={(e) => setPrimaryColor(e.target.value)} 
                   className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer pointer-events-auto"
                 />
                 <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-sm">edit</span>
                 </div>
              </div>

              {/* Predefined Color Dots */}
              {predefinedColors.map(color => (
                <button 
                  key={color}
                  onClick={() => setPrimaryColor(color)}
                  className={`w-10 h-10 rounded-full transition-all duration-300 ${primaryColor === color ? 'ring-4 ring-offset-2 ring-offset-surface' : 'hover:scale-110'}`}
                  style={{ 
                    backgroundColor: color, 
                    boxShadow: primaryColor === color ? `0 0 0 2px var(--surface), 0 0 0 6px ${primaryColor}` : undefined 
                  }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>

            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-surface-container-low rounded-full">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Selected HEX:</span>
              <span className="text-xs font-mono font-bold text-on-surface">{primaryColor.toUpperCase()}</span>
            </div>
          </div>

          {/* Logo Upload Container */}
          <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_40px_60px_-15px_rgba(88,66,58,0.05)] border border-surface-container-low">
            <div className="flex justify-between items-start mb-6">
              <div>
                <label className="text-sm font-bold text-on-surface tracking-widest uppercase font-headline">Brand Mark (Logo)</label>
                <p className="text-xs text-on-surface-variant/70 mt-1">Recommended: Square PNG/SVG at least 512x512px.</p>
              </div>
              {restaurantLogo && (
                <button onClick={() => setRestaurantLogo(null)} className="text-[10px] text-error font-bold uppercase tracking-widest hover:underline">Remove</button>
              )}
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center bg-surface hover:bg-surface-container-low transition-colors cursor-pointer group mb-6"
              style={{ borderColor: restaurantLogo ? primaryColor : 'rgba(var(--color-outline-variant), 0.3)' }}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3 group-hover:text-primary transition-colors group-hover:scale-110 duration-300">cloud_upload</span>
              <p className="text-xs font-bold text-on-surface">Click to upload logo</p>
            </div>

            {/* Current Logo Display */}
            {restaurantLogo && (
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/10 flex flex-col items-center justify-center gap-2 w-max mx-auto shadow-sm">
                 <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest">Active Logo</span>
                 <img src={restaurantLogo} alt="Restaurant Logo" className="h-16 w-16 object-cover shadow-md" style={{ borderRadius: getRadiusStyle(logoBorderRadius) }} />
              </div>
            )}

            <div className="mt-8">
              <label className="text-xs font-bold text-on-surface mb-3 block uppercase tracking-widest">Logo Framing Shape</label>
              <div className="flex gap-4">
                 {['none', 'md', 'full'].map(shape => (
                    <button
                       key={shape}
                       onClick={() => setLogoBorderRadius(shape)}
                       className={`flex-1 flex flex-col items-center gap-2 p-3 border-2 rounded-xl transition-all ${logoBorderRadius === shape ? 'bg-primary/5' : 'border-surface-container-high hover:border-surface-container-highest'}`}
                       style={{ borderColor: logoBorderRadius === shape ? primaryColor : undefined }}
                    >
                       <div className="w-8 h-8 bg-surface-container-highest" style={{ borderRadius: getRadiusStyle(shape) }}></div>
                       <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{shape === 'none' ? 'Sharp' : shape === 'md' ? 'Modern' : 'Fluid'}</span>
                    </button>
                 ))}
              </div>
            </div>
          </div>
          
          {/* Interface Mode Container */}
          <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_40px_60px_-15px_rgba(88,66,58,0.05)] border border-surface-container-low mb-8 relative overflow-hidden">
            <div className="flex items-center justify-between z-10 relative">
               <div>
                  <h3 className="text-sm font-bold text-on-surface tracking-widest uppercase font-headline">Interface Theme Mode</h3>
                  <p className="text-xs text-on-surface-variant/70 mt-1 max-w-[200px] md:max-w-none">Instantly toggle dark mode mapping across the customer facing web app.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer group/toggle shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
                  <div className="w-14 h-8 bg-surface-container-highest rounded-full shadow-inner transition-all peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-sm flex items-center justify-between px-2" style={darkMode ? { backgroundColor: primaryColor } : {}}>
                     <span className="material-symbols-outlined text-[10px] text-white opacity-100 peer-checked:opacity-0 transition-opacity">light_mode</span>
                     <span className="material-symbols-outlined text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity">dark_mode</span>
                  </div>
               </label>
            </div>
            {/* Visual background gradient for theme mock */}
            <div className={`absolute top-0 right-0 bottom-0 w-32 blur-[50px] rounded-full translate-x-12 transition-colors duration-1000 -z-0 ${darkMode ? 'bg-primary/20' : 'bg-primary/5'}`}></div>
          </div>
          
          <div className="flex justify-end pt-4 pb-12">
             <button 
                 onClick={async () => {
                     const api = (await import('../../api/axiosInstance')).default;
                     try {
                         await api.put('/admin/restaurant', { primaryColor, logoUrl: restaurantLogo, logoBorderRadius, darkMode });
                         toast.success('Branding Identity Saved');
                     } catch(e) {
                         toast.error('Failed to sync changes.');
                     }
                 }}
                 style={{ 
                   backgroundColor: primaryColor,
                   boxShadow: `0 10px 25px -5px ${primaryColor}60`
                 }}
                 className="px-10 py-4 text-white rounded-full font-headline font-bold uppercase tracking-widest shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all"
             >
                Publish Changes
             </button>
          </div>
        </div>

        {/* Right Side: Live Mobile Preview */}
        <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col items-center relative lg:sticky lg:top-24 h-max pb-12">
          <div className="w-full text-center mb-6">
            <h3 className="text-xl font-bold tracking-tight text-on-surface font-headline">Live Preview</h3>
            <p className="text-xs text-on-surface-variant">Real-time sync via Context</p>
          </div>

          {/* Phone Frame Wrapper */}
          <div className="relative w-[300px] h-[600px] bg-[#1a1c1a] rounded-[3rem] p-3 shadow-[0_50px_100px_-20px_rgba(88,66,58,0.3)] border-[8px] border-[#2f312f] scale-95 transform-gpu transition-all">
            {/* iPhone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1c1a] rounded-b-2xl z-20"></div>
            
            {/* Emulated Mobile Screen inner wrapper */}
            <div className={`w-full h-full rounded-[2.2rem] overflow-hidden relative flex flex-col inner-shadow transition-colors duration-500 ${darkMode ? 'bg-[#121212]' : 'bg-[#F9F6F0]'}`}>
               {/* Demo Top Nav */}
               <div className={`pt-10 pb-4 px-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-10 border-b transition-colors duration-500 ${darkMode ? 'bg-[#121212]/80 border-white/10' : 'bg-[#F9F6F0]/80 border-black/5'}`}>
                  <span className={`material-symbols-outlined ${darkMode ? 'text-white' : 'text-black'}`}>menu</span>
                  {restaurantLogo ? (
                    <img src={restaurantLogo} alt="Preview logo" className="h-8 w-8 object-cover shadow-sm bg-white" style={{ borderRadius: getRadiusStyle(logoBorderRadius) }} />
                  ) : (
                    <span className={`font-headline font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Logo</span>
                  )}
                  <span className={`material-symbols-outlined ${darkMode ? 'text-white' : 'text-black'}`}>shopping_bag</span>
               </div>
               
               {/* Demo Content Base */}
               <div className="px-5 py-6 space-y-6 flex-1 overflow-y-auto hide-scrollbar">
                  {/* Category Pills */}
                  <div className="flex gap-2 overflow-hidden pb-1">
                    <div className="px-4 py-2 text-white rounded-full text-[10px] font-bold whitespace-nowrap shadow-md transition-colors" style={{ backgroundColor: primaryColor }}>Starters</div>
                    <div className="px-4 py-2 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant whitespace-nowrap">Mains</div>
                    <div className="px-4 py-2 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant whitespace-nowrap">Drinks</div>
                  </div>
                  
                  {/* Item Grid Mock */}
                  <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-2">
                       <div className="aspect-square bg-surface-container-low rounded-xl overflow-hidden shadow-inner">
                         <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNZ9f4c8Rs-uUfnq2Fn84P-ButECOIZu3MDj9WQcFaaDOxPK4QQ-T0knqS9wnifeBls7alTIRuFZQH3exaDHzURgS_unosvl4BwvDJC_CUaC_Tn8He4A33U_c452tyaeoKHnNaJid6bMNNeUQ_2dVRFOlPyzumxh7xaJTjgQLanqn7r5coIP8ujZlqtAikPuZo1AMknEPvOacpv1MrTbWxMWLxzM9yf9bAdETC_1sELj2e6ssfKfJgcOhSuBUMNeo3HDxGJiwSoZo" alt="demo" className="w-full h-full object-cover" />
                       </div>
                       <div className="h-3 w-10/12 bg-surface-container-highest rounded-full"></div>
                       <div className="h-4 w-1/2 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.8 }}></div>
                     </div>
                     <div className="space-y-2">
                       <div className="aspect-square bg-surface-container-low rounded-xl overflow-hidden shadow-inner">
                         <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY1nWSTlCn0QBQixuCYiEmfADbkVXDEfQ44n10dD6ViQw20XrkLvaIBqohuyLTQYGpmiQB0TyUa8w8s648lbqPe6gdE-uUrktrON4TDATlC15EolhkM2v5o7XM--uGvp5yWgX00TwrSjuo2reRccKrAwboliBL5HpBt7J30D21NDpj6_-50VsNlIywEKX4lz3PQm1Bq7qrFKzAVCCToAh_SVFwv5_zd3s7pT70FjBwD7OBCxbjFUEBPyXtS1wript-hICmfGidTcM" alt="demo" className="w-full h-full object-cover" />
                       </div>
                       <div className="h-3 w-3/4 bg-surface-container-highest rounded-full"></div>
                       <div className="h-4 w-1/2 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.8 }}></div>
                     </div>
                  </div>
                  
                  {/* Action Button Mock */}
                  <div className="w-full py-3 mt-4 text-white rounded-full font-bold text-xs flex items-center justify-center shadow-lg transition-colors" style={{ backgroundColor: primaryColor }}>
                    Mock Button
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default BrandingEngine;
