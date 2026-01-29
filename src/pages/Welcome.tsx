import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, ArrowRight } from 'lucide-react';

const Welcome = () => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError('Введите никнейм');
      return;
    }
    if (trimmed.length < 2) {
      setError('Минимум 2 символа');
      return;
    }
    if (trimmed.length > 20) {
      setError('Максимум 20 символов');
      return;
    }

    register(trimmed);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-background" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">HumanOS</h1>
          <p className="text-muted-foreground text-sm">
            Система управления привычками для перфекционистов
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Добро пожаловать!
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Введите никнейм, чтобы начать создавать свой план на неделю
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Ваш никнейм"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setError('');
                }}
                className="h-12 text-base"
                maxLength={20}
                autoFocus
              />
              {error && (
                <p className="text-destructive text-xs mt-1.5">{error}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium gap-2"
              disabled={!nickname.trim()}
            >
              Начать
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Features preview */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="bg-card/50 rounded-xl p-3 border border-border/50">
            <div className="text-lg mb-1">☀️</div>
            <div className="text-[10px] text-muted-foreground">Утренние ритуалы</div>
          </div>
          <div className="bg-card/50 rounded-xl p-3 border border-border/50">
            <div className="text-lg mb-1">📊</div>
            <div className="text-[10px] text-muted-foreground">Трекинг привычек</div>
          </div>
          <div className="bg-card/50 rounded-xl p-3 border border-border/50">
            <div className="text-lg mb-1">🎯</div>
            <div className="text-[10px] text-muted-foreground">Цели на неделю</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
