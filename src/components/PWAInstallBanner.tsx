import { useState, useEffect } from 'react';
import { Zap, X } from 'lucide-react';

const PWAInstallBanner = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        if (isStandalone) {
            setShowBanner(false);
            return;
        }

        // Only show on mobile/tablet platforms (screen width < 1024px)
        const isMobileSize = window.innerWidth < 1024;
        if (!isMobileSize) {
            setShowBanner(false);
            return;
        }

        const handler = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Also show on iOS if not standalone (manual instructions)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        if (isIOS && !isStandalone) {
            setShowBanner(true);
        }

        const handleResize = () => {
            if (window.innerWidth >= 1024) {
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
    }, [deferredPrompt]);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            // If no prompt (e.g. iOS), just show a message or do nothing
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                alert('Чтобы установить приложение: нажмите "Поделиться" и выберите "На экран Домой"');
            }
            return;
        }
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] animate-in slide-in-from-top duration-500">
            <div className="bg-habit-green text-white px-4 py-2 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1 rounded-full text-white">
                        <Zap className="w-4 h-4 fill-white" />
                    </div>
                    <span className="text-sm font-bold tracking-tight">Открыть в приложении</span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleInstall}
                        className="bg-white text-habit-green px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-white/90 transition-colors"
                    >
                        Установить
                    </button>
                    <button
                        onClick={() => setShowBanner(false)}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PWAInstallBanner;
