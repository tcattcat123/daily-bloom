import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface SupportRayButtonProps {
  variant?: 'default' | 'welcome';
}

const SupportRayButton = ({ variant = 'default' }: SupportRayButtonProps) => {
  const [isSending, setIsSending] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleSendRay = () => {
    if (isSending) return;
    
    setIsSending(true);
    
    // Create sparkle animation
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setSparkles(newSparkles);
    
    // Show success toast
    setTimeout(() => {
      toast.success('Луч поддержки отправлен! ✨', {
        description: 'Случайный пользователь получит ваше тепло',
      });
      setIsSending(false);
      setSparkles([]);
    }, 800);
  };

  if (variant === 'welcome') {
    return (
      <div className="relative inline-flex">
        <button
          onClick={handleSendRay}
          disabled={isSending}
          className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm"
        >
          <Sparkles className={`w-4 h-4 transition-all duration-300 ${isSending ? 'animate-pulse text-yellow-400' : 'group-hover:text-yellow-400'}`} />
          <span>Отправить луч поддержки</span>
        </button>
        
        {/* Sparkle effects */}
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-ping pointer-events-none"
            style={{
              transform: `translate(${sparkle.x}px, ${sparkle.y}px)`,
              animationDuration: '0.6s',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative inline-flex">
      <Button
        onClick={handleSendRay}
        disabled={isSending}
        variant="outline"
        size="sm"
        className="gap-1.5 h-8 text-xs border-habit-green/30 text-habit-green hover:bg-habit-green/10 hover:border-habit-green"
      >
        <Sparkles className={`w-3.5 h-3.5 ${isSending ? 'animate-pulse' : ''}`} />
        <span className="hidden sm:inline">Луч поддержки</span>
        <span className="sm:hidden">✨</span>
      </Button>
      
      {/* Sparkle effects */}
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute top-1/2 left-1/2 w-1 h-1 bg-habit-green rounded-full animate-ping pointer-events-none"
          style={{
            transform: `translate(${sparkle.x}px, ${sparkle.y}px)`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
};

export default SupportRayButton;
