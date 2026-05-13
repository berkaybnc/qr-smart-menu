import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBranding } from '../../context/BrandingContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { primaryColor } = useBranding();
  const restaurantName = localStorage.getItem('restaurantName') || 'Curator';

  // Mocked Bar Chart Data mapped to heights
  const peakHours = [
    { time: '12pm', height: 'h-[30%]' },
    { time: '1pm', height: 'h-[65%]' },
    { time: '2pm', height: 'h-[40%]' },
    { time: '3pm', height: 'h-[20%]' },
    { time: '4pm', height: 'h-[15%]' },
    { time: '5pm', height: 'h-[35%]' },
    { time: '6pm', height: 'h-[60%]' },
    { time: '7pm', height: 'h-[85%]' },
    { time: '8pm', height: 'h-[100%]' },
    { time: '9pm', height: 'h-[75%]' },
    { time: '10pm', height: 'h-[45%]' },
    { time: '11pm', height: 'h-[10%]' }
  ];

  const popularItems = [
    { name: "A5 Wagyu Medallions", scans: 342, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsFWUfQNkxUCuYwd1tRETUx7Tr216X7r4Y9kFGseKDs9v2ienDOax1DBTDhGtL9VfRFYSHfJaw7owye5vt_6MgRnsyhU_D_jTsuzUug4veq8L6ZDn1tpR7JDxExg93V9o4iT3hKUFDCroPC8i-hbe7aVsnqn46ht3wJMgBvoEIohCJiyHDIQ8sQwe2pYv47GKN3vv8zsU0Fc3THl0gbfhrjVAQnoZQeaxwZ4qMKHyN3eQEKJbWPMHH51BgFhYUNxO6f1VzjAuORno" },
    { name: "Truffle Infused Salad", scans: 289, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiMtr1YUZIaOvuak3JoHFeUJJHqi6R9J6Zv5LFhESGaF4qJKEeySc-2M8TNveTzeS9qjRpW7_UkjtdZJc3UxHwDIHSsbnRfUC27PyYgIS-QkGtGUDCYjrgxSUmvcOg0GGry-K2gwLN7_ywQ2hdiJ60u9t84vTuTHL4ajF3oBq2bYPh78bU2smB9FWJF_dYDGUQqSnXyZoh0t1mRzPnusp2vmczZ39RzcDrjImnihN5DEXUlinLULCDh0Usqnu2HZMLzjisTIY3-Rc" },
    { name: "Artisan Burrata Pizza", scans: 156, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApeDD5y1BlNMzjLGCP-v-fvvhbJ2cQlmq9QqgjxXrBaa0aUSen49ykmGs0dob1pzajhYfxWupXt-FiNOPLtQV2ahSMx50R7keRCkcMDudaci1H4kk3uzvciuzYFBvki2V4SOF9HDvs7WGQrgK5ESNl4WpCm7kjhWY2IKWw6sLOJ1K1m1o5SVhoZ9YE_M61svE0mlcqIZX6H405RzzmHJnapQHDxfB5fWP-Sy2N5JUN1uHhXmEUjF9JJ6NhLQ6u-PSkmtEUQS_O0sY" }
  ];

  return (
    <AdminLayout title="Dashboard" activeTab="dashboard">
      <div className="px-6 md:px-10 pb-20 max-w-[1400px] mx-auto w-full">
        {/* Page Top Header */}
        <div className="flex items-center justify-between mb-8 mt-2">
           <h2 className="text-3xl font-black font-headline tracking-tighter text-on-surface">Welcome, {restaurantName}</h2>
           {/* Decorative Date Pill */}
           <div className="bg-surface-container-high px-4 py-2 rounded-full hidden md:flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">calendar_today</span>
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Today, Oct 24</span>
           </div>
        </div>

        {/* The Bento Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Cell 1: Total Scans (Large Metric) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="md:col-span-4 bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_40px_60px_-15px_rgba(88,66,58,0.04)] flex flex-col justify-between min-h-[280px]"
          >
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="font-headline font-bold text-on-surface-variant text-sm uppercase tracking-widest mb-1">Total Scans</h3>
                  <p className="text-xs text-on-surface-variant opacity-70">Unique devices today</p>
               </div>
               <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
                 <span className="material-symbols-outlined" style={{ color: primaryColor }}>qr_code_scanner</span>
               </div>
            </div>
            <div>
               <h1 className="text-6xl font-black font-headline tracking-tighter text-on-surface mb-2">1,482</h1>
               <div className="flex items-center gap-2">
                 <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                   <span className="material-symbols-outlined text-[10px] mr-1">trending_up</span>
                   +12.5%
                 </span>
                 <span className="text-xs text-on-surface-variant opacity-60">vs yesterday</span>
               </div>
            </div>
          </motion.div>

          {/* Bento Cell 2: Peak Hours Bar Chart (Middle Large) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="md:col-span-8 bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_40px_60px_-15px_rgba(88,66,58,0.04)] flex flex-col min-h-[280px]"
          >
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="font-headline font-bold text-on-surface-variant text-sm uppercase tracking-widest mb-1">Peak Gastronomic Hours</h3>
                  <p className="text-xs text-on-surface-variant opacity-70">Menu interactions segmented by hour</p>
               </div>
            </div>
            
            {/* Minimalist Chart Container */}
            <div className="flex-1 flex items-end justify-between gap-2 pt-4">
              {peakHours.map((bar, idx) => (
                <div key={idx} className="flex flex-col items-center justify-end h-full w-full group relative">
                    {/* Tooltip mockup */}
                    <div className="absolute -top-8 bg-surface-container-highest text-on-surface text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      {Math.floor(Math.random() * 200) + 50}
                    </div>
                    {/* Bar */}
                    <div 
                      className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:opacity-80 cursor-pointer ${bar.height}`}
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                    {/* Label */}
                    <span className="text-[10px] font-bold text-on-surface-variant mt-3 uppercase opacity-60">{bar.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bento Cell 3: Popular Items (Lower Half Row) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="md:col-span-6 bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_40px_60px_-15px_rgba(88,66,58,0.04)]"
          >
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-headline font-bold text-on-surface-variant text-sm uppercase tracking-widest">Client Favorites</h3>
               <button className="text-xs font-bold hover:underline" style={{ color: primaryColor }}>View All</button>
            </div>
            <div className="space-y-6">
              {popularItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="text-xl font-bold font-headline text-on-surface-variant/30 w-4">
                    {idx + 1}
                  </div>
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="font-bold text-sm text-on-surface font-headline truncate">{item.name}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-on-surface">{item.scans}</div>
                    <div className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60 font-bold">Clicks</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bento Cell 4: Quick Actions / Status */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="md:col-span-6 bg-surface-container-low rounded-[2rem] p-8 shadow-inner flex flex-col"
          >
             <h3 className="font-headline font-bold text-on-surface-variant text-sm uppercase tracking-widest mb-6">System Health</h3>
             <div className="space-y-4 flex-1">
                <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-green-600">check_circle</span>
                     <span className="text-sm font-bold text-on-surface font-headline">QR Endpoints Active</span>
                   </div>
                   <span className="text-xs text-on-surface-variant opacity-60 border border-outline-variant/30 px-2 py-1 rounded-full">Optimal</span>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-primary" style={{ color: primaryColor }}>campaign</span>
                     <span className="text-sm font-bold text-on-surface font-headline">Campaign 3-Sec Rule Status</span>
                   </div>
                   <span className="text-xs text-on-surface-variant opacity-60 border border-outline-variant/30 px-2 py-1 rounded-full">Active</span>
                </div>
             </div>
          </motion.div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
