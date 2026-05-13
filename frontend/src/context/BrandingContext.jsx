import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosInstance';

const BrandingContext = createContext(null);

export const BrandingProvider = ({ children }) => {
  // SaaS settings
  const [primaryColor, setPrimaryColor] = useState(localStorage.getItem('tenantPrimaryColor') || '#a93702');
  const [restaurantLogo, setRestaurantLogo] = useState(null); 
  const [logoBorderRadius, setLogoBorderRadius] = useState('full');
  const [ownerAvatarUrl, setOwnerAvatarUrl] = useState(null); 
  const [language, setLanguage] = useState('en'); 
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('TRY');
  
  // Custom QR Settings
  const [qrColor, setQrColor] = useState(null);
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [qrShape, setQrShape] = useState('squares');
  const [qrEyeStyle, setQrEyeStyle] = useState('square');
  const [qrLogoUrl, setQrLogoUrl] = useState(null);

  // Sync state across load
  useEffect(() => {
    const fetchUniversalSettings = async () => {
        try {
            const res = await api.get('/admin/restaurant');
            if (res.data) {
            const data = res.data;
            if (data.primaryColor) {
                setPrimaryColor(data.primaryColor);
                localStorage.setItem('tenantPrimaryColor', data.primaryColor);
            }
            if (data.logoUrl) setRestaurantLogo(data.logoUrl);
            if (data.logoBorderRadius) setLogoBorderRadius(data.logoBorderRadius);
            if (data.ownerAvatarUrl) setOwnerAvatarUrl(data.ownerAvatarUrl);
            if (data.language) setLanguage(data.language);
            if (data.darkMode !== undefined) setDarkMode(data.darkMode);
            if (data.currency) setCurrency(data.currency);
            
            if (data.qrColor) setQrColor(data.qrColor);
            if (data.qrBgColor) setQrBgColor(data.qrBgColor);
            if (data.qrShape) setQrShape(data.qrShape);
            if (data.qrEyeStyle) setQrEyeStyle(data.qrEyeStyle);
            if (data.qrLogoUrl) setQrLogoUrl(data.qrLogoUrl);
            
            // Temporary generic store to help non-context UI
            localStorage.setItem('tenantName', data.name || '');
            localStorage.setItem('tenantSlug', data.slug || '');
            }
        } catch(e) {
            console.error('Failed to sync global restaurant identity', e);
        }
    };
    fetchUniversalSettings();
  }, []);

  // Sync RTL and lang and theme mode
  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    document.documentElement.style.setProperty('--color-primary', primaryColor);
    
    if (darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [language, darkMode, primaryColor]);

  return (
    <BrandingContext.Provider 
      value={{ 
        primaryColor, setPrimaryColor, 
        restaurantLogo, setRestaurantLogo, 
        logoBorderRadius, setLogoBorderRadius,
        ownerAvatarUrl, setOwnerAvatarUrl,
        language, setLanguage,
        darkMode, setDarkMode,
        currency, setCurrency,
        qrColor, setQrColor,
        qrBgColor, setQrBgColor,
        qrShape, setQrShape,
        qrEyeStyle, setQrEyeStyle,
        qrLogoUrl, setQrLogoUrl
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
