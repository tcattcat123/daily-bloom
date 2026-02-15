import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Coffee, Zap, Lock, Users, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VALID_INVITES = ["FOCUS2026", "START", "BETA", "WELCOME"];

const PricingSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"invite" | "buy" | "search" | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmitInvite = () => {
    const code = inviteCode.trim().toUpperCase();
    if (VALID_INVITES.includes(code)) {
      setIsModalOpen(false);
      navigate("/welcome");
    } else {
      setError("Неверный инвайт-код.");
    }
  };

  const handleSearchCode = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section id="pricing" className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Дешевле, чем ты думаешь
            </h2>
            <p className="text-muted-foreground text-lg">
              Бесплатное не ценится мозгом. Символический контракт с самим собой.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Regular */}
            <div className="glass-card p-8 md:p-10 group hover:border-muted-foreground/20 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Обычный путь</span>
              </div>
              <div className="font-heading text-6xl md:text-7xl font-bold text-foreground/30 mb-4">400₽</div>
              <p className="text-muted-foreground mb-8">2 чашки кофе, которые забудутся через час.</p>
              <div className="space-y-3">
                {["Временная энергия", "Зависимость", "Без результата"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground/70">
                    <X className="w-4 h-4 text-destructive/50" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Focus */}
            <div className="glass-card p-8 md:p-10 border-primary/30 relative overflow-hidden group hover:border-primary/50 hover:shadow-[0_0_60px_-10px_hsl(var(--primary)/0.2)] transition-all duration-500">
              <div className="absolute top-0 right-0 w-60 h-60 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">Focus System</span>
                  <span className="ml-auto text-[10px] uppercase tracking-widest font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Best</span>
                </div>
                <div className="font-heading text-6xl md:text-7xl font-bold text-primary mb-4 glow-text">∞</div>
                <p className="text-muted-foreground mb-8">Одна инвестиция — навсегда.</p>
                <div className="space-y-3">
                  {["Перезапуск дофамина", "Привычка за 21 день", "Результат навсегда"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-8 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Lock className="w-4 h-4" />
                  <span>Начать</span>
                </button>
              </div>
            </div>
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
                  <div className="text-sm text-muted-foreground">Спросите у участников системы</div>
                </div>
              </button>

              <button
                onClick={() => window.open("https://t.me/focusmanager", "_blank")}
                className="w-full flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
              >
                <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Купить пачку кодов за 90₽</div>
                  <div className="text-sm text-muted-foreground">9 кодов — продавайте или подключайте в команду</div>
                </div>
              </button>

              <button
                onClick={handleSearchCode}
                className="w-full flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
              >
                <Search className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Искать код на сайте</div>
                  <div className="text-sm text-muted-foreground">Принято — ищите самостоятельно</div>
                </div>
              </button>
            </div>
          ) : selectedOption === "invite" ? (
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Введите инвайт-код, полученный от участников системы
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

export default PricingSection;
