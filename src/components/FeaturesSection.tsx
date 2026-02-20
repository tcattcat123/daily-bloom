import { Flame, Coffee, Cpu, TrendingUp, ArrowUpRight, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Flame,
    num: "01",
    title: "Стимул к жизни",
    desc: "Ты вернёшь вкус к действию. Биохимия мозга начнёт работать на тебя.",
    bullets: [
      "Дофаминовый фон растёт с каждым выполненным ритуалом",
      "Меньше прокрастинации — больше энергии с утра",
      "Ощущение контроля над своей жизнью возвращается",
      "Через 21 день мозг перестраивается на режим действия",
    ],
  },
  {
    icon: Coffee,
    num: "02",
    title: "Дешевле кофе",
    desc: "Цена вопроса — всего 400 рублей. Это инвестиция, которая окупается в первый день. Но есть шанс получить доступ без оплаты — за выполнение задания в Telegram.",
    bullets: [
      "Меньше, чем один кофе в кофейне",
      "Возврат вложений уже в первую неделю",
      "Нет скрытых платежей и подписок",
      "Шанс получить доступ бесплатно через задание",
    ],
  },
  {
    icon: Cpu,
    num: "03",
    title: "Биохакинг",
    desc: "Научный подход к продуктивности. Без магии и эзотерики — чистая нейробиология.",
    bullets: [
      "Основан на исследованиях по СДВГ и нейропластичности",
      "Микро-задачи активируют систему вознаграждения мозга",
      "Таймер Помодоро адаптирован под расфокус",
      "Методика подтверждена практикой тысяч пользователей",
    ],
  },
  {
    icon: TrendingUp,
    num: "04",
    title: "Масштаб",
    desc: "Изменения затронут карьеру, здоровье и отношения. Эффект снежного кома.",
    bullets: [
      "Карьера: концентрация = больше сделанного за меньшее время",
      "Здоровье: ритуалы формируют устойчивые привычки тела",
      "Отношения: меньше тревоги — больше присутствия рядом",
      "Финансы: ясная голова принимает лучшие решения",
    ],
  },
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
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Что ты получишь
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Каждая функция продумана так, чтобы запустить изменения с первого дня — без лишних усилий.
          </p>
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
              <p className="text-muted-foreground leading-relaxed text-sm mb-5">
                {f.desc}
              </p>

              <ul className="space-y-2">
                {f.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-primary/60 mt-0.5 shrink-0" />
                    <span className="text-xs text-muted-foreground leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
