import { MessageSquare, Users, Clock, Trophy } from "lucide-react";

const SocialProof = () => {
  const stats = [
    { icon: Users, value: "75", label: "Участников" },
    { icon: Trophy, value: "94%", label: "Продолжают" },
    { icon: Clock, value: "21", label: "День привычки" },
    { icon: MessageSquare, value: "4.9★", label: "Рейтинг" },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="glass-card p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
