import { useEffect } from 'react';

const Start = () => {
  useEffect(() => {
    // Плавный скролл для якорных ссылок
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.slice(1);
        const element = document.getElementById(id || '');
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const showSecret = () => {
    const modal = document.getElementById('secret-modal');
    if (modal) modal.style.display = 'flex';
  };

  const closeSecret = () => {
    const modal = document.getElementById('secret-modal');
    if (modal) modal.style.display = 'none';
  };

  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:wght@400;700;900&family=Libre+Baskerville:wght@400;700&display=swap');

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .start-page {
          font-family: 'Inter', sans-serif;
        }

        .editorial-style {
          font-family: "TT Commons Pro Trial", "TT Commons Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: clamp(36px, 7vw, 48px);
          line-height: 1.0;
          letter-spacing: -0.96px;
          text-transform: uppercase;
          font-weight: 600;
          vertical-align: baseline;
          word-spacing: 0px;
          font-style: normal;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }

        /* Вариации размеров для драматичности */
        .editorial-large {
          font-size: clamp(48px, 9vw, 96px);
          line-height: 1.0;
          letter-spacing: -1.92px;
        }

        .editorial-medium {
          font-size: clamp(36px, 6vw, 64px);
          line-height: 1.05;
          letter-spacing: -1.28px;
        }

        /* Адаптивные размеры для заголовков */
        /* Видео фон */
        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom,
            rgba(0,0,0,0.75) 0%,
            rgba(0,0,0,0.85) 50%,
            rgba(0,0,0,0.95) 100%);
          z-index: 1;
          backdrop-filter: blur(1px);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          animation: fadeInUp 1.2s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Карточки отзывов */
        .testimonial-card {
          background: #121212;
          padding: 30px;
          border-radius: 0;
          border: 1px solid #333;
        }

        @media (max-width: 768px) {
          .editorial-style {
            line-height: 1.1;
          }
          .editorial-large {
            line-height: 1.15;
          }
          .editorial-medium {
            line-height: 1.12;
          }
        }

        .unbounded {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-weight: 600;
        }

        /* Логотип в стиле Facebook */
        .logo-facebook {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          font-weight: 700;
          font-size: 28px;
          letter-spacing: -0.5px;
          text-transform: lowercase;
          color: #00FF55;
        }

        @media (max-width: 768px) {
          .logo-facebook {
            font-size: 24px;
          }
        }

        .btn-focus {
          background: #00FF55;
          color: #000;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          padding: 16px 32px;
          border-radius: 0;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
          font-size: 14px;
          display: inline-block;
          text-decoration: none;
          letter-spacing: 1px;
        }

        .btn-focus:hover {
          transform: translate(-4px, -4px);
          box-shadow: 4px 4px 0px #fff;
        }

        .btn-focus:active {
          transform: translate(-2px, -2px);
          box-shadow: 2px 2px 0px #fff;
        }

        .btn-outline {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-outline:hover {
          border-color: #00FF55;
          color: #00FF55;
          transform: translate(-4px, -4px);
          box-shadow: 4px 4px 0px #00FF55;
        }

        .btn-outline:active {
          transform: translate(-2px, -2px);
          box-shadow: 2px 2px 0px #00FF55;
        }

        .marquee-container {
          width: 100%;
          overflow: hidden;
          background: #00FF55;
          padding: 15px 0;
          transform: rotate(-1.5deg) scale(1.02);
          margin: 80px 0;
          border-top: 2px solid #000;
          border-bottom: 2px solid #000;
        }

        .marquee-content {
          display: flex;
          white-space: nowrap;
          animation: scroll 25s linear infinite;
        }

        .marquee-item {
          color: #000;
          font-family: 'Unbounded', sans-serif;
          font-weight: 900;
          font-size: 1.8rem;
          margin-right: 60px;
          text-transform: uppercase;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }


        .btn-secondary {
          background: #000;
          color: #fff;
          border: 2px solid #fff;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          padding: 16px 32px;
          border-radius: 0;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
          font-size: 14px;
          display: inline-block;
          text-decoration: none;
          letter-spacing: 1px;
        }

        .btn-secondary:hover {
          transform: translate(-4px, -4px);
          box-shadow: 4px 4px 0px #fff;
        }

        .btn-secondary:active {
          transform: translate(-2px, -2px);
          box-shadow: 2px 2px 0px #fff;
        }

        .box {
          background: #121212;
          padding: 50px;
          border: 1px solid #333;
          transition: 0.3s;
          position: relative;
          overflow: hidden;
          border-radius: 0;
        }

        .box:hover {
          border-color: #00FF55;
        }

        .big-number {
          font-size: 120px;
          font-weight: 900;
          color: rgba(255,255,255,0.02);
          position: absolute;
          bottom: -20px;
          right: 0px;
          font-family: 'Unbounded', sans-serif;
          z-index: 1;
        }

        .message-bubble {
          background: #222;
          padding: 30px;
          border-radius: 0;
          margin-bottom: 30px;
          border-left: 4px solid #00FF55;
          font-size: 1.1rem;
          line-height: 1.6;
          font-weight: 400;
        }

        .theory-card {
          background: #121212;
          padding: 30px;
          border-radius: 0;
          border: 1px solid #333;
        }

        .theory-card h4 {
          color: #00FF55;
          font-family: 'Space Grotesk', sans-serif;
          margin-bottom: 15px;
          font-size: 1.2rem;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .editorial-style {
            font-size: 40px;
          }
          .marquee-item {
            font-size: 1.2rem;
          }
          .box {
            padding: 30px;
          }
          .message-bubble {
            padding: 25px;
            font-size: 1rem;
          }
        }
      `}</style>

      {/* HEADER */}
      <header className="fixed w-full px-6 md:px-10 py-6 flex justify-between items-center bg-black/90 backdrop-blur-xl z-50 border-b border-white/5">
        <div className="logo-facebook">focus</div>
        <a href="#join" className="btn-focus text-xs md:text-sm">Connect</a>
      </header>

      <div className="start-page">
        {/* HERO */}
        <section className="min-h-[95vh] flex flex-col justify-center items-start pt-20 px-6 md:px-10 relative overflow-hidden bg-black">
          {/* Видео фон */}
          {/* <video
            className="video-background"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/fcs.mp4" type="video/mp4" />
          </video> */}

          {/* Затемнение */}
          {/* <div className="video-overlay" /> */}

          {/* Контент поверх видео */}
          <div className="hero-content max-w-[1400px] mx-auto w-full">
            <h1 className="editorial-style editorial-large mb-12">
              Будь в<br />
              Фокусе
            </h1>
            <p className="text-lg md:text-2xl max-w-[700px] mb-12 opacity-90 font-medium leading-relaxed border-l-[6px] border-[#00FF55] pl-8">
              Специально для людей с расфокусом и СДВГ. <br />
              Верни себе дофамин правильно.
            </p>
            <div className="flex flex-wrap gap-5">
              <a href="#join" className="btn-focus">Готов действовать</a>
              <a href="#why" className="btn-focus btn-outline">Механика</a>
            </div>
          </div>
        </section>
      </div>

      {/* УБРАНА MARQUEE ПЛАШКА */}

      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* МИКРОПРИВЫЧКИ - ГЛАВНЫЙ ХУК */}
        <section className="my-32 text-center">
          <h2 className="editorial-style editorial-medium mb-12">
            2 минуты в день = <span className="text-[#00FF55]">360° жизни</span>
          </h2>
          <p className="text-xl md:text-2xl max-w-[900px] mx-auto mb-16 opacity-80 leading-relaxed">
            Ты думаешь, что нужны часы упорной работы? <strong>Нет.</strong><br/>
            Всё, что отделяет тебя от новой версии себя — это <span className="text-[#00FF55] font-black">2-5 минут ежедневных действий</span>.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="box text-left">
              <div className="text-[#00FF55] font-black text-5xl mb-4">2 мин</div>
              <h3 className="unbounded text-xl uppercase mb-4">Утренняя рутина</h3>
              <p className="opacity-70 text-sm">
                Холодный душ, стакан воды, 10 отжиманий. За 2 минуты ты запускаешь дофаминовую систему на весь день.
              </p>
            </div>
            <div className="box text-left">
              <div className="text-[#00FF55] font-black text-5xl mb-4">5 мин</div>
              <h3 className="unbounded text-xl uppercase mb-4">Дневной фокус</h3>
              <p className="opacity-70 text-sm">
                Одна главная задача. Один фокус. 5 минут чистой работы без отвлечений = больше, чем час прокрастинации.
              </p>
            </div>
            <div className="box text-left" style={{ borderColor: '#00FF55' }}>
              <div className="text-[#00FF55] font-black text-5xl mb-4">∞</div>
              <h3 className="unbounded text-xl uppercase mb-4 text-[#00FF55]">Результат</h3>
              <p className="text-sm font-semibold">
                Через 21 день это становится автоматом. Ты не тратишь силу воли. Ты просто <strong>делаешь</strong>.
              </p>
            </div>
          </div>

          <div className="max-w-[800px] mx-auto p-10 border-2 border-[#00FF55] relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black px-4">
              <span className="text-[#00FF55] font-black uppercase text-sm">Научный факт</span>
            </div>
            <p className="text-lg leading-relaxed">
              <strong>Исследования Стэнфорда показали:</strong> микропривычки на 300% эффективнее "больших целей".
              Твой мозг не сопротивляется 2 минутам. Но сопротивляется "часу в зале".
            </p>
          </div>
        </section>

        {/* ТРАНСФОРМАЦИЯ 360° */}
        <section className="my-32">
          <h2 className="editorial-style editorial-medium text-center mb-20">
            Твоя жизнь на <span className="text-[#00FF55]">360°</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="p-10 border border-[#666]" style={{ background: '#0A0A0A' }}>
              <div className="text-[#666] font-black uppercase mb-6 text-sm flex items-center gap-2">
                <i className="fas fa-times-circle"></i> Без системы
              </div>
              <ul className="space-y-4 text-[#888]">
                <li className="flex items-start gap-3">
                  <i className="fas fa-bed text-2xl"></i>
                  <span>Просыпаешься разбитым, тянешься к телефону</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-mobile-alt text-2xl"></i>
                  <span>Первые 2 часа — ютуб, соцсети, прокрастинация</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-frown text-2xl"></i>
                  <span>К вечеру ничего не сделано, чувство вины</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-redo text-2xl"></i>
                  <span>Завтра обещаешь себе "начать новую жизнь"</span>
                </li>
              </ul>
            </div>

            <div className="p-10 border-2 border-[#00FF55]" style={{ background: '#001100' }}>
              <div className="text-[#00FF55] font-black uppercase mb-6 text-sm flex items-center gap-2">
                <i className="fas fa-check-circle"></i> С Focus
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <i className="fas fa-bolt text-2xl text-[#00FF55]"></i>
                  <span className="font-semibold">6:00 — подъём без будильника, холодный душ</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-bullseye text-2xl text-[#00FF55]"></i>
                  <span className="font-semibold">Утренний ритуал выполнен за 10 минут</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-rocket text-2xl text-[#00FF55]"></i>
                  <span className="font-semibold">К 8:00 уже сделал больше, чем вчера за весь день</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-gem text-2xl text-[#00FF55]"></i>
                  <span className="font-semibold text-[#00FF55]">Вечер свободен. Ты доволен собой</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl md:text-3xl font-black mb-4">
              Это не мотивация. Это <span className="text-[#00FF55]">биохимия</span>.
            </p>
            <p className="text-lg opacity-60">
              Когда твой мозг начинает ассоциировать дофамин с действием, а не с прокрастинацией — всё меняется.
            </p>
          </div>
        </section>

        {/* СОЦИАЛЬНОЕ ДОКАЗАТЕЛЬСТВО */}
        <section className="my-32 p-12 md:p-20 border border-[#333] text-center">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-5xl md:text-6xl font-black text-[#00FF55] mb-2">847</div>
              <div className="text-sm opacity-60 uppercase">активных пользователей</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-black text-[#00FF55] mb-2">21</div>
              <div className="text-sm opacity-60 uppercase">день до автопилота</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-black text-[#00FF55] mb-2">94%</div>
              <div className="text-sm opacity-60 uppercase">продолжают после месяца</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-black text-[#00FF55] mb-2">∞</div>
              <div className="text-sm opacity-60 uppercase">изменений навсегда</div>
            </div>
          </div>
          <p className="text-lg opacity-80">
            Пока ты читаешь это, <strong className="text-[#00FF55]">23 человека</strong> выполняют свой утренний ритуал.
          </p>
        </section>

        {/* СРОЧНОСТЬ */}
        <section className="my-32 max-w-[700px] mx-auto text-center">
          <div className="inline-block bg-[#00FF55] text-black px-6 py-2 font-black uppercase text-sm mb-8">
            <i className="fas fa-clock mr-2"></i>Ограниченное предложение
          </div>
          <h2 className="editorial-style text-4xl md:text-5xl mb-8">
            Ты теряешь <span className="text-[#00FF55]">1440 минут</span> каждый день
          </h2>
          <p className="text-xl mb-8 opacity-80">
            Каждый день без системы — это <strong>1440 минут</strong>, которые утекают в никуда.
            Через месяц это <strong>43 200 минут</strong> потерянной жизни.
          </p>
          <div className="p-8 bg-[#111] border-l-4 border-[#00FF55]">
            <p className="text-lg font-semibold">
              Представь, что через 30 дней ты будешь вставать в 6 утра, делать зарядку, медитировать,
              работать над своими целями — и это будет <span className="text-[#00FF55]">на автопилоте</span>.
            </p>
          </div>
        </section>

        {/* MECHANICS SECTION */}
        <section id="why" className="my-32 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <h2 className="editorial-style editorial-medium mb-10">
              Как это <br />
              <span className="text-[#00FF55]">работает?</span>
            </h2>
            <p className="text-base md:text-lg opacity-70 leading-relaxed mb-8">
              Мы не учим «успешному успеху». Мы работаем с твоей биохимией.
              СДВГ и расфокус — это не лень, это дефицит дофаминового вознаграждения.
            </p>
            <div className="theory-card">
              <h4>Дофаминовая петля</h4>
              <p className="text-sm opacity-80">
                Быстрый дофамин (соцсети, сахар) истощает твои рецепторы.
                Дисциплина же создает «медленный» дофамин, который дает стабильную энергию,
                а не кратковременный всплеск.
              </p>
            </div>
          </div>
          <div>
            <div className="message-bubble border-l-white opacity-90">
              <strong>Мотивация</strong> — это искра. Она непостоянна.
              Она зависит от настроения и погоды.
            </div>
            <div className="message-bubble">
              <strong>Дисциплина</strong> — это двигатель. Когда искра гаснет,
              двигатель продолжает везти тебя к цели на автомате.
            </div>
          </div>
        </section>

        {/* СТАТИСТИКА - НОВЫЙ БЛОК */}
        <section className="my-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#00FF55]/10 to-transparent p-8 rounded-lg border border-[#00FF55]/20">
            <div className="unbounded text-5xl font-black text-[#00FF55] mb-3">89%</div>
            <p className="text-sm opacity-60">пользователей отмечают рост продуктивности уже через 7 дней</p>
          </div>
          <div className="bg-gradient-to-br from-white/5 to-transparent p-8 rounded-lg border border-white/10">
            <div className="unbounded text-5xl font-black mb-3">3x</div>
            <p className="text-sm opacity-60">улучшение фокуса по сравнению с традиционными методами</p>
          </div>
          <div className="bg-gradient-to-br from-[#00FF55]/10 to-transparent p-8 rounded-lg border border-[#00FF55]/20">
            <div className="unbounded text-5xl font-black text-[#00FF55] mb-3">14 дней</div>
            <p className="text-sm opacity-60">средний срок формирования первой устойчивой привычки</p>
          </div>
        </section>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-24">
          <div className="box md:col-span-8">
            <div className="big-number">01</div>
            <h3 className="unbounded text-2xl md:text-3xl uppercase mb-6 relative z-10">Стимул к жизни</h3>
            <p className="relative z-10 opacity-60">
              Ты вернёшь вкус к действию. Начнешь делать то, что тебя действительно зажигает.
              Дисциплина проникнет во все сферы твоей жизни.
            </p>
          </div>
          <div className="box md:col-span-4">
            <div className="big-number">02</div>
            <h3 className="unbounded text-2xl md:text-3xl uppercase mb-6 relative z-10 text-[#00FF55]">2 чашки</h3>
            <p className="relative z-10 opacity-60">
              Это всё, что отделяет тебя от новой версии себя.
            </p>
          </div>
          <div className="box md:col-span-4">
            <div className="big-number">03</div>
            <h3 className="unbounded text-2xl md:text-3xl uppercase mb-6 relative z-10">Биохакинг</h3>
            <p className="relative z-10 opacity-60">
              Станешь дисциплинированно заниматься по утрам и выстроишь свою систему продуктивности без выгорания.
            </p>
          </div>
          <div className="box md:col-span-8" style={{ background: '#00FF55', borderColor: '#00FF55' }}>
            <div className="big-number" style={{ color: 'rgba(0,0,0,0.05)' }}>04</div>
            <h3 className="unbounded text-2xl md:text-3xl uppercase mb-6 relative z-10 text-black font-black">
              Эффект масштаба
            </h3>
            <p className="relative z-10 text-black font-semibold">
              Твои новые привычки каскадом изменят карьеру, отношения и здоровье. Это неизбежно.
            </p>
          </div>
        </div>

        {/* КАК ЭТО РАБОТАЕТ - НОВЫЙ РАЗДЕЛ */}
        <section className="my-32">
          <h2 className="editorial-style editorial-medium text-center mb-20">
            Система <span className="text-[#00FF55]">Focus</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#00FF55]/10 rounded-full flex items-center justify-center border-2 border-[#00FF55]">
                <span className="unbounded text-3xl font-black text-[#00FF55]">1</span>
              </div>
              <h3 className="unbounded text-xl uppercase mb-4">Трекинг</h3>
              <p className="text-sm opacity-60 leading-relaxed">
                Отслеживай свои привычки в реальном времени. Визуализация прогресса запускает выброс дофамина.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#00FF55]/10 rounded-full flex items-center justify-center border-2 border-[#00FF55]">
                <span className="unbounded text-3xl font-black text-[#00FF55]">2</span>
              </div>
              <h3 className="unbounded text-xl uppercase mb-4">Геймификация</h3>
              <p className="text-sm opacity-60 leading-relaxed">
                Зарабатывай очки за каждую выполненную задачу. Твой мозг начнет ассоциировать дисциплину с удовольствием.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#00FF55]/10 rounded-full flex items-center justify-center border-2 border-[#00FF55]">
                <span className="unbounded text-3xl font-black text-[#00FF55]">3</span>
              </div>
              <h3 className="unbounded text-xl uppercase mb-4">Автоматизм</h3>
              <p className="text-sm opacity-60 leading-relaxed">
                Через 21 день привычки становятся автоматическими. Ты перестаешь тратить силу воли на простые вещи.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING COMPARISON */}
        <div id="pricing" className="grid md:grid-cols-2 my-32 border-2 border-[#222] rounded-xl overflow-hidden">
          <div className="p-12 md:p-20 text-center bg-black border-r-0 md:border-r-2 border-b-2 md:border-b-0 border-[#222]">
            <h3 className="text-[#444] unbounded text-xl mb-6">Обычный путь</h3>
            <div className="unbounded text-6xl md:text-8xl font-black text-[#222] line-through mb-4">400₽</div>
            <p className="opacity-40 mb-8">2 чашки кофе в кофейне.</p>
            <p className="unbounded font-black opacity-30 uppercase text-sm tracking-wider">Выпил и забыл</p>
          </div>

          <div className="p-12 md:p-20 text-center bg-[#00FF55] text-black">
            <h3 className="unbounded text-xl mb-6 font-black">PREMIUM FOCUS</h3>
            <div className="unbounded text-6xl md:text-8xl font-black mb-4">200₽</div>
            <p className="font-bold mb-8">Инвестиция в твою биохимию.</p>
            <p className="unbounded font-black uppercase text-sm tracking-wider">Твой результат</p>
          </div>
        </div>

        {/* WHY NOT FREE */}
        <section className="max-w-[900px] mx-auto my-32">
          <h2 className="editorial-style editorial-medium text-center mb-20">
            Почему не <span className="text-[#00FF55]">бесплатно?</span>
          </h2>

          <div className="message-bubble">
            Бесплатное не ценится мозгом. Чтобы нейронные связи начали перестраиваться,
            психике нужно подтверждение ценности через действие или ресурс.
            200 рублей — это символический контракт с самим собой.
          </div>

          <div
            className="message-bubble text-black rounded-tl-[40px] rounded-tr-[40px] rounded-br-[4px] rounded-bl-[40px]"
            style={{ background: '#00FF55', borderLeft: 'none' }}
          >
            <strong>Ты уже молодец</strong>, что дочитал до этой мысли.
            Твой мозг уже начал анализировать выгоды. Закрепи это делом.
          </div>
        </section>

        {/* ОТЗЫВЫ - НОВЫЙ БЛОК */}
        <section className="my-32">
          <h2 className="editorial-style editorial-medium text-center mb-20">
            Истории <span className="text-[#00FF55]">изменений</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="testimonial-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#00FF55]" style={{ borderRadius: 0 }} />
                <div>
                  <div className="font-bold">Алексей, 28</div>
                  <div className="text-xs opacity-40">IT-специалист</div>
                </div>
              </div>
              <p className="text-sm opacity-70 leading-relaxed">
                "До Focus я мог сидеть в ютубе часами, откладывая задачи.
                Через 2 недели я закончил проект, который тянул 3 месяца.
                Главное — система работает на автомате."
              </p>
            </div>
            <div className="testimonial-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#00FF55]" style={{ borderRadius: 0 }} />
                <div>
                  <div className="font-bold">Мария, 24</div>
                  <div className="text-xs opacity-40">Дизайнер</div>
                </div>
              </div>
              <p className="text-sm opacity-70 leading-relaxed">
                "У меня СДВГ. Я всегда бросала начатое. Focus дал мне структуру.
                Теперь я встаю в 6 утра, медитирую и работаю над своим проектом.
                Это не магия — это биохимия."
              </p>
            </div>
          </div>
        </section>

        {/* ПОСЛЕДНИЙ ХУК ПЕРЕД CTA */}
        <section className="my-32 max-w-[900px] mx-auto">
          <div className="border-2 border-[#00FF55] p-12 md:p-16">
            <div className="text-center mb-12">
              <div className="inline-block bg-[#00FF55] text-black px-4 py-1 font-black uppercase text-xs mb-6">
                Вопрос на миллион
              </div>
              <h3 className="unbounded text-3xl md:text-4xl uppercase mb-8">
                Что если бы ты начал<br/>30 дней назад?
              </h3>
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <i className="fas fa-check text-3xl text-white"></i>
                <p className="text-lg">
                  <strong>Сегодня</strong> ты бы уже вставал без будильника
                </p>
              </div>
              <div className="flex items-start gap-4">
                <i className="fas fa-check text-3xl text-white"></i>
                <p className="text-lg">
                  <strong>Сегодня</strong> у тебя была бы серия из 30 дней выполненных ритуалов
                </p>
              </div>
              <div className="flex items-start gap-4">
                <i className="fas fa-check text-3xl text-white"></i>
                <p className="text-lg">
                  <strong>Сегодня</strong> твои друзья спрашивали бы: "Как ты это делаешь?"
                </p>
              </div>
              <div className="flex items-start gap-4">
                <i className="fas fa-check-circle text-3xl text-[#00FF55]"></i>
                <p className="text-lg font-black text-[#00FF55]">
                  Сегодня ты был бы уже на 30 дней ближе к своей цели
                </p>
              </div>
            </div>

            <div className="p-6 bg-black border border-[#00FF55]">
              <p className="text-center text-xl">
                <strong>Но ты не начал 30 дней назад.</strong><br/>
                <span className="text-[#00FF55] font-black">Начни сегодня.</span><br/>
                <span className="text-sm opacity-60">Через месяц ты скажешь себе спасибо.</span>
              </p>
            </div>
          </div>
        </section>

        {/* ГАРАНТИЯ И РИСК */}
        <section className="my-32 grid md:grid-cols-2 gap-8">
          <div className="p-10 border border-[#333]">
            <div className="text-[#666] font-black uppercase text-sm mb-6 flex items-center gap-2">
              <i className="fas fa-exclamation-triangle"></i> Риск НЕ начать
            </div>
            <ul className="space-y-4 opacity-80">
              <li>• Через год ты будешь в той же точке</li>
              <li>• Продолжишь мечтать о "новой жизни с понедельника"</li>
              <li>• Потеряешь еще 525 600 минут впустую</li>
              <li>• Будешь смотреть, как другие достигают твоих целей</li>
            </ul>
          </div>
          <div className="p-10 border-2 border-[#00FF55]" style={{ background: '#001100' }}>
            <div className="text-[#00FF55] font-black uppercase text-sm mb-6 flex items-center gap-2">
              <i className="fas fa-check-circle"></i> Гарантия начать
            </div>
            <ul className="space-y-4 font-semibold">
              <li>• Через 21 день — автопилот навсегда</li>
              <li>• Система, которая работает даже когда ты не хочешь</li>
              <li>• Дофамин от действия, а не от прокрастинации</li>
              <li className="text-[#00FF55]">• <strong>Всего 200₽</strong> вместо двух чашек кофе</li>
            </ul>
          </div>
        </section>

        {/* CTA SECTION */}
        <section id="join" className="text-center py-32 border-2 border-[#00FF55] my-32">
          <div className="inline-block bg-[#00FF55] text-black px-6 py-2 font-black uppercase text-sm mb-8 animate-pulse">
            <i className="fas fa-fire mr-2"></i>Последний шанс
          </div>
          <h2 className="editorial-style editorial-large mb-14">Готов?</h2>
          <p className="mb-12 text-[#888] text-lg md:text-xl max-w-[600px] mx-auto px-4">
            Просто напиши менеджеру код <strong className="text-white">"50%"</strong> и
            выложи одну историю о том, что ты начал.
          </p>

          <a
            href="https://t.me/humanos_manager"
            className="btn-focus text-base md:text-2xl py-6 md:py-8 px-10 md:px-16"
          >
            НАПИСАТЬ МЕНЕДЖЕРУ
          </a>

          <div className="mt-16 text-xs opacity-40">
            <p>Начни сегодня. Измени всё завтра.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-20 border-t border-[#111] text-center text-[#333]">
          <div className="unbounded text-2xl mb-8 opacity-30 tracking-[4px]">FOCUS</div>
          <p className="unbounded font-black uppercase tracking-[4px] text-xs mb-5">
            Для самых внимательных есть пасхалка
          </p>
          <div>
            <span
              className="cursor-pointer text-[#111] hover:text-[#00FF55] transition-colors text-4xl"
              onClick={showSecret}
            >
              .
            </span>
          </div>
        </footer>
      </div>

      {/* SECRET MODAL */}
      <div
        id="secret-modal"
        className="fixed inset-0 bg-[#00FF55] text-black z-[1000] hidden flex-col items-center justify-center text-center p-10"
      >
        <h2 className="editorial-style editorial-large mb-10">CRACKED</h2>
        <p className="unbounded font-black text-xl md:text-2xl mb-8">
          ТЫ НАШЕЛ ПАСХАЛКУ.
        </p>
        <p className="max-w-[500px] mb-10 font-semibold text-base md:text-lg">
          Твое внимание — твое оружие. Мы даем тебе инвайт в систему бесплатно.
        </p>
        <div className="bg-black text-[#00FF55] p-6 md:p-8 font-mono text-base md:text-xl mb-10 rounded">
          CODE: FREE_FOCUS_INVITE
        </div>
        <button
          onClick={closeSecret}
          className="btn-secondary"
        >
          Вернуться
        </button>
      </div>
    </div>
  );
};

export default Start;
