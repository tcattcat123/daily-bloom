import { Droplets, Target, Infinity, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Droplets,
    label: "2 мин",
    title: "Утренняя рутина",
    desc: "Холодный душ, стакан воды. За 2 минуты ты запускаешь дофаминовую систему.",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Target,
    label: "5 мин",
    title: "Дневной фокус",
    desc: "Одна главная задача. 5 минут чистой работы без отвлечений.",
    color: "from-primary/20 to-emerald-500/20",
  },
  {
    icon: Infinity,
    label: "∞",
    title: "Результат",
    desc: "Через 21 день это становится автоматом. Ты не тратишь силу воли.",
    color: "from-amber-500/20 to-orange-500/20",
  },
];

const MechanicsSection = () => {
  return (
    <section id="mechanics" className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge-label mx-auto mb-6 w-fit">
            <Target className="w-3.5 h-3.5" />
            <span>Механика</span>
          </div>
          <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-5">
            2 минуты → <span className="text-primary">новая жизнь</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Всё, что отделяет тебя от новой версии себя — это 2-5 минут ежедневных действий.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group glass-card-hover p-8 md:p-10 relative overflow-hidden"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>

                <span className="font-heading text-3xl font-bold text-primary/70 group-hover:text-primary transition-colors">
                  {step.label}
                </span>

                <h3 className="font-heading font-bold text-xl text-foreground mt-3 mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {step.desc}
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs text-primary/50 group-hover:text-primary transition-colors">
                  <span className="uppercase tracking-widest font-medium">Подробнее</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MechanicsSection;
