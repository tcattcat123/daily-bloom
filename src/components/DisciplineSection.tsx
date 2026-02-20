import { useEffect, useRef, useState } from "react";
import { Brain, Zap, TrendingUp } from "lucide-react";

const DisciplineSection = () => {
  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const motivRef = useRef<SVGPathElement>(null);
  const discRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!animated) return;
    const animate = (el: SVGPathElement | null, delay: number) => {
      if (!el) return;
      const len = el.getTotalLength();
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
      el.style.transition = "none";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = `stroke-dashoffset 2.2s cubic-bezier(0.4,0,0.2,1) ${delay}ms`;
          el.style.strokeDashoffset = "0";
        });
      });
    };
    animate(motivRef.current, 0);
    animate(discRef.current, 400);
  }, [animated]);

  // SVG chart geometry
  const W = 560;
  const H = 190;
  const pL = 44, pR = 16, pT = 16, pB = 28;
  const cW = W - pL - pR;
  const cH = H - pT - pB;
  const weeks = 16;

  const pts = (fn: (t: number) => number) =>
    Array.from({ length: weeks * 4 + 1 }, (_, i) => {
      const t = i / (weeks * 4);
      const x = pL + t * cW;
      const y = pT + cH * (1 - fn(t));
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" L ");

  // Motivation: starts high, decays with oscillation
  const motivFn = (t: number) => {
    const decay = Math.exp(-t * 3.5);
    const osc = Math.pow(Math.max(Math.sin(t * Math.PI * 5.5), 0), 1.5);
    return Math.max(0.04, 0.88 * decay * osc + 0.05 * decay);
  };

  // Discipline: sigmoid growth, starts very low
  const discFn = (t: number) =>
    0.05 + 0.80 * (1 - Math.exp(-t * 4.5));

  const motivPath = `M ${pts(motivFn)}`;
  const discPath = `M ${pts(discFn)}`;

  const yLabels = [
    { pct: "100%", y: pT },
    { pct: "75%", y: pT + cH * 0.25 },
    { pct: "50%", y: pT + cH * 0.5 },
    { pct: "25%", y: pT + cH * 0.75 },
    { pct: "0%",  y: pT + cH },
  ];

  const xLabels = [1, 4, 8, 12, 16];

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge-label mx-auto mb-6 w-fit">
            <Brain className="w-3.5 h-3.5" />
            <span>Дисциплина</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-5">
            Делим всё на{" "}
            <span className="text-primary glow-text">короткие задачи</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Каждое 2-минутное действие — кирпич в фундаменте твоей дисциплины.
            Мотивация приходит волнами и уходит. Дисциплина, выращенная из микро-задач, остаётся навсегда.
          </p>
        </div>

        {/* Chart */}
        <div className="glass-card p-4 md:p-10 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/3 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex items-center gap-6 mb-5">
            <div className="flex items-center gap-2">
              <svg width="28" height="10"><path d="M0 5 Q7 1 14 5 Q21 9 28 5" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/></svg>
              <span className="text-sm font-medium text-muted-foreground">Мотивация</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="28" height="10"><path d="M0 8 Q14 3 28 2" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round"/></svg>
              <span className="text-sm font-medium text-muted-foreground">Дисциплина</span>
            </div>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            {/* Horizontal grid */}
            {yLabels.map(({ y }, i) => (
              <line key={i} x1={pL} y1={y} x2={W - pR} y2={y}
                stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/10" />
            ))}

            {/* Y labels */}
            {yLabels.map(({ pct, y }) => (
              <text key={pct} x={pL - 5} y={y + 3} textAnchor="end"
                style={{ fontSize: 8, fill: "hsl(var(--muted-foreground))", opacity: 0.5 }}>
                {pct}
              </text>
            ))}

            {/* X labels */}
            {xLabels.map(w => (
              <text key={w}
                x={pL + (w / weeks) * cW}
                y={H - 6}
                textAnchor="middle"
                style={{ fontSize: 8, fill: "hsl(var(--muted-foreground))", opacity: 0.45 }}>
                {w}нед
              </text>
            ))}

            {/* Shaded area under discipline */}
            <defs>
              <linearGradient id="discGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${discPath} L ${pL + cW},${pT + cH} L ${pL},${pT + cH} Z`}
              fill="url(#discGrad)"
              opacity={animated ? 1 : 0}
              style={{ transition: "opacity 1s ease 1s" }}
            />

            {/* Motivation path */}
            <path
              ref={motivRef}
              d={motivPath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Discipline path */}
            <path
              ref={discRef}
              d={discPath}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Annotation labels */}
            {animated && (
              <>
                <text x={pL + cW * 0.12} y={pT + 10}
                  style={{ fontSize: 8.5, fill: "#f59e0b", fontWeight: 600, opacity: 0.85 }}>
                  Мотивация угасает
                </text>
                <text x={pL + cW * 0.72} y={pT + cH * 0.42}
                  style={{ fontSize: 8.5, fill: "hsl(var(--primary))", fontWeight: 600, opacity: 0.85 }}>
                  Дисциплина растёт
                </text>
              </>
            )}
          </svg>

          <p className="text-xs text-muted-foreground/50 text-center mt-2">
            Первые 2–4 недели — самые важные. Именно здесь дисциплина обгоняет мотивацию навсегда.
          </p>
        </div>

        {/* Math of life */}
        <div className="text-center mb-8 mt-16">
          <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Математика жизни
          </h3>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Не важно, как ты получил доступ. Важно — что ты делаешь с ним.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Got invite — launched dopamine */}
          <div className="glass-card p-7 border-primary/30 relative overflow-hidden group hover:border-primary/50 hover:shadow-[0_0_60px_-10px_hsl(var(--primary)/0.2)] transition-all duration-500">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs uppercase tracking-widest font-semibold text-primary/70">
                  Добыл инвайт — запустил фон
                </span>
              </div>
              <p className="text-2xl font-black text-primary mb-6 font-heading glow-text">= ∞</p>

              <div className="space-y-3">
                {[
                  { label: "Неделя 1 — первый шаг", pct: 30 },
                  { label: "Неделя 2 — привыкаю", pct: 55 },
                  { label: "Неделя 4 — работает", pct: 78 },
                  { label: "Неделя 8 — автомат", pct: 96 },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground/60 w-36 shrink-0 leading-tight">{row.label}</span>
                    <div className="flex-1 h-1.5 bg-muted/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700"
                        style={{
                          width: animated ? `${row.pct}%` : "0%",
                          transitionDelay: `${i * 180}ms`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-primary w-7 text-right">{row.pct}%</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-primary/10">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-sm text-foreground">
                    Дофаминовый фон запущен. Дисциплина встроена. Это навсегда.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Got free — but quit */}
          <div className="glass-card p-7 border-destructive/20 relative overflow-hidden group hover:border-destructive/30 transition-all duration-500">
            <div className="absolute top-0 right-0 w-40 h-40 bg-destructive/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <span className="text-base">😶</span>
                </div>
                <span className="text-xs uppercase tracking-widest font-semibold text-destructive/70">
                  Получил бесплатно — бросил
                </span>
              </div>
              <p className="text-2xl font-black text-foreground/20 mb-6 font-heading">= 0</p>

              <div className="space-y-3">
                {[
                  { label: "Неделя 1 — попробовал", pct: 70 },
                  { label: "Неделя 2 — скучно", pct: 38 },
                  { label: "Неделя 4 — забыл", pct: 10 },
                  { label: "Неделя 8 — ничего", pct: 2 },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground/60 w-36 shrink-0 leading-tight">{row.label}</span>
                    <div className="flex-1 h-1.5 bg-muted/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-destructive/70 to-destructive/30 rounded-full transition-all duration-700"
                        style={{
                          width: animated ? `${row.pct}%` : "0%",
                          transitionDelay: `${i * 180}ms`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-destructive/50 w-7 text-right">{row.pct}%</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-destructive/10">
                <p className="text-sm text-muted-foreground">
                  Бесплатно — не значит ценно. Без намерения всё равно ноль.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom insight */}
        <div className="text-center mt-10">
          <p className="text-muted-foreground/60 text-sm max-w-md mx-auto">
            Цена доступа — не деньги. Цена — это 2 минуты каждый день.
          </p>
        </div>

      </div>
    </section>
  );
};

export default DisciplineSection;
