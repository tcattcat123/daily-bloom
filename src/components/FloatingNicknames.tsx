import { useEffect, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

interface FloatingNickname {
  id: string;
  nickname: string;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  opacity: number;
  size: number;
}

const FloatingNicknames = () => {
  const isMobile = useIsMobile();
  const [nicknames, setNicknames] = useState<string[]>([]);
  const [floatingItems, setFloatingItems] = useState<FloatingNickname[]>([]);

  // Fetch nicknames from database
  useEffect(() => {
    const fetchNicknames = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('nickname')
        .not('nickname', 'is', null)
        .limit(30);

      if (data) {
        const names = data
          .map(p => p.nickname)
          .filter((n): n is string => n !== null && n.length > 0);
        setNicknames(names);
      }
    };

    fetchNicknames();
  }, []);

  // Initialize floating items when nicknames change
  useEffect(() => {
    if (nicknames.length === 0) return;

    // Limit items on mobile for performance
    const maxItems = isMobile ? 8 : nicknames.length;
    const limitedNames = nicknames.slice(0, maxItems);
    const items: FloatingNickname[] = limitedNames.map((nickname, index) => ({
      id: `${nickname}-${index}`,
      nickname,
      x: Math.random() * 100,
      y: Math.random() * 100,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
      opacity: 0.08 + Math.random() * 0.12,
      size: 12 + Math.random() * 8,
    }));

    setFloatingItems(items);
  }, [nicknames, isMobile]);

  useEffect(() => {
    if (floatingItems.length === 0) return;

    // Use slower interval on mobile (250ms vs 80ms)
    const intervalMs = isMobile ? 250 : 80;
    
    const updatePositions = () => {
      setFloatingItems(prevItems => prevItems.map(item => {
        let newX = item.x + item.speedX;
        let newY = item.y + item.speedY;
        let newSpeedX = item.speedX;
        let newSpeedY = item.speedY;

        // Bounce off edges
        if (newX <= 0 || newX >= 100) {
          newSpeedX = -newSpeedX;
          newX = Math.max(0, Math.min(100, newX));
        }
        if (newY <= 0 || newY >= 100) {
          newSpeedY = -newSpeedY;
          newY = Math.max(0, Math.min(100, newY));
        }

        return {
          ...item,
          x: newX,
          y: newY,
          speedX: newSpeedX,
          speedY: newSpeedY,
        };
      }));
    };

    const interval = setInterval(updatePositions, intervalMs);

    return () => clearInterval(interval);
  }, [floatingItems.length, isMobile]);

  if (floatingItems.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform">
      {floatingItems.map(item => (
        <div
          key={item.id}
          className="absolute whitespace-nowrap font-medium text-white select-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            opacity: item.opacity,
            fontSize: `${item.size}px`,
            transform: 'translate(-50%, -50%)',
            textShadow: '0 0 20px rgba(255,255,255,0.1)',
          }}
        >
          {item.nickname}
        </div>
      ))}
    </div>
  );
};

export default FloatingNicknames;
