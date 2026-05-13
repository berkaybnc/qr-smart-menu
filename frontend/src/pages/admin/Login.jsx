import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBranding } from '../../context/BrandingContext';
import { motion } from 'framer-motion';
import api from '../../api/axiosInstance';

const Login = () => {
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState('');
  const { primaryColor } = useBranding();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', {
        email,
        password: pin // Using the visual PIN as the password payload for now.
      });

      const { token, restaurant } = response.data;
      
      // Store the secure JWT and unique identifier slug
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('tenantSlug', restaurant.slug);
      localStorage.setItem('restaurantName', restaurant.name);
      
      navigate('/admin'); // Modified from /admin/dashboard to /admin due to our App.jsx rooting logic
    } catch (err) {
      setErrorText(err.response?.data?.error || 'Authentication Failed');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Aesthetic Blurs */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px] pointer-events-none"></div>
      
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="w-full max-w-md bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-[0_40px_60px_-15px_rgba(88,66,58,0.08)] z-10 text-center"
      >
         <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10 mx-auto mb-8 shadow-inner">
            <span className="material-symbols-outlined text-4xl" style={{ color: primaryColor }}>admin_panel_settings</span>
         </div>
         
         <h1 className="text-3xl font-black font-headline tracking-tighter text-on-surface mb-2">Admin Portal</h1>
         <p className="text-sm font-body text-on-surface-variant opacity-70 mb-8 leading-relaxed">Identity verification required to curate the menu.</p>
         
         {errorText && (
             <div className="mb-6 p-3 rounded-lg bg-error/10 text-error text-xs font-bold font-headline uppercase tracking-widest">{errorText}</div>
         )}
         
         <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col gap-2 text-left">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Merchant Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="curator@nexmenu.com"
                className="bg-surface-container-high rounded-xl p-4 border-none font-headline font-bold shadow-inner focus:ring-0 focus:outline-none w-full text-on-surface transition-all text-sm" 
              />
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Security PIN</label>
              <input 
                type="password" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="bg-surface-container-high rounded-xl p-4 border-none text-center tracking-[1em] text-lg font-headline font-bold shadow-inner focus:ring-0 focus:outline-none w-full text-on-surface transition-all placeholder:tracking-normal placeholder:font-body placeholder:text-sm placeholder:opacity-50" 
              />
            </div>
            
            <button 
                type="submit"
                disabled={pin.length < 4 || !email}
                className="w-full py-4 text-white font-headline font-bold rounded-full shadow-lg hover:shadow-xl transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg text-sm" 
                style={{ backgroundColor: primaryColor }}
            >
                Authenticate
            </button>
         </form>
         
         <div className="mt-8">
            <button 
                onClick={() => {
                    const slug = localStorage.getItem('tenantSlug');
                    if (slug) {
                        navigate(`/m/${slug}`);
                    } else {
                        navigate('/');
                    }
                }} 
                className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 hover:text-on-surface-variant transition-colors"
            >
                &larr; Return to Customer Menu
            </button>
         </div>
      </motion.div>
    </div>
  );
};

export default Login;
