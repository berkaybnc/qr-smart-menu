import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBranding } from '../../context/BrandingContext';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const Settings = () => {
  const { primaryColor, currency, setCurrency, ownerAvatarUrl, setOwnerAvatarUrl } = useBranding();
  const [restaurantName, setRestaurantName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  
  const [locationCity, setLocationCity] = useState('Istanbul, TR');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
       try {
           const res = await api.get('/admin/restaurant');
           if (res.data) {
               if (res.data.name) setRestaurantName(res.data.name);
               if (res.data.ownerName) setOwnerName(res.data.ownerName);
               // Removed local setOwnerAvatarUrl, it's synced globally now via context.
               if (res.data.currency) setCurrency(res.data.currency);
               if (res.data.locationCity) setLocationCity(res.data.locationCity);
               if (res.data.instagram) setInstagram(res.data.instagram);
               if (res.data.whatsapp) setWhatsapp(res.data.whatsapp);
               if (res.data.operatingHours) {
                   try { setDays(JSON.parse(res.data.operatingHours)); } catch(e) {}
               }
               
               localStorage.setItem('tenantName', res.data.name || '');
           }
       } catch (e) {
           console.error('Settings init error:', e);
       }
    };
    fetchSettings();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    try {
        const res = await api.post('/admin/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setOwnerAvatarUrl(res.data.imageUrl);
    } catch(err) {
        console.error("Upload error", err);
    }
  };

  const [days, setDays] = useState([
    { name: 'Monday', active: true, start: '10:00', end: '23:00' },
    { name: 'Tuesday', active: true, start: '10:00', end: '23:00' },
    { name: 'Wednesday', active: true, start: '10:00', end: '23:00' },
    { name: 'Thursday', active: true, start: '10:00', end: '23:00' },
    { name: 'Friday', active: true, start: '10:00', end: '01:00' },
    { name: 'Saturday', active: true, start: '10:00', end: '01:00' },
    { name: 'Sunday', active: false, start: '00:00', end: '00:00' }
  ]);

  const toggleDay = (idx) => {
    const newDays = [...days];
    newDays[idx].active = !newDays[idx].active;
    setDays(newDays);
  };

  const handleTimeChange = (idx, field, value) => {
    const newDays = [...days];
    newDays[idx][field] = value;
    setDays(newDays);
  };

  const handleSave = async () => {
    try {
        setIsSaving(true);
        // Persist profile safely to Backend Tenant architecture
        await api.put('/admin/restaurant', {
            name: restaurantName,
            currency: currency,
            ownerName: ownerName,
            ownerAvatarUrl: ownerAvatarUrl,
            locationCity: locationCity,
            instagram: instagram,
            whatsapp: whatsapp,
            operatingHours: JSON.stringify(days)
        });
        localStorage.setItem('tenantName', restaurantName);
        
        toast.success('Settings synchronized successfully');

        // Simulating artificial delay for UI feedback
        setTimeout(() => setIsSaving(false), 800);
    } catch (error) {
        console.error('Failed to update Settings', error);
        toast.error('Failed to update Settings');
        setIsSaving(false);
    }
  };

  return (
    <AdminLayout title="Configuration" activeTab="settings">
      <div className="px-6 md:px-10 pb-20 max-w-[900px] mx-auto w-full">
        {/* Page Top Header */}
        <div className="flex items-center justify-between mb-8 mt-2">
           <h2 className="text-3xl font-black font-headline tracking-tighter text-on-surface">Settings</h2>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="px-10 py-4 rounded-full text-white font-headline font-bold text-sm active:scale-95 transition-all shadow-lg hover:shadow-xl"
             style={{ 
               backgroundColor: primaryColor,
               boxShadow: `0 10px 25px -5px ${primaryColor}60`
             }}
           >
             {isSaving ? 'Syncing...' : 'Save Changes'}
           </button>
        </div>

        <div className="space-y-12">
          
          {/* Section: Business Profile */}
          <section className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_40px_60px_-15px_rgba(88,66,58,0.04)]">
             <h3 className="font-headline font-bold text-on-surface-variant text-sm uppercase tracking-widest mb-6 border-b border-surface-container-high pb-4">Business Profile</h3>
             <div className="space-y-6">
                
                <div className="flex items-center gap-6 mb-6">
                   <div className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-outline-variant/30 flex items-center justify-center bg-surface-container-highest hover:bg-surface-container-high transition-colors cursor-pointer overflow-hidden shadow-sm group pl-0">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageUpload} accept="image/*" />
                      {ownerAvatarUrl ? (
                          <img src={ownerAvatarUrl} alt="Avatar" className="absolute inset-0 w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                      ) : (
                          <>
                            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-3xl">account_circle</span>
                          </>
                      )}
                      
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-white text-sm">edit</span>
                      </div>
                   </div>
                   <div>
                       <h4 className="font-bold font-headline text-on-surface text-sm">Owner Avatar</h4>
                       <p className="text-xs text-on-surface-variant max-w-[200px] mt-1">Upload a professional portrait to personalize your management dashboard.</p>
                   </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col gap-2 w-full md:w-1/2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Restaurant Name</label>
                      <input 
                        type="text" 
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-inner focus:outline-none w-full text-on-surface transition-all" 
                        onFocus={(e) => e.target.style.borderColor = primaryColor}
                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-1/2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Business Owner Name</label>
                      <input 
                        type="text" 
                        value={ownerName}
                        placeholder="John Doe"
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-inner focus:outline-none w-full text-on-surface transition-all" 
                        onFocus={(e) => e.target.style.borderColor = primaryColor}
                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                      />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col gap-2 w-full md:w-1/2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Location City</label>
                      <input 
                        type="text" 
                        value={locationCity}
                        onChange={(e) => setLocationCity(e.target.value)}
                        className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-inner focus:outline-none w-full text-on-surface transition-all" 
                        onFocus={(e) => e.target.style.borderColor = primaryColor}
                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                        placeholder="Istanbul, TR" 
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-1/2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Default Currency</label>
                      <select 
                         value={currency}
                         onChange={(e) => setCurrency(e.target.value)}
                         className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-inner focus:outline-none w-full appearance-none cursor-pointer transition-all"
                         onFocus={(e) => e.target.style.borderColor = primaryColor}
                         onBlur={(e) => e.target.style.borderColor = 'transparent'}
                      >
                        <option value="TRY">TRY (₺)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                </div>
             </div>
          </section>

          {/* Section: Operating Hours */}
          <section className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_40px_60px_-15px_rgba(88,66,58,0.04)]">
             <div className="mb-6 border-b border-surface-container-high pb-4">
                 <h3 className="font-headline font-bold text-on-surface-variant text-sm uppercase tracking-widest mb-1">Operating Hours</h3>
                 <p className="text-xs text-on-surface-variant opacity-70">Define when your business accepts live digital orders.</p>
             </div>
             <div className="space-y-3">
               {days.map((day, idx) => (
                 <div key={day.name} className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl transition-colors ${day.active ? 'bg-surface-container-low' : 'bg-surface-container-highest/30 opacity-60'}`}>
                    <div className="flex items-center gap-4 mb-4 md:mb-0 w-48">
                      {/* Minimalist custom toggle */}
                      <div 
                         className="w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors shadow-inner"
                         style={{ backgroundColor: day.active ? primaryColor : '#dbdad7' }}
                         onClick={() => toggleDay(idx)}
                      >
                         <div className={`w-4 h-4 rounded-full bg-white transition-transform ${day.active ? 'translate-x-4 shadow-sm' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="font-bold text-sm text-on-surface font-headline">{day.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-1 md:justify-end opacity-100 transition-opacity" style={{ opacity: day.active ? 1 : 0.4 }}>
                       <input 
                         type="time" 
                         disabled={!day.active}
                         className="bg-surface-container-highest rounded-lg p-2 px-3 border-none text-sm font-bold font-body text-on-surface focus:outline-none cursor-pointer" 
                         value={day.start} 
                         onChange={(e) => handleTimeChange(idx, 'start', e.target.value)}
                       />
                       <span className="text-on-surface-variant text-sm">—</span>
                       <input 
                         type="time" 
                         disabled={!day.active}
                         className="bg-surface-container-highest rounded-lg p-2 px-3 border-none text-sm font-bold font-body text-on-surface focus:outline-none cursor-pointer" 
                         value={day.end} 
                         onChange={(e) => handleTimeChange(idx, 'end', e.target.value)}
                       />
                    </div>
                 </div>
               ))}
             </div>
          </section>

          {/* Section: Digital Presence */}
          <section className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_40px_60px_-15px_rgba(88,66,58,0.04)]">
             <div className="mb-6 border-b border-surface-container-high pb-4">
                 <h3 className="font-headline font-bold text-on-surface-variant text-sm uppercase tracking-widest mb-1">Digital Presence</h3>
                 <p className="text-xs text-on-surface-variant opacity-70">Social links appearing in the customer mobile footer.</p>
             </div>
             <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Instagram Handle</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant opacity-50">@</span>
                    <input 
                      type="text" 
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="bg-surface-container-high rounded-xl p-4 pl-10 border-none text-sm font-body shadow-inner focus:ring-0 focus:outline-none w-full text-on-surface" 
                      placeholder="nexmenu" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">WhatsApp Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant opacity-50">+90</span>
                    <input 
                      type="tel" 
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="bg-surface-container-high rounded-xl p-4 pl-12 border-none text-sm font-body shadow-inner focus:ring-0 focus:outline-none w-full text-on-surface" 
                      placeholder="555 123 4567" 
                    />
                  </div>
                </div>
             </div>
          </section>

        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
