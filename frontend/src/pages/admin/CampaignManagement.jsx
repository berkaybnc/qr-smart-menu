import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBranding } from '../../context/BrandingContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const CampaignManagement = () => {
  const { primaryColor } = useBranding();
  const [globalEnabled, setGlobalEnabled] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [activeDays, setActiveDays] = useState('7');
  const [previewImage, setPreviewImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
     const fetchCampaigns = async () => {
        try {
           const res = await api.get('/admin/campaigns');
           setCampaigns(res.data);
        } catch(e) { console.error(e); }
     };
     fetchCampaigns();
  }, []);

  const toggleStatus = async (id) => {
    try {
        const res = await api.patch(`/admin/campaigns/${id}/toggle`);
        setCampaigns(campaigns.map(c => c.id === id ? res.data : c));
        toast.success(res.data.isPopupActive ? 'Campaign Active' : 'Campaign Paused');
    } catch(e) { 
        console.error('Toggle error', e); 
        toast.error('Failed to change toggle status');
    }
  };

  const deleteCampaign = async (id) => {
    try {
        await api.delete(`/admin/campaigns/${id}`);
        setCampaigns(campaigns.filter(c => c.id !== id));
        toast.success('Campaign eliminated');
    } catch(e) { 
        console.error('Delete error', e); 
        toast.error('Failed to delete campaign');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    try {
        const res = await api.post('/admin/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setPreviewImage(res.data.imageUrl);
    } catch(err) {
        console.error("Upload error", err);
    }
  };

  const handleSaveCampaign = async () => {
      try {
          const payload = {
              title: title || 'New Campaign',
              description,
              ...(price && { price: parseFloat(price) }),
              ...(previewImage && { imageUrl: previewImage }),
              activeDays: parseInt(activeDays) || 7
          };
          if (editId) {
              const res = await api.put(`/admin/campaigns/${editId}`, payload);
              setCampaigns(campaigns.map(c => c.id === editId ? res.data : c));
          } else {
              const res = await api.post('/admin/campaigns', payload);
              setCampaigns([res.data, ...campaigns]);
          }
          setTitle('');
          setDescription('');
          setPrice('');
          setActiveDays('7');
          setPreviewImage(null);
          setEditId(null);
          setIsDrawerOpen(false);
          toast.success('Campaign live synchronization complete');
      } catch(e) { 
          console.error('Save error', e); 
          toast.error('Failed to save campaign');
      }
  };

  const openEditDrawer = (camp) => {
      setEditId(camp.id);
      setTitle(camp.title);
      setDescription(camp.description || '');
      setPrice(camp.price ? camp.price.toString() : '');
      setActiveDays('7'); // Keep default as we don't return initial active days precisely, just standard reset
      setPreviewImage(camp.imageUrl || null);
      setIsDrawerOpen(true);
  };
  
  const openCreateDrawer = () => {
      setEditId(null);
      setTitle('');
      setDescription('');
      setPrice('');
      setActiveDays('7');
      setPreviewImage(null);
      setIsDrawerOpen(true);
  };

  return (
    <AdminLayout title="Campaigns" activeTab="campaigns">
      <div className="px-6 md:px-10 pb-20 max-w-[1400px] mx-auto w-full">
        {/* Page Top Header */}
        <div className="flex items-center justify-between mb-8 mt-2">
           <h2 className="text-3xl font-black font-headline tracking-tighter text-on-surface">Overview</h2>
           <button 
             onClick={openCreateDrawer}
             className="px-6 py-3 rounded-full text-white font-headline font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform"
             style={{ 
               backgroundColor: primaryColor,
               boxShadow: `0 10px 20px -10px ${primaryColor}80`
             }}
           >
             <span className="material-symbols-outlined text-sm">add</span> Add New Campaign
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* The Master Toggle Control Center */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_40px_60px_-15px_rgba(88,66,58,0.04)] relative overflow-hidden">
                    {/* Background accent */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <h3 className="font-headline font-bold text-on-surface text-xl tracking-tight mb-2">Master Switch</h3>
                    <p className="text-xs text-on-surface-variant opacity-70 mb-8 leading-relaxed max-w-[200px]">Control whether the 3-Second campaign popup triggers globally across the digital menu.</p>
                    
                    <div className="flex items-center justify-between bg-surface-container-high p-4 rounded-2xl w-full">
                        <span className="font-bold text-sm text-on-surface font-headline uppercase tracking-widest">{globalEnabled ? 'Active' : 'Paused'}</span>
                        <div 
                            className="w-14 h-8 rounded-full flex items-center p-1.5 cursor-pointer transition-colors shadow-inner relative"
                            style={{ backgroundColor: globalEnabled ? primaryColor : '#dbdad7' }}
                            onClick={() => setGlobalEnabled(!globalEnabled)}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${globalEnabled ? 'translate-x-6 shadow-sm' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_40px_60px_-15px_rgba(88,66,58,0.04)] flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl" style={{ color: primaryColor }}>smartphone</span>
                    </div>
                    <h3 className="font-headline font-bold text-on-surface text-lg mb-2">Live Preview</h3>
                    <p className="text-xs text-on-surface-variant opacity-70 mb-6 leading-relaxed">Experience exactly what the customer sees when the 3-second rule is triggered.</p>
                    <button 
                        onClick={() => setShowPreview(true)}
                        className="w-full py-3 rounded-full text-white font-headline font-bold text-sm shadow-md active:scale-95 transition-transform"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Simulate Modal
                    </button>
                </div>
            </div>

            {/* Campaign Listing Table (Product Page Style) */}
            <div className="lg:col-span-12">
               {campaigns.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-outline-variant/20 rounded-[2rem] bg-surface-container-lowest">
                     <span className="material-symbols-outlined text-6xl text-outline-variant opacity-30 mb-4 tracking-tighter">campaign</span>
                     <p className="text-sm font-body text-on-surface-variant opacity-70">No active campaigns. Start curating your marketing strategy.</p>
                  </div>
               ) : (
                  <section className="mb-10">
                    <div className="bg-surface-container-lowest rounded-[2rem] p-4 lg:p-8 overflow-hidden shadow-[0_40px_60px_-15px_rgba(88,66,58,0.04)] border border-surface-container-low">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-surface-container-low/50 text-left">
                              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider font-headline rounded-l-xl">Campaign / Message</th>
                              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider font-headline">Price</th>
                              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider font-headline">Expires</th>
                              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider font-headline">Status</th>
                              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider font-headline text-right rounded-r-xl">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y-0 relative">
                            <tr className="h-4"></tr> {/* Aesthetic Gap */}
                            
                            <AnimatePresence>
                              {campaigns.map((camp) => {
                                return (
                                  <motion.tr 
                                    key={camp.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ 
                                      opacity: !camp.isPopupActive ? 0.6 : 1, 
                                      y: 0,
                                    }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className={`group hover:bg-surface-container-low/60 rounded-xl mb-2 block table-row relative overflow-hidden`}
                                  >
                                    <td className="py-4 px-6 rounded-l-xl">
                                      <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm transition-all ${!camp.isPopupActive ? 'grayscale' : 'bg-surface-container-highest'}`}>
                                          {camp.imageUrl ? (
                                              <img src={camp.imageUrl} alt={camp.title} className="w-full h-full object-cover" />
                                          ) : (
                                              <span className="material-symbols-outlined text-outline-variant mt-4 ml-4">campaign</span>
                                          )}
                                        </div>
                                        <div>
                                          <h4 className="font-bold font-headline text-on-surface transition-colors">{camp.title}</h4>
                                          <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1 max-w-[250px]">{camp.description}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-4 px-6 font-semibold" style={{ color: camp.isPopupActive ? primaryColor : undefined }}>
                                      {camp.price ? `${camp.price} ₺` : '-'}
                                    </td>
                                    <td className="py-4 px-6 font-semibold">
                                      {camp.endDate ? new Date(camp.endDate).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="py-4 px-6">
                                      <label className="relative inline-flex items-center cursor-pointer group/toggle">
                                        <input 
                                          type="checkbox" 
                                          className="sr-only peer" 
                                          checked={camp.isPopupActive} 
                                          onChange={() => toggleStatus(camp.id)} 
                                        />
                                        <div className="w-11 h-6 bg-surface-container-highest rounded-full shadow-inner transition-all peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm" style={camp.isPopupActive ? { backgroundColor: primaryColor } : {}}></div>
                                      </label>
                                    </td>
                                    <td className="py-4 px-6 text-right rounded-r-xl">
                                      <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openEditDrawer(camp)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant/70 hover:text-on-surface">
                                          <span className="material-symbols-outlined text-sm pt-1">edit</span>
                                        </button>
                                        <button 
                                          className="p-2 hover:bg-error/10 rounded-full transition-colors text-error/70 hover:text-error"
                                          onClick={() => deleteCampaign(camp.id)}
                                        >
                                          <span className="material-symbols-outlined text-sm pt-1">delete</span>
                                        </button>
                                      </div>
                                    </td>
                                  </motion.tr>
                                );
                              })}
                            </AnimatePresence>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
               )}
            </div>

        </div>

        {/* Create Campaign Drawer */}
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-surface-variant/80 backdrop-blur-sm z-[100]"
              />
              <motion.div 
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-surface z-[101] shadow-2xl p-8 flex flex-col overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-bold font-headline tracking-tighter text-on-surface">New Campaign</h2>
                  <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant">close</span>
                  </button>
                </div>
                <div className="space-y-6 flex-1">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Campaign Title</label>
                    <input 
                       type="text" 
                       value={title}
                       onChange={(e) => setTitle(e.target.value)}
                       className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-sm focus:outline-none transition-all" 
                       onFocus={(e) => e.target.style.borderColor = primaryColor}
                       onBlur={(e) => e.target.style.borderColor = 'transparent'}
                       placeholder="e.g. Free Dessert Off Main Course" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Promotional Message (Pop-up Content)</label>
                    <textarea 
                       value={description}
                       onChange={(e) => setDescription(e.target.value)}
                       className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-sm focus:outline-none h-32 resize-none transition-all" 
                       onFocus={(e) => e.target.style.borderColor = primaryColor}
                       onBlur={(e) => e.target.style.borderColor = 'transparent'}
                       placeholder="Draft the compelling offer here..."
                    ></textarea>
                  </div>
                  <div className="flex gap-4">
                      <div className="flex flex-col gap-2 w-full md:w-1/2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Price (₺) - Optional</label>
                       <input 
                         type="number" 
                         value={price}
                         onChange={(e) => setPrice(e.target.value)}
                         className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-inner focus:outline-none w-full text-on-surface transition-all" 
                         onFocus={(e) => e.target.style.borderColor = primaryColor}
                         onBlur={(e) => e.target.style.borderColor = 'transparent'}
                         placeholder="0.00" 
                       />
                     </div>
                      <div className="flex flex-col gap-2 w-full md:w-1/2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Active Duration (Days)</label>
                       <input 
                         type="number" 
                         value={activeDays}
                         min="1"
                         onChange={(e) => setActiveDays(e.target.value)}
                         className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-inner focus:outline-none w-full text-on-surface transition-all" 
                         onFocus={(e) => e.target.style.borderColor = primaryColor}
                         onBlur={(e) => e.target.style.borderColor = 'transparent'}
                         placeholder="7" 
                       />
                     </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Campaign Visual Upload</label>
                     <div className="relative border-2 border-dashed border-outline-variant/30 rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container-highest hover:bg-surface-container-high transition-colors cursor-pointer group overflow-hidden">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageUpload} accept="image/*" />
                        {previewImage ? (
                           <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        ) : (
                           <>
                             <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">add_photo_alternate</span>
                             <span className="text-xs mt-2 font-bold text-on-surface-variant text-center">Upload Campaign Image</span>
                           </>
                        )}
                     </div>
                  </div>
                  <div className="pt-8 mt-auto mb-4 border-t border-surface-container-high">
                    <button 
                        onClick={handleSaveCampaign} 
                        className="w-full py-4 text-white font-headline font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow mt-4 uppercase tracking-widest text-sm" 
                        style={{ backgroundColor: primaryColor }}
                    >
                        {editId ? 'Update Campaign' : 'Launch Campaign'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Live Simulation Overlay */}
        <AnimatePresence>
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPreview(false)}
                        className="absolute inset-0 bg-on-surface/40 backdrop-blur-md cursor-pointer"
                    ></motion.div>
                    
                    {/* Mobile Frame Mockup Container to simulate the actual phone view */}
                    <motion.div 
                         initial={{ y: 50, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         exit={{ y: 50, opacity: 0 }}
                         className="relative w-full max-w-[375px] h-[667px] bg-surface rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto"
                    >
                        {/* Mock Customer Menu layout */}
                        <div className="absolute inset-0 bg-surface blur-[2px] opacity-20 pointer-events-none"></div>

                        {/* The Actual Bottom Sheet Mockup */}
                        <div className="absolute inset-x-0 bottom-0 bg-surface rounded-t-[2rem] p-8 shadow-[0_-20px_60px_-15px_rgba(88,66,58,0.2)] flex flex-col items-center">
                            <div className="w-12 h-1.5 bg-surface-container-high rounded-full mx-auto mb-8"></div>
                            {(() => {
                                const activeCamp = campaigns.find(c => c.isPopupActive);
                                return activeCamp ? (
                                    <>
                                        {activeCamp.imageUrl && (
                                            <div className="w-full h-40 rounded-2xl overflow-hidden mb-6 shadow-inner">
                                                <img src={activeCamp.imageUrl} alt="preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <h2 className="text-2xl font-headline font-extrabold text-on-surface tracking-tighter mb-3 text-center">{activeCamp.title}</h2>
                                        <p className="text-on-surface-variant font-body mb-8 text-sm leading-relaxed text-center">{activeCamp.description}</p>
                                        <button 
                                            className="w-full text-white py-4 rounded-full font-headline font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all text-sm"
                                            style={{ backgroundColor: primaryColor }}
                                            onClick={() => setShowPreview(false)}
                                        >
                                            Got It
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center py-6 w-full">
                                        <span className="material-symbols-outlined text-outline-variant text-4xl mb-4">campaign</span>
                                        <h4 className="font-headline font-black text-on-surface-variant opacity-70 text-lg">No Active Campaign</h4>
                                        <p className="text-xs font-body text-on-surface-variant opacity-50 mt-2 mb-8">Publish a campaign to test the popup simulation.</p>
                                        <button className="w-full bg-surface-container-high py-4 rounded-full font-headline font-bold uppercase tracking-widest text-sm text-on-surface" onClick={() => setShowPreview(false)}>
                                            Close
                                        </button>
                                    </div>
                                );
                            })()}
                            
                            {campaigns.find(c => c.isPopupActive) && (
                                <div className="mt-6 text-center w-full">
                                    <button className="text-on-surface-variant font-body text-xs uppercase tracking-widest hover:underline underline-offset-4 opacity-70" onClick={() => setShowPreview(false)}>
                                        Dismiss
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
};

export default CampaignManagement;
