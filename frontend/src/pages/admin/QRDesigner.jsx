import React, { useState, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBranding } from '../../context/BrandingContext';
import { QRCode } from 'react-qrcode-logo';
import toast from 'react-hot-toast';

const QRDesigner = () => {
    const { 
        primaryColor, 
        qrColor, setQrColor, 
        qrBgColor, setQrBgColor, 
        qrShape, setQrShape, 
        qrEyeStyle, setQrEyeStyle, 
        qrLogoUrl, setQrLogoUrl 
    } = useBranding();
    const qrRef = useRef(null);

    // Dynamic URL bound to localStorage tenantSlug
    const tenantSlug = localStorage.getItem('tenantSlug') || 'demo-tenant';
    const menuUrl = `${window.location.protocol}//${window.location.host}/m/${tenantSlug}`;

    const [safeLogoUrl, setSafeLogoUrl] = useState(null);

    React.useEffect(() => {
        if (!qrLogoUrl) {
            setSafeLogoUrl(null);
            return;
        }
        
        // If it's already a Data URI, no CORS issues
        if (qrLogoUrl.startsWith('data:')) {
            setSafeLogoUrl(qrLogoUrl);
            return;
        }
        
        // Otherwise, fetch natively to convert to Base64 to bypass React-QRCode-Logo tainted canvas crash
        fetch(qrLogoUrl, { mode: 'cors' })
            .then(res => res.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => setSafeLogoUrl(reader.result);
                reader.readAsDataURL(blob);
            })
            .catch(err => {
                console.error("Base64 security conversion failed:", err);
                setSafeLogoUrl(qrLogoUrl); // Desperate fallback
            });
    }, [qrLogoUrl]);

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const api = (await import('../../api/axiosInstance')).default;
                const res = await api.post('/admin/upload', formData);
                setQrLogoUrl(res.data.imageUrl);
            } catch(e) {
                console.error("Upload error", e);
                // Fallback to local 
                const reader = new FileReader();
                reader.onloadend = () => setQrLogoUrl(reader.result);
                reader.readAsDataURL(file);
            }
        }
    };
    
    const handleSaveQrConfig = async () => {
        try {
            const api = (await import('../../api/axiosInstance')).default;
            await api.put('/admin/restaurant', {
                qrColor,
                qrBgColor,
                qrShape,
                qrEyeStyle,
                qrLogoUrl
            });
            toast.success('QR Configuration saved securely');
        } catch(error) {
            console.error('Failed to save QR configuration.', error);
            toast.error('Failed to save configuration.');
        }
    };

    const downloadQR = () => {
        try {
            // react-qrcode-logo renders a canvas internally. We explicitly bind by ID.
            const canvas = document.getElementById('print-qr-canvas');
            if (canvas) {
                const pngUrl = canvas.toDataURL("image/png");
                let downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = `${tenantSlug}-qr.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                toast.success('QR code downloaded successfully.');
            } else {
                toast.error("Matrix canvas not found. Render delay in progress.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Image blocked by browser security (CORS). Try removing and re-uploading the logo.");
        }
    };

    return (
        <AdminLayout title="QR Designer" activeTab="qr">
            <div className="px-6 md:px-10 pb-20 max-w-[1400px] mx-auto w-full">
                <div className="flex items-center justify-between mb-8 mt-2">
                    <h2 className="text-3xl font-black font-headline tracking-tighter text-on-surface">QR Architecture</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="bg-surface-container-low rounded-3xl p-8 border border-surface-container-high/50">
                            <h3 className="text-xl font-bold font-headline mb-4">Digital Identity</h3>
                            <p className="text-sm font-body text-on-surface-variant mb-6">Your QR code uses the exact primary color from your Branding Engine. Upload a logo to embed it permanently into the center.</p>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Embedded Center Logo</label>
                                <div 
                                    className="relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container-highest hover:bg-surface-container-high transition-colors cursor-pointer group"
                                    style={{ borderColor: qrLogoUrl ? primaryColor : 'rgba(var(--color-outline-variant), 0.3)' }}
                                >
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleLogoUpload} accept="image/*" />
                                    {qrLogoUrl ? (
                                        <div className="flex flex-col items-center gap-4">
                                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                              <img src={qrLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                                          </div>
                                          <button onClick={(e) => { e.preventDefault(); setQrLogoUrl(null); }} className="text-xs text-error font-bold tracking-wider uppercase z-20 relative px-4 py-1 bg-error/10 rounded-full">Remove</button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">add_photo_alternate</span>
                                            <span className="text-xs mt-2 font-bold text-on-surface-variant">Upload Vector or PNG</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-6 mt-6">
                                <div className="w-1/2">
                                   <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Foreground Hue (Dots)</label>
                                   <div className="flex items-center gap-3 bg-surface-container-higher p-2 rounded-xl border border-surface-container-high">
                                      <input type="color" value={qrColor || primaryColor} onChange={(e) => setQrColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer shrink-0 border-0" />
                                      <div className="flex flex-col">
                                         <span className="text-xs font-bold text-on-surface">Matrix Ink</span>
                                         <span className="text-[10px] text-on-surface-variant opacity-60">{qrColor || primaryColor}</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="w-1/2">
                                   <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Background Color</label>
                                   <div className="flex items-center gap-3 bg-surface-container-higher p-2 rounded-xl border border-surface-container-high">
                                      <input type="color" value={qrBgColor || '#ffffff'} onChange={(e) => setQrBgColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer shrink-0 border-0" />
                                      <div className="flex flex-col">
                                         <span className="text-xs font-bold text-on-surface">Base Canvas</span>
                                         <span className="text-[10px] text-on-surface-variant opacity-60">{qrBgColor || '#ffffff'}</span>
                                      </div>
                                   </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-6 mt-6">
                                <div className="w-1/2">
                                   <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Dot Architecture</label>
                                   <select 
                                       value={qrShape} 
                                       onChange={(e) => setQrShape(e.target.value)} 
                                       className="w-full bg-surface-container-higher text-sm p-3 rounded-xl border border-surface-container-high outline-none font-bold text-on-surface transition-all focus:ring-2"
                                       style={{ '--tw-ring-color': primaryColor, focusBorderColor: primaryColor }}
                                   >
                                       <option value="squares">Sharp Cubes (Classic)</option>
                                       <option value="dots">Fluid Dots (Modern)</option>
                                   </select>
                                </div>
                                <div className="w-1/2">
                                   <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Eye Frame Style</label>
                                   <select 
                                       value={qrEyeStyle} 
                                       onChange={(e) => setQrEyeStyle(e.target.value)} 
                                       className="w-full bg-surface-container-higher text-sm p-3 rounded-xl border border-surface-container-high outline-none font-bold text-on-surface transition-all focus:ring-2"
                                       style={{ '--tw-ring-color': primaryColor, focusBorderColor: primaryColor }}
                                   >
                                       <option value="square">Industrial Sharp</option>
                                       <option value="circle">Smooth Orbs</option>
                                       <option value="leaf">Curator Leaf</option>
                                   </select>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-surface-container-high mt-8">
                                <button onClick={handleSaveQrConfig} className="w-full py-4 text-white font-headline font-bold rounded-full shadow-[0_10px_20px_-10px_rgba(88,66,58,0.5)] active:scale-95 transition-all text-sm uppercase tracking-widest" style={{ backgroundColor: primaryColor }}>
                                    Save Configurations
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-surface-container-lowest rounded-3xl p-12 shadow-2xl border border-surface-container-low">
                        <div ref={qrRef} className="p-6 rounded-3xl shadow-[0_40px_60px_-15px_rgba(88,66,58,0.15)] border border-surface-container" style={{ borderRadius: qrShape === 'dots' ? '3rem' : '1.5rem', backgroundColor: qrBgColor || '#ffffff', overflow: 'hidden' }}>
                            <QRCode 
                                id="print-qr-canvas"
                                value={menuUrl} 
                                size={250} 
                                ecLevel="H"
                                bgColor={qrBgColor || "#ffffff"}
                                fgColor={qrColor || primaryColor}
                                qrStyle={qrShape === 'dots' ? 'dots' : 'squares'}
                                eyeRadius={qrEyeStyle === 'circle' ? [12, 12, 12, 12] : (qrEyeStyle === 'leaf' ? [15, 0, 15, 0] : [0, 0, 0, 0])}
                                eyeColor={qrColor || primaryColor}
                                logoImage={safeLogoUrl || undefined}
                                logoWidth={50}
                                logoHeight={50}
                                logoCrossOrigin="anonymous"
                                removeQrCodeBehindLogo={true}
                                logoPadding={2}
                                quietZone={5}
                            />
                        </div>
                        <p className="mt-8 text-on-surface-variant font-body text-sm font-medium text-center">Scan to preview live environment:<br/> <a href={menuUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4 text-primary font-bold" style={{ color: primaryColor }}>{menuUrl}</a></p>
                        
                        <button 
                            onClick={downloadQR}
                            className="mt-8 w-full py-4 text-white font-headline font-bold rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 uppercase tracking-widest text-sm" 
                            style={{ backgroundColor: primaryColor }}
                        >
                            Export Print-Ready
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default QRDesigner;
