import { useState, useEffect } from "react";
import { LoginModal } from "@/components/LoginModal";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-lg shadow-background/50"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <span className="font-heading font-bold text-xl tracking-tight text-foreground">
          focus.
        </span>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#mechanics" className="hover:text-foreground transition-colors">Механика</a>
            <a href="#features" className="hover:text-foreground transition-colors">Возможности</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Цена</a>
          </nav>

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="group flex items-center gap-2 text-sm font-medium bg-primary/10 text-primary px-5 py-2.5 rounded-full border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <span>Войти</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
};

export default Header;
