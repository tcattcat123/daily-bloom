import { useState, useEffect } from 'react';
import { Zap, X } from 'lucide-react';

const PWAInstallBanner = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        // Check if already in standalone mode safely
        const checkStandalone = () => {
            try {
                return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
            } catch (e) {
                return false;
            }
        };

        if (checkStandalone()) {
            setShowBanner(false);
            return;
        }

        // Only show on mobile/tablet platforms (screen width < 1024px)
        const isMobileSize = window.innerWidth < 1024;

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            if (isMobileSize) {
                setShowBanner(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        // iOS check
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        if (isIOS && !checkStandalone() && isMobileSize) {
            setShowBanner(true);
        }

        const handleResize = () => {
            const isMobileNow = window.innerWidth < 1024;
            if (!isMobileNow) {
                setShowBanner(false);
            } else if (deferredPrompt || isIOS) {
                setShowBanner(true);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('resize', handleResize);
        };
    }, [isMounted, deferredPrompt]);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                alert('Чтобы установить приложение: нажмите "Поделиться" и выберите "На экран Домой"');
            }
            return;
        }
        try {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowBanner(false);
            }
            setDeferredPrompt(null);
        } catch (err) {
            console.error('Install prompt failed', err);
        }
    };

    if (!showBanner || !isMounted) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] animate-in slide-in-from-top duration-500">
            <div className="bg-[#10b981] text-white px-4 py-2 flex items-center justify-between shadow-lg border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1 rounded-full text-white">
                        <Zap className="w-4 h-4 fill-white" />
                    </div>
                    <span className="text-[13px] font-bold tracking-tight">Открыть в приложении</span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleInstall}
                        className="bg-white text-[#10b981] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-white/90 transition-all active:scale-95 shadow-sm"
                    >
                        Установить
                    </button>
                    <button
                        onClick={() => setShowBanner(false)}
                        className="text-white/70 hover:text-white p-1 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PWAInstallBanner;
