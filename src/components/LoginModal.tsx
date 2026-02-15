import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [loginMethod, setLoginMethod] = useState<'nickname' | 'email'>('nickname');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginWithNickname } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (loginMethod === 'nickname') {
        if (nickname.trim().length < 2) {
          setError('Минимум 2 символа');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 1) {
          setError('Введите пароль');
          setIsSubmitting(false);
          return;
        }
        await loginWithNickname(nickname.trim(), password);
      } else {
        if (!email || !email.includes('@')) {
          setError('Некорректный email');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 1) {
          setError('Введите пароль');
          setIsSubmitting(false);
          return;
        }
        await login(email, password);
      }
      onClose();
      navigate('/app');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      if (errorMessage.includes('Invalid login credentials')) {
        setError('Неверный логин или пароль');
      } else {
        setError(errorMessage);
      }
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setNickname('');
    setError('');
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Вход в систему</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={loginMethod === 'nickname' ? 'default' : 'outline'}
              onClick={() => setLoginMethod('nickname')}
              className="flex-1"
            >
              По никнейму
            </Button>
            <Button
              type="button"
              variant={loginMethod === 'email' ? 'default' : 'outline'}
              onClick={() => setLoginMethod('email')}
              className="flex-1"
            >
              По email
            </Button>
          </div>

          {loginMethod === 'nickname' ? (
            <Input
              placeholder="Никнейм"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError('');
              }}
              autoFocus
            />
          ) : (
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              autoFocus
            />
          )}

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Пароль"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
