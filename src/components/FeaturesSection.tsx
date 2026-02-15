import { Flame, Coffee, Cpu, TrendingUp, ArrowUpRight } from "lucide-react";

const features = [
  { icon: Flame, num: "01", title: "Стимул к жизни", desc: "Ты вернёшь вкус к действию. Биохимия мозга начнёт работать на тебя." },
  { icon: Coffee, num: "02", title: "Дешевле кофе", desc: "Цена вопроса — всего 200 рублей. Это инвестиция, которая окупается в первый день." },
  { icon: Cpu, num: "03", title: "Биохакинг", desc: "Научный подход к продуктивности. Без магии и эзотерики — чистая нейробиология." },
  { icon: TrendingUp, num: "04", title: "Масштаб", desc: "Изменения затронут карьеру, здоровье и отношения. Эффект снежного кома." },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge-label mx-auto mb-6 w-fit">
            <Cpu className="w-3.5 h-3.5" />
            <span>Возможности</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Что ты получишь
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="group glass-card-hover p-8 md:p-10 relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 group-hover:bg-primary/20 transition-all duration-500">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="font-heading text-5xl font-bold text-border group-hover:text-primary/20 transition-colors duration-500">
                  {f.num}
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl text-foreground mb-3 flex items-center gap-2">
                {f.title}
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
