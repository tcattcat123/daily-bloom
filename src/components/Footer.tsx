import { Shield, MessageCircle, Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-foreground">FOCUS</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Безопасно
            </a>
            <a href="https://t.me/focusmanager" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1.5">
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
