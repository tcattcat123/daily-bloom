import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, ArrowRight, Mail, Lock, User, Eye, EyeOff, Download, Smartphone } from 'lucide-react';
import { z } from 'zod';
import FloatingNicknames from '@/components/FloatingNicknames';
import SupportRayButton from '@/components/SupportRayButton';

const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  nickname: z.string().min(2, 'Минимум 2 символа').max(20, 'Максимум 20 символов'),
});

const loginByNicknameSchema = z.object({
  nickname: z.string().min(2, 'Минимум 2 символа'),
  password: z.string().min(1, 'Введите пароль'),
});

const loginByEmailSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

const Welcome = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'nickname' | 'email'>('nickname');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { register, login, loginWithNickname } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      alert('Нажмите "Поделиться" → "На экран Домой"');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        if (loginMethod === 'nickname') {
          const result = loginByNicknameSchema.safeParse({ nickname: nickname.trim(), password });
          if (!result.success) {
            setError(result.error.errors[0].message);
            setIsSubmitting(false);
            return;
          }
          await loginWithNickname(nickname.trim(), password);
        } else {
          const result = loginByEmailSchema.safeParse({ email, password });
          if (!result.success) {
            setError(result.error.errors[0].message);
            setIsSubmitting(false);
            return;
          }
          await login(email, password);
        }
        navigate('/');
      } else {
        const result = registerSchema.safeParse({ email, password, nickname: nickname.trim() });
        if (!result.success) {
          setError(result.error.errors[0].message);
          setIsSubmitting(false);
          return;
        }

        await register(email, password, nickname.trim());
        navigate('/');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';

      if (errorMessage.includes('User already registered')) {
        setError('Пользователь с таким email уже существует');
      } else if (errorMessage.includes('Invalid login credentials')) {
        setError(loginMethod === 'nickname' ? 'Неверный никнейм или пароль' : 'Неверный email или пароль');
      } else if (errorMessage.includes('Пользователь не найден')) {
        setError('Пользователь с таким никнеймом не найден');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Nicknames */}
      <FloatingNicknames />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.02]" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)]">
              <Sparkles className="w-7 h-7 text-black" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">HumanOS</h1>
          <p className="text-white/50 text-sm font-medium tracking-wide uppercase mb-5">
            Система выработки железной дисциплины
          </p>
          {/* Support Ray Button */}
          <SupportRayButton variant="welcome" />
        </div>

        {/* Auth Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-scale-in">
          <h2 className="text-xl font-semibold text-white mb-1">
            {isLogin ? 'Вход в аккаунт' : 'Создать аккаунт'}
          </h2>
          <p className="text-sm text-white/40 mb-6">
            {isLogin
              ? 'Введите данные для входа'
              : 'Начните путь к дисциплине'}
          </p>

          {/* Login method toggle - only for login */}
          {isLogin && (
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => { setLoginMethod('nickname'); setError(''); }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${loginMethod === 'nickname'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-white/40 hover:text-white/60'
                  }`}
              >
                По нику
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('email'); setError(''); }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${loginMethod === 'email'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-white/40 hover:text-white/60'
                  }`}
              >
                По email
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nickname field - for login by nickname or registration */}
            {(loginMethod === 'nickname' || !isLogin) && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white/60 transition-colors" />
                <Input
                  type="text"
                  placeholder="Никнейм"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setError('');
                  }}
                  className="h-14 text-base pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-white/30 focus:ring-0 focus:bg-white/[0.07] transition-all"
                  maxLength={20}
                  autoFocus
                />
              </div>
            )}

            {/* Email field - for login by email or registration */}
            {(loginMethod === 'email' || !isLogin) && (
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white/60 transition-colors" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="h-14 text-base pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-white/30 focus:ring-0 focus:bg-white/[0.07] transition-all"
                  autoFocus={isLogin && loginMethod === 'email'}
                />
              </div>
            )}

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white/60 transition-colors" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Пароль"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="h-14 text-base pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-white/30 focus:ring-0 focus:bg-white/[0.07] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-14 text-base font-semibold gap-2 bg-white text-black hover:bg-white/90 rounded-xl mt-6 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              disabled={
                isSubmitting ||
                !password ||
                (isLogin && loginMethod === 'nickname' && !nickname.trim()) ||
                (isLogin && loginMethod === 'email' && !email) ||
                (!isLogin && (!nickname.trim() || !email))
              }
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Войти' : 'Создать аккаунт'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>

        {/* Install App Button */}
        <div className="mt-5 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <button
            onClick={handleInstallApp}
            className="w-full group relative flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors relative z-10">
              <Download className="w-4.5 h-4.5 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col items-start relative z-10">
              <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">Установить приложение</span>
              <span className="text-[11px] text-white/35 group-hover:text-white/50 transition-colors">Быстрый доступ с главного экрана</span>
            </div>
            <Smartphone className="w-4 h-4 text-white/20 ml-auto relative z-10" />
          </button>
        </div>

        {/* Telegram link */}
        <div className="mt-4 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-white/40 text-xs mb-2">
            Вопросы и пожелания оставляйте в Telegram
          </p>
          <a
            href="https://t.me/+kbDT71ZQ6CdlOGQ1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Написать в Telegram
          </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
