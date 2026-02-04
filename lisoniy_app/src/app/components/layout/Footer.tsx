import { Separator } from "@/app/components/ui/separator";
import { Button } from "@/app/components/ui/button";
import { Send, Github } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Siz ham hissa qo'shing!
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Lisoniy - o'zbek tilining rivoji uchun hissa qo'shishni istaydigan hamma uchun ochiq. Siz ham Lisoniy hamjamiyatiga qo'shiling
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <a href="https://t.me/lisoniy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Telegram
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <a href="https://github.com/lisoniy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                Github
              </a>
            </Button>
            <Button size="lg" className="gap-2">
              Kirish
            </Button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border bg-card">
        <div className="container px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <div className="flex items-center gap-2">
              <img src="/lisoniy_small.png" alt="Lisoniy Logo" className="h-6 w-6 object-cover rounded" />
              <span className="font-semibold">Lisoniy</span>
            </div>
            <p>© 2026 Lisoniy. Barcha huquqlar himoyalangan.</p>
            <div className="flex gap-4">
              <Link to="/about" className="hover:text-foreground transition-colors">
                Biz haqimizda
              </Link>
              <Link to="/hub" className="hover:text-foreground transition-colors">
                Hamjamiyat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}