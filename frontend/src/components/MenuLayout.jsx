import React from 'react';
import { Link } from 'react-router-dom';
import { useBranding } from '../context/BrandingContext';

const MenuLayout = ({ children }) => {
  const { primaryColor } = useBranding();
  
  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen relative overflow-x-hidden">
      {/* Top Navigation Frame - Glassmorphism, No rigid border needed by design, but using a translucent one for structure */}
      <header className="bg-[#faf9f6]/80 dark:bg-stone-900/80 backdrop-blur-xl fixed top-0 w-full z-40 transition-all duration-300 ease-in-out border-b border-surface-variant/20">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-5xl mx-auto">
          <Link to="/admin" className="hover:bg-stone-100/50 dark:hover:bg-stone-800/50 p-2 rounded-full transition-all active:scale-95" title="Go To Admin Panel">
            <span className="material-symbols-outlined" style={{ color: primaryColor }}>menu</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl" style={{ color: primaryColor }}>restaurant</span>
            <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50 font-headline tracking-tighter">
              The Gastronomic Curator
            </h1>
          </div>
          
          <button className="hover:bg-stone-100/50 dark:hover:bg-stone-800/50 p-2 rounded-full transition-all active:scale-95 flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ color: primaryColor }}>language</span>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-tighter">EN</span>
          </button>
        </div>
      </header>

      {/* Main Content Area - Generous top padding for the sticky header */}
      <main className="pt-20 px-6 pb-32 max-w-5xl mx-auto relative z-10">
        {children}
      </main>

      {/* Bottom Navigation Frame - Persistent Bottom Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-[#faf9f6]/90 dark:bg-stone-950/90 backdrop-blur-2xl rounded-t-[2rem] shadow-[0_-8px_40px_-15px_rgba(88,66,58,0.08)] border-t border-surface-variant/10">
        <div className="flex justify-around items-center px-4 pb-6 pt-2 max-w-5xl mx-auto">
          {/* Menu Tab (Active) - Inherits dynamic primaryColor for gradient tint */}
          <a className="flex flex-col items-center justify-center text-white rounded-full p-3 shadow-lg shadow-black/10 transition-transform duration-200 active:scale-90" href="#" style={{ backgroundImage: `linear-gradient(to bottom right, ${primaryColor}, #f26b38)` }}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant_menu</span>
          </a>
          
          <a className="flex flex-col items-center justify-center text-on-surface-variant/50 p-3 hover:text-on-surface transition-transform duration-200 active:scale-90" href="#">
            <span className="material-symbols-outlined">receipt_long</span>
          </a>
          
          <a className="flex flex-col items-center justify-center text-on-surface-variant/50 p-3 hover:text-on-surface transition-transform duration-200 active:scale-90" href="#">
            <div className="relative">
              <span className="material-symbols-outlined">shopping_bag</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
            </div>
          </a>
          
          <a className="flex flex-col items-center justify-center text-on-surface-variant/50 p-3 hover:text-on-surface transition-transform duration-200 active:scale-90" href="#">
            <span className="material-symbols-outlined">person</span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default MenuLayout;
