import React, { useState, useRef, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBranding } from '../../context/BrandingContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const initialProducts = [
  { 
    id: 1, 
    name: "Wagyu Ribeye MB9+", 
    desc: "300g, Grass-fed, charred cherry tomatoes, roasted garlic", 
    price: 1240.00, 
    stock: 14, 
    active: true, 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAx5lTfnCIgI3T80Q1WhyqaEgJWX8xvaQJVDeLgEe3s6sbCMvtACWYUIVYZt-Bl9vJyixTJYNhCo1tQWDOzFA4s-gmCVA4O6r4qWmFYMApCWS7caTW6180m--tVQr5GIWfBbAs7-HxuLYsxyC3XAA9_aExWi-qTeqGLz5Nq9RWjla7-YJvsRG7w_NPoqZPMN-q9o53I6RSAKzZV5Lr5ZXRNnDkrFsBGpVEF5pwNwMK2Z8VqeyAPjYHMoXatD6lHAiglai1xpRsF0wI" 
  },
  { 
    id: 2, 
    name: "Butter Poached Lobster", 
    desc: "Atlantic lobster, saffron risotto, micro-greens", 
    price: 890.00, 
    stock: 3, 
    active: true, 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVqoDOE4lOecNDq4eAHKrjRZ7-C8VAbZIFmOadDqeNG3CTcgyQszxAMBQ1Y1FqBqMXOhmaXtAatpmYByGRSty42M25lup8TDNlO0ntAL-s6TksgnnawuRGmFRwuIinH9LI_xN_XWNTXM4uucrcND3QgPdyPyCRBEd9yrkokFpDDQK4w9oaqYwRCOA10kHFGPcM4-SCluOwe70gqzy_3fjBYU-VdCjGLCkklhkjcmD_sd_L2T7t1-9SOb5eeu2JyWrnL_QRMx4eD5s" 
  },
  { 
    id: 3, 
    name: "Truffle Glazed Duck", 
    desc: "Slow roasted, black truffle infusion, parsnip puree", 
    price: 640.00, 
    stock: 0, 
    active: false, 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuKLXc5VpGhhcCI96jprvLd89J8b_kc1O-vY5GFWc9NRXsxq-xIYytVW40v1s7ALbXYpWwSITAP3m0dbBa_HQiosMCY6VlKt4eXbF3u1qCt1I6SNOlmAFNYQi0QqfT1UfrggNzVlUcbWg2shwSbDjLVg3byq07nEYTxnov58fcBEV_fys_ltz1_a0OOmadeP0vWXkx0QPOK6XzS6J897YEE11et_pQkifia6LfusZT_geeaZFuqtPGVbmyJh8ucVBbWGEm3xt2voM" 
  },
];

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCatDrawerOpen, setIsCatDrawerOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  
  // Multi-language State Matrix Hook
  const [formLang, setFormLang] = useState('tr');
  const [formData, setFormData] = useState({
     name_tr: '', name_en: '', name_ar: '',
     desc_tr: '', desc_en: '', desc_ar: '',
     price: '', categoryId: ''
  });

  const [catData, setCatData] = useState({
     name_tr: '', name_en: '', name_ar: ''
  });

  const { primaryColor } = useBranding();

  const fetchLiveProducts = async () => {
    try {
       const [prodRes, catRes] = await Promise.all([
           api.get('/admin/products'), 
           api.get('/admin/categories')
       ]);
       setProducts(prodRes.data);
       setCategories(catRes.data);
       setLoading(false);
    } catch(e) {
       console.error(e);
       setLoading(false);
    }
  };

  useEffect(() => {
     fetchLiveProducts();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
        const res = await api.post('/admin/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setPreviewImage(res.data.imageUrl); // Store generated WebP link internally
    } catch(err) {
        console.error("Image webp processing engine error", err);
    }
  };
  
  // Drag and Drop internal state references
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // Drag Handlers
  const handleDragStart = (e, index, id) => {
    dragItem.current = index;
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = (e) => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const _products = [...products];
      const draggedItemContent = _products.splice(dragItem.current, 1)[0];
      _products.splice(dragOverItem.current, 0, draggedItemContent);
      setProducts(_products);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggingId(null);
  };

  const handleToggle = async (id) => {
    try {
        const res = await api.patch(`/admin/products/${id}/toggle`);
        setProducts(products.map(p => p.id === id ? res.data : p));
        toast.success(res.data.isActive ? 'Product Active' : 'Product Hidden');
    } catch(e) { 
        console.error('Toggle error', e); 
        toast.error('Failed to change product status');
    }
  };

  const deleteProductEntry = async (id) => {
    try {
        await api.delete(`/admin/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
        toast.success('Product deleted');
    } catch(e) { 
        console.error('Delete error', e); 
        toast.error('Failed to delete product');
    }
  };

  const handleSaveProduct = async () => {
     try {
         const payload = {
            ...formData,
            price: parseFloat(formData.price),
            imageUrl: previewImage
         };
         if (editProductId) {
             const res = await api.put(`/admin/products/${editProductId}`, payload);
             setProducts(products.map(p => p.id === editProductId ? res.data : p));
         } else {
             const res = await api.post('/admin/products', payload);
             setProducts([res.data, ...products]);
         }
         setIsDrawerOpen(false);
         setPreviewImage(null);
         setEditProductId(null);
         toast.success('Product saved successfully');
         // Reset
         setFormData({
            name_tr: '', name_en: '', name_ar: '',
            desc_tr: '', desc_en: '', desc_ar: '',
            price: '', categoryId: ''
         });
     } catch(e) {
         console.error('Save error', e);
         toast.error('Failed to save product');
     }
  };

  const openEditDrawer = (product) => {
      setEditProductId(product.id);
      setFormData({
         name_tr: product.name_tr || '', name_en: product.name_en || '', name_ar: product.name_ar || '',
         desc_tr: product.desc_tr || '', desc_en: product.desc_en || '', desc_ar: product.desc_ar || '',
         price: product.price ? product.price.toString() : '', categoryId: product.categoryId || ''
      });
      setPreviewImage(product.imageUrl || null);
      setIsDrawerOpen(true);
  };
  
  const openCreateDrawer = () => {
      setEditProductId(null);
      setFormData({
         name_tr: '', name_en: '', name_ar: '',
         desc_tr: '', desc_en: '', desc_ar: '',
         price: '', categoryId: ''
      });
      setPreviewImage(null);
      setIsDrawerOpen(true);
  };

  const handleCreateCategory = async () => {
     if(!catData.name_tr) {
         toast.error('Kategori adı (Türkçe) zorunludur');
         return;
     }
     try {
         const res = await api.post('/admin/categories', catData);
         setCategories([...categories, res.data]);
         setIsCatDrawerOpen(false);
         setCatData({ name_tr: '', name_en: '', name_ar: '' });
         toast.success('Category created structure locked.');
     } catch(e) { 
         console.error('Category creation error', e); 
         toast.error('Failed to create category');
     }
  };

  // Artistic Empty State
  const EmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-outline-variant/30 rounded-[2rem] bg-surface-container-lowest"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl" style={{ color: primaryColor }}>restaurant_menu</span>
      </div>
      <h4 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-2">The menu is a blank canvas.</h4>
      <p className="font-body text-on-surface-variant max-w-sm text-sm mb-8 leading-relaxed">
        Start curating your first dish. High-quality imagery and detailed descriptions elevate the dining experience.
      </p>
        <button 
        className="px-8 py-4 rounded-full font-headline font-bold text-sm text-white shadow-lg active:scale-95 transition-transform tracking-widest uppercase flex items-center gap-2"
        style={{ backgroundColor: primaryColor }}
        onClick={openCreateDrawer}
      >
        <span className="material-symbols-outlined text-sm">add</span>
        Create Dish
      </button>
    </motion.div>
  );

  return (
    <AdminLayout title="Products" activeTab="products">
      <div className="px-6 md:px-10 pb-20 max-w-[1400px] mx-auto w-full">
        
        {/* Page Top Header with Create Button */}
        <div className="flex items-center justify-between mb-8 mt-2">
           <h2 className="text-3xl font-black font-headline tracking-tighter text-on-surface hidden md:block">Overview</h2>
           <div className="md:hidden"></div> {/* Spacer for mobile */}
           
           <div className="flex items-center gap-4">
             <motion.button 
               whileHover={{ scale: 1.02, y: -2 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setIsCatDrawerOpen(true)}
               className="px-6 py-3 rounded-full text-on-surface font-headline font-bold text-sm shadow-sm border border-outline-variant/30 flex items-center gap-2 bg-surface hover:bg-surface-container-high transition-colors"
             >
               <span className="material-symbols-outlined text-sm">create_new_folder</span> New Category
             </motion.button>
             
             <motion.button 
               whileHover={{ scale: 1.02, y: -2 }}
               whileTap={{ scale: 0.95 }}
               onClick={openCreateDrawer}
               className="px-6 py-3 rounded-full text-white font-headline font-bold text-sm flex items-center gap-2"
               style={{ 
                 backgroundColor: primaryColor,
                 boxShadow: `0 10px 20px -10px ${primaryColor}80`
               }}
             >
               <span className="material-symbols-outlined text-sm">add</span> Add New Product
             </motion.button>
           </div>
        </div>

        {/* Drawer Injection */}
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-surface-variant/80 backdrop-blur-sm z-[100]"
              />
              <motion.div 
                initial={{ x: '100%' }} 
                animate={{ x: 0 }} 
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-surface z-[101] shadow-2xl p-8 flex flex-col overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-bold font-headline tracking-tighter text-on-surface">New Product</h2>
                  <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant">close</span>
                  </button>
                </div>
                {/* Minimalist Multi-Language Tab Form */}
                <div className="space-y-6 flex-1">
                  
                  {/* Digital Sommelier Multi-lang Hub */}
                  <div className="flex gap-2 p-1 bg-surface-container-highest rounded-full w-max">
                     <button onClick={() => setFormLang('tr')} className={`px-4 py-1.5 rounded-full text-xs font-bold font-headline transition-all ${formLang === 'tr' ? 'bg-surface shadow text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}>Türkçe (TR)</button>
                     <button onClick={() => setFormLang('en')} className={`px-4 py-1.5 rounded-full text-xs font-bold font-headline transition-all ${formLang === 'en' ? 'bg-surface shadow text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}>English (EN)</button>
                     <button onClick={() => setFormLang('ar')} className={`px-4 py-1.5 rounded-full text-xs font-bold font-headline transition-all ${formLang === 'ar' ? 'bg-surface shadow text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}>العربية (AR)</button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Product Name ({formLang.toUpperCase()})</label>
                    <input 
                        type="text" 
                        value={formData[`name_${formLang}`]}
                        onChange={(e) => setFormData({...formData, [`name_${formLang}`]: e.target.value})}
                        dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                        className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-sm focus:outline-none transition-all" 
                        style={{ focusPadding: '14px' }}
                        onFocus={(e) => e.target.style.borderColor = primaryColor}
                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                        placeholder={formLang === 'tr' ? 'örn. Izgara Bonfile' : formLang === 'en' ? 'e.g. Grilled Tenderloin' : 'فيليه مشوي'} 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Description ({formLang.toUpperCase()})</label>
                    <textarea 
                        value={formData[`desc_${formLang}`]}
                        onChange={(e) => setFormData({...formData, [`desc_${formLang}`]: e.target.value})}
                        dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                        className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-sm focus:outline-none h-32 resize-none transition-all" 
                        onFocus={(e) => e.target.style.borderColor = primaryColor}
                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                        placeholder="Elaborate on the taste profile..."
                    ></textarea>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2 w-1/2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Price (₺)</label>
                      <input 
                          type="number" 
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-sm focus:outline-none transition-all" 
                          onFocus={(e) => e.target.style.borderColor = primaryColor}
                          onBlur={(e) => e.target.style.borderColor = 'transparent'}
                          placeholder="0.00" 
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-1/2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Category</label>
                      <select 
                          value={formData.categoryId}
                          onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                          className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-sm focus:outline-none appearance-none cursor-pointer transition-all"
                          onFocus={(e) => e.target.style.borderColor = primaryColor}
                          onBlur={(e) => e.target.style.borderColor = 'transparent'}
                      >
                        <option value="">Seçiniz...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name_tr}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Gastronomic Visual Upload</label>
                     <div className="relative border-2 border-dashed border-outline-variant/30 rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container-highest hover:bg-surface-container-high transition-colors cursor-pointer group overflow-hidden">
                        {/* Note: This is now wired for Phase 6's sharp/multer engine theoretically */}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageUpload} accept="image/*" />
                        {previewImage ? (
                           <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        ) : (
                           <>
                             <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">add_photo_alternate</span>
                             <span className="text-xs mt-2 font-bold text-on-surface-variant">Upload Thumbnail (Auto-compressed to WebP)</span>
                           </>
                        )}
                     </div>
                  </div>
                  <div className="pt-8 mt-auto mb-4 border-t border-surface-container-high">
                    <button 
                        onClick={handleSaveProduct} 
                        className="w-full py-4 text-white font-headline font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow mt-4" 
                        style={{ backgroundColor: primaryColor }}
                    >
                        {editProductId ? 'Update Localization' : 'Publish Active Localization'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Category Drawer Injection */}
        <AnimatePresence>
          {isCatDrawerOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setIsCatDrawerOpen(false)}
                className="fixed inset-0 bg-surface-variant/80 backdrop-blur-sm z-[100]"
              />
              <motion.div 
                initial={{ x: '100%' }} 
                animate={{ x: 0 }} 
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-sm bg-surface z-[101] shadow-2xl p-8 flex flex-col"
              >
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-bold font-headline tracking-tighter text-on-surface">New Category</h2>
                  <button onClick={() => setIsCatDrawerOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant">close</span>
                  </button>
                </div>
                <div className="space-y-6 flex-1">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Kategori Adı (TR)</label>
                    <input 
                        type="text" 
                        value={catData.name_tr}
                        onChange={(e) => setCatData({...catData, name_tr: e.target.value})}
                        className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-sm focus:outline-none transition-all" 
                        onFocus={(e) => e.target.style.borderColor = primaryColor}
                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                        placeholder="Ana Yemekler" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Category Name (EN)</label>
                    <input 
                        type="text" 
                        value={catData.name_en}
                        onChange={(e) => setCatData({...catData, name_en: e.target.value})}
                        className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-sm focus:outline-none transition-all" 
                        onFocus={(e) => e.target.style.borderColor = primaryColor}
                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                        placeholder="Main Courses" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Category Name (AR)</label>
                    <input 
                        type="text" 
                        dir="rtl"
                        value={catData.name_ar}
                        onChange={(e) => setCatData({...catData, name_ar: e.target.value})}
                        className="bg-surface-container-high rounded-xl p-4 border-2 border-transparent text-sm font-body shadow-sm focus:outline-none transition-all" 
                        onFocus={(e) => e.target.style.borderColor = primaryColor}
                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                        placeholder="الطبق الرئيسي" 
                    />
                  </div>
                  <div className="pt-8 mt-auto mb-4 border-t border-surface-container-high">
                    <button 
                        onClick={handleCreateCategory} 
                        className="w-full py-4 text-white font-headline font-bold rounded-full shadow-lg" 
                        style={{ backgroundColor: primaryColor }}
                    >
                        Create Category
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Category Tabs / Filter Section */}
        <div className="mb-10 overflow-x-auto hide-scrollbar w-full">
          <div className="flex gap-4 pb-2 w-max">
            <button 
                onClick={() => setActiveCategoryId('all')}
                className={`px-6 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors shadow-sm ${activeCategoryId === 'all' ? 'text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
                style={activeCategoryId === 'all' ? { backgroundColor: primaryColor } : {}}
            >
                All Items
            </button>
            {categories.map(c => (
                <button 
                    key={c.id} 
                    onClick={() => setActiveCategoryId(c.id)}
                    className={`px-6 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors shadow-sm ${activeCategoryId === c.id ? 'text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
                    style={activeCategoryId === c.id ? { backgroundColor: primaryColor } : {}}
                >
                    {c.name_tr}
                </button>
            ))}
          </div>
        </div>

        {/* Bento Styled Layout for Categories */}
        <div className="space-y-12">
          
          {categories.length === 0 && !loading && (
             <div className="text-center py-20">
               <span className="material-symbols-outlined text-6xl text-outline-variant opacity-30 mb-4 tracking-tighter">inventory_2</span>
               <h3 className="text-xl font-bold font-headline text-on-surface opacity-80 mb-2">No Categories Found</h3>
               <p className="text-sm font-body text-on-surface-variant max-w-sm mx-auto">Categorize your menu efficiently. Tap "+ New Category" on the top right to create your first dynamic section.</p>
             </div>
          )}

          {categories.filter(c => activeCategoryId === 'all' || c.id === activeCategoryId).map((category) => {
            const catProducts = products.filter(p => p.categoryId === category.id);
            
            return (
              <section key={category.id} className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined" style={{ color: primaryColor }}>restaurant_menu</span>
                    <h3 className="font-headline text-2xl font-bold tracking-tight">{category.name_tr}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-on-surface-variant/80 text-sm font-medium hover:text-on-surface transition-colors">Edit</button>
                    <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/50"></span>
                    <p className="text-sm text-on-surface-variant font-medium">{loading ? '-' : catProducts.length} Items</p>
                  </div>
                </div>

                {loading ? (
                  // Skeleton Loaders
                  <div className="bg-surface-container-lowest rounded-[2rem] p-4 lg:p-8 overflow-hidden shadow-sm border border-surface-container-low">
                    <div className="space-y-4">
                       {[1,2,3].map((i) => (
                          <div key={i} className="flex items-center gap-6 p-4 rounded-xl border border-surface-container/50 animate-pulse bg-surface-container-high/20">
                             <div className="w-16 h-16 rounded-xl bg-surface-container-highest/50 shrink-0"></div>
                             <div className="flex-1 space-y-3">
                               <div className="h-4 bg-surface-container-highest/50 rounded-full w-1/3"></div>
                               <div className="h-3 bg-surface-container-highest/30 rounded-full w-2/3"></div>
                             </div>
                             <div className="h-4 bg-surface-container-highest/50 rounded-full w-20"></div>
                          </div>
                       ))}
                    </div>
                  </div>
                ) : catProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-outline-variant/20 rounded-[2rem] bg-surface-container-lowest">
                    <p className="text-sm font-body text-on-surface-variant opacity-70">This category is a blank canvas. Let's add dishes to it.</p>
                  </div>
                ) : (
                  // Products Table
                  <div className="bg-surface-container-lowest rounded-[2rem] p-4 lg:p-8 overflow-hidden shadow-[0_40px_60px_-15px_rgba(88,66,58,0.04)] border border-surface-container-low">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-surface-container-low/50 text-left">
                            <th className="py-4 px-6 w-12 rounded-l-xl"></th>
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider font-headline">Product</th>
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider font-headline">Price</th>
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider font-headline">Stock</th>
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider font-headline">Status</th>
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider font-headline text-right rounded-r-xl">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y-0 relative">
                          <tr className="h-4"></tr> {/* Aesthetic Gap */}
                          
                          <AnimatePresence>
                            {catProducts.map((item, index) => {
                              const isDragging = draggingId === item.id;
                              return (
                                <motion.tr 
                                  key={item.id}
                                  layout
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ 
                                    opacity: !item.isActive ? 0.6 : 1, 
                                    y: 0,
                                    scale: isDragging ? 1.02 : 1,
                                    boxShadow: isDragging ? '0 30px 60px -15px rgba(88,66,58,0.15)' : 'none',
                                    zIndex: isDragging ? 50 : 1,
                                    backgroundColor: isDragging ? '#ffffff' : 'transparent'
                                  }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.2 }}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, index, item.id)}
                                  onDragEnter={(e) => handleDragEnter(e, index)}
                                  onDragEnd={handleDragEnd}
                                  onDragOver={(e) => e.preventDefault()}
                                  className={`group hover:bg-surface-container-low/60 rounded-xl mb-2 block table-row cursor-grab active:cursor-grabbing relative overflow-hidden`}
                                >
                                  <td className="py-4 px-6 rounded-l-xl select-none">
                                    <motion.span 
                                      className="material-symbols-outlined text-outline-variant opacity-40 group-hover:opacity-100 transition-opacity"
                                      whileHover={{ scale: 1.2, color: primaryColor }}
                                    >
                                      drag_indicator
                                    </motion.span>
                                  </td>
                                  <td className="py-4 px-6">
                                    <div className="flex items-center gap-4">
                                      <div className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm transition-all ${!item.isActive ? 'grayscale' : 'bg-surface-container-highest'}`}>
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name_tr} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-symbols-outlined text-outline-variant mt-4 ml-4">restaurant</span>
                                        )}
                                      </div>
                                      <div>
                                        <h4 className="font-bold font-headline text-on-surface transition-colors">{item.name_tr}</h4>
                                        <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{item.desc_tr}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 px-6 font-semibold" style={{ color: item.isActive ? primaryColor : undefined }}>
                                    {item.price} ₺
                                  </td>
                                  <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full bg-primary`}></span>
                                      <span className="text-sm font-medium">In stock</span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-6">
                                    <label className="relative inline-flex items-center cursor-pointer group/toggle">
                                      <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={item.isActive} 
                                        onChange={() => handleToggle(item.id)} 
                                      />
                                      <div className="w-11 h-6 bg-surface-container-highest rounded-full shadow-inner transition-all peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm" style={item.isActive ? { backgroundColor: primaryColor } : {}}></div>
                                    </label>
                                  </td>
                                  <td className="py-4 px-6 text-right rounded-r-xl">
                                    <div className="flex items-center justify-end gap-2">
                                      <button onClick={() => openEditDrawer(item)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant/70 hover:text-on-surface">
                                        <span className="material-symbols-outlined text-sm pt-1">edit</span>
                                      </button>
                                      <button 
                                        className="p-2 hover:bg-error/10 rounded-full transition-colors text-error/70 hover:text-error"
                                        onClick={() => deleteProductEntry(item.id)}
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
                )}
              </section>
            );
          })}

        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductManagement;
