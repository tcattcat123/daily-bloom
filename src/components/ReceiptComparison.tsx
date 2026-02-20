import { useEffect, useRef, useState } from "react";
import { TrendingUp, Zap, Brain, Trophy } from "lucide-react";

const useCountUp = (target: number, duration: number, active: boolean) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return value;
};

const ReceiptComparison = () => {
  const [visible, setVisible] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [focusFlipped, setFocusFlipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          setTimeout(() => setStamped(true), 900);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const coffeeTotal = useCountUp(400, 1200, visible);
  const focusDay = useCountUp(13, 1400, visible);

  return (
    <section ref={ref} className="py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Сравнение</span>
        </div>
        <h2 className="text-center text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
          Математика твоей <span className="text-primary glow-text">жизни</span>
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-lg mx-auto">
          Одна и та же сумма. Два совершенно разных результата.
        </p>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-center">

          {/* Receipt Card — Coffee */}
          <div
            className={`relative transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
          >
            <div className="bg-white text-black p-8 font-mono shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative"
              style={{ transform: "rotate(-2deg)" }}
            >
              {/* Perforated bottom */}
              <div className="absolute bottom-0 left-0 w-full h-4 bg-white"
                style={{
                  backgroundImage: "radial-gradient(circle, transparent 8px, white 9px)",
                  backgroundSize: "18px 18px",
                  backgroundPosition: "-9px 0",
                  backgroundRepeat: "repeat-x",
                  transform: "translateY(100%)",
                }} />

              <div className="border-b border-dashed border-gray-400 pb-4 mb-4 text-center text-xs text-gray-500">
                КОФЕЙНЯ №1<br />
                ─────────────<br />
                ДАТА: СЕГОДНЯ
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span>БОЛЬШОЙ ЛАТТЕ</span>
                  <span className="font-bold">200.00</span>
                </div>
                <div className="flex justify-between">
                  <span>КРУАССАН</span>
                  <span className="font-bold">200.00</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>* ЭНЕРГИЯ: 1.5ч</span>
                  <span>—</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>* ТРЕВОЖНОСТЬ</span>
                  <span>БОНУС</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>* ЗАВТРА снова</span>
                  <span>+400₽</span>
                </div>
              </div>

              <div className="border-t-2 border-black pt-3 flex justify-between font-bold text-xl">
                <span>ИТОГО:</span>
                <span>{coffeeTotal}.00 ₽</span>
              </div>

              <div className="text-center text-xs text-gray-400 mt-3">
                В год: ~{Math.round(coffeeTotal * 12).toLocaleString("ru")}₽ → в никуда
              </div>

              {/* Stamp */}
              <div
                className={`absolute top-1/2 left-1/2 border-[4px] border-red-500 text-red-500 px-4 py-2 text-2xl font-black uppercase pointer-events-none transition-all duration-500
                  ${stamped ? "opacity-40 scale-100 rotate-[-15deg]" : "opacity-0 scale-150 rotate-0"}`}
                style={{ transform: stamped ? "translate(-50%, -50%) rotate(-15deg)" : "translate(-50%, -50%) rotate(0deg)" }}
              >
                В ПУСТУЮ
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground/50 mt-4 font-mono">
              Временный эффект. Завтра снова.
            </p>
          </div>

          {/* VS divider */}
          <div className={`flex flex-col items-center gap-3 transition-all duration-700 delay-300 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
            <div className="w-px h-16 bg-gradient-to-b from-transparent to-border hidden md:block" />
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
              VS
            </div>
            <div className="w-px h-16 bg-gradient-to-b from-border to-transparent hidden md:block" />
          </div>

          {/* Focus Card */}
          <div
            className={`relative transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
          >
            <div
              className={`bg-[#0F0F0F] border rounded-3xl p-8 shadow-[0_0_60px_rgba(0,255,41,0.12)] cursor-pointer transition-all duration-500
                ${focusFlipped
                  ? "border-primary/60 shadow-[0_0_80px_rgba(0,255,41,0.25)]"
                  : "border-primary/30 hover:border-primary/50 hover:shadow-[0_0_80px_rgba(0,255,41,0.2)]"
                }`}
              style={{ transform: "rotate(1deg)" }}
              onMouseEnter={() => setFocusFlipped(true)}
              onMouseLeave={() => setFocusFlipped(false)}
            >
              {/* Glow orb */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />

              <div className="flex justify-between font-mono text-[10px] uppercase mb-6 relative z-10">
                <span className="text-primary font-bold tracking-widest">ПРИЛОЖЕНИЕ FOCUS</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  АКТИВЕН
                </span>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="border-b border-[#1a1a1a] pb-3">
                  <div className="text-[#555] text-[10px] uppercase tracking-widest mb-1">Цена в день</div>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-black text-primary">~{focusDay}₽</div>
                    <span className="text-[10px] bg-primary/15 text-primary px-3 py-1 rounded-full font-bold border border-primary/20">
                      ВЫГОДНО
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground/40 mt-0.5">дешевле стакана воды</div>
                </div>

                <div className="border-b border-[#1a1a1a] pb-3">
                  <div className="text-[#555] text-[10px] uppercase tracking-widest mb-1">Уровень дофамина</div>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary shrink-0" />
                    <div className="text-xl font-black text-foreground">ОПТИМАЛЬНЫЙ</div>
                  </div>
                  <div className="mt-2 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-[1500ms]"
                      style={{ width: visible ? "82%" : "0%", transitionDelay: "800ms" }}
                    />
                  </div>
                </div>

                <div className="border-b border-[#1a1a1a] pb-3">
                  <div className="text-[#555] text-[10px] uppercase tracking-widest mb-1">Результат</div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary shrink-0" />
                    <div className="text-lg font-black text-foreground">КАРЬЕРА И ЗДОРОВЬЕ</div>
                  </div>
                </div>

                <div className="pt-0">
                  <div className="text-[#555] text-[10px] uppercase tracking-widest mb-2">Эффект накапливается</div>
                  {/* Bars grow UPWARD */}
                  <div className="flex gap-1.5 items-end h-10 mb-1">
                    {[7, 14, 21, 30, 60, 90].map((d, i) => (
                      <div
                        key={d}
                        className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-sm transition-all duration-700"
                        style={{
                          height: visible ? `${10 + i * 7}px` : "0px",
                          transitionDelay: `${800 + i * 100}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    {[7, 14, 21, 30, 60, 90].map((d) => (
                      <div key={d} className="flex-1 text-center">
                        <span className="text-[8px] text-muted-foreground/40">{d}д</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover hint */}
              <div className={`absolute bottom-3 right-4 flex items-center gap-1 text-[9px] text-primary/40 transition-opacity duration-300 ${focusFlipped ? "opacity-0" : "opacity-100"}`}>
                <Zap className="w-2.5 h-2.5" />
                наведи
              </div>
            </div>

            <p className="text-center text-xs text-primary/50 mt-4 font-mono flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Растёт каждый день. Навсегда.
            </p>
          </div>
        </div>

        {/* Bottom insight bar */}
        <div className={`mt-14 p-5 rounded-2xl border border-border bg-card/30 backdrop-blur-sm transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="grid grid-cols-3 divide-x divide-border text-center">
            <div className="px-4">
              <div className="text-2xl font-black text-primary mb-1">21</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">дней до привычки</div>
            </div>
            <div className="px-4">
              <div className="text-2xl font-black text-foreground mb-1">~13₽</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">в день</div>
            </div>
            <div className="px-4">
              <div className="text-2xl font-black text-primary mb-1">∞</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">результат</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ReceiptComparison;
