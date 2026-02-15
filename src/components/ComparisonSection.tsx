import { XCircle, CheckCircle, Moon, Smartphone, Frown, Sun, Zap, Smile } from "lucide-react";

const ComparisonSection = () => {
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

          {/* With Focus */}
          <div className="glass-card p-8 md:p-10 border-primary/20 relative overflow-hidden group hover:border-primary/30 hover:shadow-[0_0_50px_-15px_hsl(var(--primary)/0.2)] transition-all duration-500">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <span className="text-xs uppercase tracking-widest font-semibold text-primary/70 mb-4 block">
                С Focus
              </span>
              <div className="space-y-4 mt-6">
                {[
                  { icon: Sun, text: "6:00 — лёгкий подъём" },
                  { icon: Zap, text: "Ритуал выполнен за 10 мин" },
                  { icon: Smile, text: "Вечер свободен и ты доволен" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary/8 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-primary/60 shrink-0" />
                    <item.icon className="w-4 h-4 text-primary/50 shrink-0" />
                    <span className="text-foreground text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
