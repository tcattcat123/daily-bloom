import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, Brain, Sparkles, Lock, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const VALID_INVITES = ["FOCUS2026", "START", "BETA", "WELCOME"];

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"invite" | "buy" | "search" | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmitInvite = async () => {
    const code = inviteCode.trim().toUpperCase();

    // Check hardcoded codes first
    if (VALID_INVITES.includes(code)) {
      setIsModalOpen(false);
      navigate("/welcome");
      return;
    }

    // Check database codes
    try {
      const { data, error } = await supabase
        .from('invite_codes')
        .select('*')
        .eq('code', code)
        .eq('used', false)
        .single();

      if (error || !data) {
        setError("Неверный или уже использованный инвайт-код.");
        return;
      }

      // Mark code as used
      await supabase
        .from('invite_codes')
        .update({
          used: true,
          used_at: new Date().toISOString()
        })
        .eq('code', code);

      setIsModalOpen(false);
      navigate("/welcome");
    } catch (err) {
      setError("Ошибка проверки кода.");
    }
  };

  const handleSearchCode = () => {
    setIsModalOpen(false);
    // Just close and let them search
  };

  return (
    <>
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/fcs.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="badge-label mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Для людей с СДВГ и расфокусом</span>
          </div>

          <h1 className="font-heading font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-8">
            Верни себе
            <br />
            <span className="text-primary glow-text">фокус</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-12">
            2 минуты в день — и ты запускаешь дофаминовый фон, который перестраивает мозг. Без силы воли, без выгорания.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center gap-3 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-2xl hover:shadow-[0_0_50px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300 hover:-translate-y-0.5 pulse-ring"
            >
              <Brain className="w-5 h-5" />
              <span>Начать</span>
            </button>
            <a
              href="#mechanics"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-6 py-4 rounded-2xl border border-border hover:border-muted-foreground/30 transition-all duration-300"
            >
              <span>Как это работает</span>
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { val: "2 мин", label: "в день" },
              { val: "21", label: "день привычки" },
              { val: "9", label: "кодов на месяц" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <span className="font-heading font-bold text-2xl md:text-3xl text-foreground">{s.val}</span>
                <span className="block text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) {
          setSelectedOption(null);
          setInviteCode("");
          setError("");
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Как получить доступ?</DialogTitle>
          </DialogHeader>

          {!selectedOption ? (
            <div className="space-y-3 pt-4">
              <button
                onClick={() => setSelectedOption("invite")}
                className="w-full flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
              >
                <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Ввести инвайт-код</div>
                  <div className="text-sm text-muted-foreground">Получи код от участников</div>
                </div>
              </button>

              <button
                onClick={() => window.open("https://t.me/+kbDT71ZQ6CdlOGQ1", "_blank")}
                className="w-full flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
              >
                <Search className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Выполнить задание</div>
                  <div className="text-sm text-muted-foreground">Получи код за выполнение задания в Telegram</div>
                </div>
              </button>
            </div>
          ) : selectedOption === "invite" ? (
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Введите инвайт-код, полученный от участников.{" "}
                <a
                  href="https://t.me/+kbDT71ZQ6CdlOGQ1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                  Искать код в Telegram →
                </a>
              </p>
              <Input
                placeholder="Введите код..."
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value);
                  setError("");
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSubmitInvite()}
                className="text-lg"
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmitInvite}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Подтвердить
                </Button>
                <Button
                  onClick={() => {
                    setSelectedOption(null);
                    setInviteCode("");
                    setError("");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Назад
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeroSection;
