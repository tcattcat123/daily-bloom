import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, ArrowRight, Mail, Lock, User } from 'lucide-react';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  nickname: z.string().min(2, 'Минимум 2 символа').max(20, 'Максимум 20 символов'),
});

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

const Welcome = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
          setError(result.error.errors[0].message);
          setIsSubmitting(false);
          return;
        }

        await login(email, password);
        navigate('/');
      } else {
        const result = registerSchema.safeParse({ email, password, nickname: nickname.trim() });
        if (!result.success) {
          setError(result.error.errors[0].message);
          setIsSubmitting(false);
          return;
        }

        await register(email, password, nickname.trim());
        // После регистрации пользователь будет автоматически залогинен
        navigate('/');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      
      // Friendly error messages
      if (errorMessage.includes('User already registered')) {
        setError('Пользователь с таким email уже существует');
      } else if (errorMessage.includes('Invalid login credentials')) {
        setError('Неверный email или пароль');
      } else if (errorMessage.includes('Email not confirmed')) {
        setError('Подтвердите email перед входом');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Auth Card */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            {isLogin ? 'Вход в аккаунт' : 'Создать аккаунт'}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {isLogin 
              ? 'Введите email и пароль для входа' 
              : 'Заполните данные, чтобы начать использовать HumanOS'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Никнейм"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setError('');
                  }}
                  className="h-12 text-base pl-10"
                  maxLength={20}
                  autoFocus={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="h-12 text-base pl-10"
                autoFocus={isLogin}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="h-12 text-base pl-10"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium gap-2"
              disabled={isSubmitting || !email || !password || (!isLogin && !nickname.trim())}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Войти' : 'Создать аккаунт'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
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
