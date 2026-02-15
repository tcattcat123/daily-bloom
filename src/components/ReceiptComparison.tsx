const ReceiptComparison = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-4xl md:text-5xl font-bold mb-16 uppercase tracking-tight">
          Математика твоей жизни
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Receipt Card */}
          <div className="relative">
            <div
              className="bg-white text-black p-10 font-mono transform -rotate-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              style={{ position: 'relative' }}
            >
              {/* Perforated edge */}
              <div
                className="absolute bottom-0 left-0 w-full h-5 bg-white"
                style={{
                  backgroundImage: 'radial-gradient(circle, transparent 10px, white 11px)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '-10px 0',
                  backgroundRepeat: 'repeat-x',
                  transform: 'translateY(100%)'
                }}
              />

              <div className="border-b border-dashed border-black pb-5 mb-5 text-center text-sm">
                КОФЕЙНЯ №1<br />
                ----------------<br />
                ДАТА: СЕГОДНЯ
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span>БОЛЬШОЙ ЛАТТЕ</span>
                  <span>200.00</span>
                </div>
                <div className="flex justify-between">
                  <span>КРУАССАН</span>
                  <span>200.00</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>* САХАРНЫЙ ПИК</span>
                  <span>0.00</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>* ТРЕВОЖНОСТЬ</span>
                  <span>0.00</span>
                </div>
              </div>

              <div className="border-t-2 border-black pt-4 mt-5 flex justify-between font-bold text-2xl">
                <span>ИТОГО:</span>
                <span>400.00 РУБ</span>
              </div>

              {/* Stamp */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[5px] border-red-500 text-red-500 px-5 py-2.5 text-3xl font-black opacity-40 uppercase pointer-events-none"
                style={{ transform: 'translate(-50%, -50%) rotate(-15deg)' }}
              >
                В ПУСТУЮ
              </div>
            </div>
          </div>

          {/* Focus System Card */}
          <div
            className="bg-[#0F0F0F] border border-primary rounded-3xl p-10 transform rotate-1 shadow-[0_0_30px_rgba(0,255,41,0.1)]"
          >
            <div className="flex justify-between font-mono text-xs text-primary uppercase mb-8">
              <span>ПРИЛОЖЕНИЕ FOCUS</span>
              <span className="text-white">СТАТУС: АКТИВЕН</span>
            </div>

            <div className="space-y-6">
              <div className="border-b border-[#222] pb-4">
                <div className="text-[#666] text-[10px] uppercase mb-1">ЦЕНА В ДЕНЬ</div>
                <div className="text-3xl font-black text-primary flex justify-between items-center">
                  ~3₽
                  <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded">ВЫГОДНО</span>
                </div>
              </div>

              <div className="border-b border-[#222] pb-4">
                <div className="text-[#666] text-[10px] uppercase mb-1">УРОВЕНЬ ДОФАМИНА</div>
                <div className="text-3xl font-black">ОПТИМАЛЬНЫЙ</div>
              </div>

              <div className="border-b border-[#222] pb-4">
                <div className="text-[#666] text-[10px] uppercase mb-1">ЦЕНА В МЕСЯЦ</div>
                <div className="text-3xl font-black">90₽</div>
              </div>

              <div className="pt-2">
                <div className="text-[#666] text-[10px] uppercase mb-1">РЕЗУЛЬТАТ:</div>
                <div className="text-lg font-black">КАРЬЕРА И ЗДОРОВЬЕ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReceiptComparison;
