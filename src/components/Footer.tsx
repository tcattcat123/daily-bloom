import { Shield, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-border px-6 py-12 overflow-hidden">
      {/* Fuji Mountain Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ29dP434tA1llZEUrhczOx9ZQlMta9Ya2_vQ&s)',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-heading font-bold text-xl tracking-tight text-foreground">focus.</span>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Безопасно
            </a>
            <a href="https://t.me/+kbDT71ZQ6CdlOGQ1" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" /> Telegram
            </a>
          </div>

          <span className="text-xs text-muted-foreground/50">© 2026 FOCUS SYSTEM</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
