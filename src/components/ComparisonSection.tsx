import { useState } from "react";
import { XCircle, CheckCircle, Moon, Smartphone, Frown, Sun, Zap, Smile } from "lucide-react";

const withItems = [
  { icon: Sun, text: "Соблюдаешь ритуал" },
  { icon: Zap, text: "Обучаешься новому" },
  { icon: Smile, text: "Твой тайм-менеджмент на высоте" },
];

const ComparisonSection = () => {
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-center text-foreground mb-16">
          До и <span className="text-primary">после</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Without */}
          <div className="glass-card p-8 md:p-10 border-destructive/20 relative overflow-hidden group hover:border-destructive/30 transition-all duration-500">
            <div className="absolute top-0 right-0 w-40 h-40 bg-destructive/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <span className="text-xs uppercase tracking-widest font-semibold text-destructive/70 mb-4 block">
                Без системы
              </span>
              <div className="space-y-4 mt-6">
                {[
                  { icon: Moon, text: "Просыпаешься разбитым" },
                  { icon: Smartphone, text: "Первые 2 часа — соцсети" },
                  { icon: Frown, text: "Чувство вины к вечеру" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/10 group-hover:bg-destructive/8 transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-destructive/60 shrink-0" />
                    <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* With Focus — clickable checkboxes */}
          <div className="glass-card p-8 md:p-10 border-primary/20 relative overflow-hidden hover:border-primary/30 hover:shadow-[0_0_50px_-15px_hsl(var(--primary)/0.2)] transition-all duration-500">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <span className="text-xs uppercase tracking-widest font-semibold text-primary/70 mb-4 block">
                С Focus
              </span>
              <div className="space-y-4 mt-6">
                {withItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => toggle(i)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer select-none
                      ${checked[i]
                        ? "bg-primary/15 border-primary/40 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)]"
                        : "bg-primary/5 border-primary/10 hover:bg-primary/10 hover:border-primary/25"
                      }`}
                  >
                    <div className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${checked[i] ? "border-primary bg-primary" : "border-primary/30"}`}>
                      {checked[i] && (
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                        </svg>
                      )}
                    </div>
                    <item.icon className={`w-4 h-4 shrink-0 transition-colors duration-300 ${checked[i] ? "text-primary" : "text-primary/50"}`} />
                    <span className={`text-sm font-medium transition-colors duration-300 ${checked[i] ? "text-primary" : "text-foreground"}`}>
                      {item.text}
                    </span>
                    {checked[i] && (
                      <CheckCircle className="w-4 h-4 text-primary ml-auto shrink-0 animate-in fade-in zoom-in duration-200" />
                    )}
                  </button>
                ))}
              </div>
              {checked.every(Boolean) && (
                <p className="text-xs text-primary/70 text-center mt-5 animate-in fade-in duration-500">
                  Именно так выглядит твой день с Focus ✓
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
