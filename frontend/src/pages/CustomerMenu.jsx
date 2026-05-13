import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBranding } from '../context/BrandingContext';
import api from '../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerMenu = () => {
  const { slug } = useParams();
  const { primaryColor } = useBranding();
  const [showCampaign, setShowCampaign] = useState(false);
  const [menuData, setMenuData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Fetch live tenant data based on unique QR Url endpoint
    const fetchLiveMenu = async () => {
      try {
        const response = await api.get(`/menu/${slug}`);
        setMenuData(response.data);

        // Store slug for "Return to Customer Menu" functionality on login page
        localStorage.setItem('tenantSlug', slug);

        // Re-bind smart interaction popup logically
        if (response.data.campaigns?.length > 0) {
          const hasSeenPopup = sessionStorage.getItem(`seen_${slug}`);
          if (!hasSeenPopup) {
            const defaultWait = response.data.campaigns[0].popupDelay || 3000;
            setTimeout(() => {
              setShowCampaign(true);
              sessionStorage.setItem(`seen_${slug}`, 'true');
            }, defaultWait);
          }
        }
      } catch (error) {
        console.error('[Menu Gateway Sync] Error loading merchant data', error);
      }
    };
    fetchLiveMenu();
  }, [slug]);

  if (!menuData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: primaryColor, borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  // Filter Pipeline: First by active Category Tab, then by Search Query.
  const allProducts = menuData.categories.flatMap(cat => cat.products);
  const activeProducts = activeCategory === 'All'
    ? allProducts
    : menuData.categories.find(c => c.name_tr === activeCategory)?.products || [];

  const filteredProducts = activeProducts.filter(p => {
    const term = searchQuery.toLowerCase();
    // Multi-language physical filter matrix
    return (
      (p.name_tr && p.name_tr.toLowerCase().includes(term)) ||
      (p.name_en && p.name_en.toLowerCase().includes(term)) ||
      (p.desc_tr && p.desc_tr.toLowerCase().includes(term))
    );
  });

  return (
    <>
      <section className="mt-4">
        <div className="bg-surface-container-low rounded-xl flex items-center px-4 py-3 gap-3 transition-all focus-within:ring-2 focus-within:bg-surface-container-lowest focus-within:shadow-xl focus-within:shadow-on-surface-variant/5">
          <span className="material-symbols-outlined text-outline">search</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-none w-full text-on-surface placeholder:text-on-surface-variant/50 font-body text-sm"
            placeholder={`Search in ${menuData.name}'s menu...`}
            type="text"
          />
        </div>
      </section>

      {/* Dynamic Native Category Scroller */}
      <section className="mt-8 -mx-6 sticky top-[64px] z-30 bg-surface/95 backdrop-blur-xl pb-3 pt-3">
        <div className="flex overflow-x-auto hide-scrollbar gap-4 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-6 py-2.5 rounded-full whitespace-nowrap font-headline text-sm font-semibold transition-all ${activeCategory === 'All' ? 'text-white shadow-lg' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
            style={activeCategory === 'All' ? { backgroundColor: primaryColor } : {}}
          >
            All Items
          </button>
          {menuData.categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name_tr)}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap font-headline text-sm font-semibold transition-all ${activeCategory === cat.name_tr ? 'text-white shadow-lg' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
              style={activeCategory === cat.name_tr ? { backgroundColor: primaryColor } : {}}
            >
              {cat.name_tr}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-12 space-y-12">
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-headline font-bold text-on-surface tracking-tighter">Curated Selections</h3>
          <span className="font-headline text-xs font-bold tracking-widest uppercase pb-1 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: primaryColor }}>
            {filteredProducts.length} Items
          </span>
        </div>

        <div className="space-y-6">
          <AnimatePresence>
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex flex-row-reverse gap-6 items-center hover:bg-surface-container-low p-2 -mx-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="w-2/5 aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-on-surface-variant/10 bg-surface-container-highest">
                  {product.imageUrl && <img alt={product.name_tr} className="w-full h-full object-cover" src={product.imageUrl} />}
                </div>
                <div className="w-3/5">
                  <h4 className="text-lg font-headline font-bold text-on-surface mb-1">{product.name_tr}</h4>
                  <p className="text-xs text-on-surface-variant font-body leading-relaxed mb-3 line-clamp-2">{product.desc_tr}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold tracking-tight" style={{ color: primaryColor }}>{product.price} ₺</span>
                    <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-sm" style={{ color: primaryColor }}>add</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <div className="py-12 text-center text-on-surface-variant text-sm font-bold opacity-60">No matched dishes found.</div>
          )}
        </div>
      </section>

      {/* Campaign Bottom Sheet */}
      <div className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-700 ease-in-out ${showCampaign ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-md" onClick={() => setShowCampaign(false)}></div>

        <div className={`relative w-full max-w-md bg-surface rounded-t-[2rem] p-8 shadow-[0_-20px_60px_-15px_rgba(88,66,58,0.2)] transform transition-transform duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${showCampaign ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-12 h-1.5 bg-surface-container-high rounded-full mx-auto mb-8"></div>

          <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tighter mb-3">
            {menuData.campaigns?.[0]?.title || 'Special Campaign!'}
          </h2>
          <p className="text-on-surface-variant font-body mb-8 text-sm leading-relaxed">
            Unlock exclusive offerings curated directly by our chefs, available for a limited time.
          </p>

          <button
            className="w-full text-white py-4 rounded-full font-headline font-bold uppercase tracking-widest shadow-lg shadow-black/10 active:scale-95 transition-all text-sm mb-4"
            style={{ backgroundColor: primaryColor }}
            onClick={() => navigate(`/m/${slug}/campaigns`, { state: { campaigns: menuData.campaigns } })}
          >
            Claim Offer
          </button>

          <div className="text-center">
            <button className="text-on-surface-variant font-body text-xs uppercase tracking-widest hover:underline underline-offset-4 opacity-70" onClick={() => setShowCampaign(false)}>
              No, thanks
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerMenu;
