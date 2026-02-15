const tape1 = "НОВЫЙ ТЫ • ДИСЦИПЛИНА • FOCUS • ДОФАМИН • ЭНЕРГИЯ • ";
const tape2 = "СИСТЕМА • БИОХИМИЯ • РЕЗУЛЬТАТ • ПРИВЫЧКА • ФОКУС • ";

const MarqueeTapes = () => {
  return (
    <div className="relative py-16 overflow-hidden">
      <div className="gradient-line mb-10" />

      {/* Tape 1 */}
      <div className="mb-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="font-heading font-bold text-2xl md:text-4xl uppercase mr-4 text-foreground/10"
            >
              {tape1}
            </span>
          ))}
        </div>
      </div>

      {/* Tape 2 */}
      <div className="overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee-reverse">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="font-heading font-bold text-2xl md:text-4xl uppercase mr-4 text-primary/15"
            >
              {tape2}
            </span>
          ))}
        </div>
      </div>

      <div className="gradient-line mt-10" />
    </div>
  );
};

export default MarqueeTapes;
