import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, ArrowRight, Sparkles, Lock, Users, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VALID_INVITES = ["FOCUS2026", "START", "BETA", "WELCOME"];

const CTASection = () => {
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
      <section className="py-24 md:py-40 px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[180px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8 animate-float">
            <Brain className="w-9 h-9 text-primary" />
          </div>

          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
            Готов <span className="text-primary glow-text">начать?</span>
          </h2>

          <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto mb-4 leading-relaxed">
            Введи инвайт-код и начни свой путь к дисциплине.
          </p>
          <p className="text-muted-foreground/60 text-sm mb-10">
            Ты уже молодец, что дочитал. Закрепи это делом.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground font-bold px-10 py-5 rounded-2xl text-lg hover:shadow-[0_0_60px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300 hover:-translate-y-1 pulse-ring"
            >
              <Lock className="w-5 h-5" />
              <span>Начать</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="mt-20 flex items-center justify-center gap-2 text-muted-foreground/30">
            <Sparkles className="w-4 h-4" />
            <span className="font-heading text-sm uppercase tracking-[0.3em]">Focus System 2026</span>
            <Sparkles className="w-4 h-4" />
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

export default CTASection;
