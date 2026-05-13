import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BrandingProvider } from './context/BrandingContext';

// Components & Layouts
import SplashScreen from './components/SplashScreen';
import MenuLayout from './components/MenuLayout';

// Pages
import CustomerMenu from './pages/CustomerMenu';
import CustomerCampaigns from './pages/CustomerCampaigns';
import Login from './pages/admin/Login';
import BrandingEngine from './pages/admin/BrandingEngine';
import ProductManagement from './pages/admin/ProductManagement';
import QRDesigner from './pages/admin/QRDesigner';
import Dashboard from './pages/admin/Dashboard';
import Settings from './pages/admin/Settings';
import CampaignManagement from './pages/admin/CampaignManagement';

const CustomerFlow = () => {
  const [booted, setBooted] = useState(false);

  return (
    <>
      {!booted ? (
        <SplashScreen onComplete={() => setBooted(true)} />
      ) : (
        <MenuLayout>
          <CustomerMenu />
        </MenuLayout>
      )}
    </>
  );
};

// Protected Route Integration
const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('adminAuth') === 'true';
  return isAuth ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  return (
    <Routes>
      {/* Front-Facing Application dynamically tied to the QR URL parameter */}
      <Route path="/m/:slug" element={<CustomerFlow />} />
      <Route path="/m/:slug/campaigns" element={<MenuLayout><CustomerCampaigns /></MenuLayout>} />
      
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Admin Dashboard Suite */}
      <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
      <Route path="/admin/branding" element={<ProtectedRoute><BrandingEngine /></ProtectedRoute>} />
      <Route path="/admin/qr" element={<ProtectedRoute><QRDesigner /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/admin/campaigns" element={<ProtectedRoute><CampaignManagement /></ProtectedRoute>} />
    </Routes>
  );
};

function App() {
  return (
    <BrandingProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </BrandingProvider>
  );
}

export default App;
