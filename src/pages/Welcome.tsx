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
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
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
          <p className="text-white/50 text-sm font-medium tracking-wide uppercase">
            Система выработки железной дисциплины
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-scale-in">
          <h2 className="text-xl font-semibold text-white mb-1">
            {isLogin ? 'Вход в аккаунт' : 'Создать аккаунт'}
          </h2>
          <p className="text-sm text-white/40 mb-8">
            {isLogin 
              ? 'Введите данные для входа' 
              : 'Начните путь к дисциплине'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
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
                  autoFocus={!isLogin}
                />
              </div>
            )}

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
                autoFocus={isLogin}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white/60 transition-colors" />
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="h-14 text-base pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-white/30 focus:ring-0 focus:bg-white/[0.07] transition-all"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 text-base font-semibold gap-2 bg-white text-black hover:bg-white/90 rounded-xl mt-6 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              disabled={isSubmitting || !email || !password || (!isLogin && !nickname.trim())}
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

        {/* Features preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className="text-2xl mb-2">💪</div>
            <div className="text-[11px] text-white/40 font-medium">Дисциплина</div>
          </div>
          <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className="text-2xl mb-2">🔁</div>
            <div className="text-[11px] text-white/40 font-medium">Привычки</div>
          </div>
          <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-[11px] text-white/40 font-medium">Результат</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
