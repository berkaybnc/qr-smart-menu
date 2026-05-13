import React, { useEffect, useState } from 'react';
import { useBranding } from '../context/BrandingContext';

const SplashScreen = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { language, setLanguage, restaurantLogo } = useBranding();

  useEffect(() => {
    // 2-second initial delay
    const timer1 = setTimeout(() => {
      setIsFadingOut(true);
    }, 2000);

    // Wait 700ms for the fade out transition before notifying parent
    const timer2 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  // Cycle through languages for demo purposes
  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'tr' : language === 'tr' ? 'ar' : 'en';
    setLanguage(nextLang);
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'tr': return 'Türkçe';
      case 'ar': return 'العربية';
      default: return 'English (International)';
    }
  };

  return (
    <main 
      className={`relative h-screen w-full flex flex-col items-center justify-center bg-surface overflow-hidden transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Subtle Ambient Background Accents (No Borders/Lines) */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary-fixed-dim/20 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-tertiary-fixed-dim/10 blur-[150px]"></div>

      {/* Center Content: Logo and Branding */}
      <div className="relative z-10 flex flex-col items-center gap-12 max-w-sm px-8">
        {/* Logo Frame (Bento-inspired asymmetry) */}
        <div className="relative group">
          {/* Hover glow */}
          <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-surface-container-lowest rounded-[2rem] flex items-center justify-center shadow-[0_40px_60px_-15px_rgba(88,66,58,0.08)] overflow-hidden">
            {restaurantLogo ? (
              <img src={restaurantLogo} alt="Restaurant Logo" className="w-full h-full object-cover" />
            ) : (
              /* Dynamic Signature Icon (Default) */
              <div className="bg-gradient-to-br from-primary to-primary-container w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-4xl md:text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  restaurant
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Typography Cluster */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface font-headline">
            NexMenu
          </h1>
          <p className="text-on-surface-variant font-body text-sm md:text-base uppercase tracking-[0.2em] opacity-80">
            The Gastronomic Curator
          </p>
        </div>

        {/* Progress Indicator (Minimalist Glassmorphism) */}
        <div className="w-48 h-1 bg-surface-container-high rounded-full overflow-hidden mt-8">
          {/* Animated loading bar */}
          <div className="h-full bg-gradient-to-r from-primary to-primary-container w-1/3 rounded-full animate-pulse transition-all duration-1000 ease-in-out hover:w-2/3"></div>
        </div>
      </div>

      {/* Footer Branding Elements (Persistent Bottom) */}
      <footer className="absolute bottom-12 flex flex-col items-center gap-6 z-10 w-full px-4">
        {/* Experience Tags */}
        <div className="flex items-center justify-center gap-2 md:gap-4 text-[10px] md:text-[11px] font-bold tracking-[0.15em] text-on-surface-variant/60 flex-wrap">
          <span className="uppercase">Curated Selection</span>
          <div className="w-1 h-1 rounded-full bg-outline-variant/40"></div>
          <span className="uppercase">Seamless Service</span>
          <div className="w-1 h-1 rounded-full bg-outline-variant/40"></div>
          <span className="uppercase">Digital Sommelier</span>
        </div>

        {/* Language Selection Chip (Glassmorphism) */}
        <button 
          onClick={toggleLanguage}
          className="bg-surface/40 backdrop-blur-xl border border-outline-variant/10 px-4 py-2 rounded-full flex items-center gap-3 shadow-sm hover:bg-surface/60 transition-colors"
        >
          <span className="material-symbols-outlined text-sm text-primary">language</span>
          <span className="text-[12px] font-medium text-on-surface-variant">
            {getLanguageLabel()}
          </span>
          <span className="material-symbols-outlined text-xs text-on-surface-variant/40">expand_more</span>
        </button>
      </footer>

      {/* Decorative Texture (Subtle Noise or Grain Simulation via Gradient) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay bg-[radial-gradient(circle,rgba(0,0,0,1)_0.5px,transparent_0.5px)] bg-[length:4px_4px]"></div>
    </main>
  );
};

export default SplashScreen;
