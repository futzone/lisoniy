import { AppLayout } from "@/app/components/layout/AppLayout";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ScrollText, Rocket, Bug, Sparkles, Wrench } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChangelogEntry {
  version: string;
  date: string;
  type: "major" | "minor" | "patch";
  changes: {
    category: "feature" | "fix" | "improvement" | "breaking";
    description: string;
  }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: "0.1.5",
    date: "2026-02-13",
    type: "patch",
    changes: [
      { category: "fix", description: "🔗 **Ijtimoiy tarmoq havolalari** — GitHub, Telegram va websayt manzillari saqlanishi va ko'rsatilishi tuzatildi" },
    ],
  },
  {
    version: "0.1.3",
    date: "2026-02-12",
    type: "minor",
    changes: [
      { category: "improvement", description: "🔍 **SEO yaxshilandi** — sitemap.xml, robots.txt, JSON-LD structured data" },
      { category: "improvement", description: "📱 **Open Graph va Twitter Card** — ijtimoiy tarmoqlarda to'g'ri ko'rinish" },
      { category: "improvement", description: "🏷️ **Meta taglar** — sahifa tavsifi, kalit so'zlar, canonical URL" },
    ],
  },
  {
    version: "0.1.2",
    date: "2026-02-12",
    type: "minor",
    changes: [
      { category: "feature", description: "🤖 **SI, KTM, Agentlar kursi** — 6 ta modul, 32+ mavzu bilan to'liq yangilandi" },
      { category: "improvement", description: "📚 **Kurs tuzilishi** — Modulli struktura va professional kontent" },
    ],
  },
  {
    version: "0.1.1",
    date: "2026-02-12",
    type: "patch",
    changes: [
      { category: "fix", description: "📅 **Sana formati tuzatildi** — Barcha sahifalarda sana endi YYYY.MM.DD formatida ko'rsatiladi" },
      { category: "feature", description: "📜 **Changelog sahifasi** — O'zgarishlar tarixi sahifasi qo'shildi" },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-02-12",
    type: "minor",
    changes: [
      { category: "feature", description: "🎓 **O'quv platformasi** — NLP va lingvistika bo'yicha to'liq kurslar tizimi" },
      { category: "feature", description: "📚 **Korpus Lingvistikasi kursi** — 6 ta mavzu bilan til korpuslari haqida" },
      { category: "feature", description: "🔤 **O'zbek Morfologiyasi kursi** — 5 ta mavzu bilan agglyutinativ tillar tahlili" },
      { category: "feature", description: "🤖 **NLP Asoslari kursi** — 28 ta mavzu bilan to'liq NLP ta'limi" },
      { category: "feature", description: "⚡ **LLM Loyiha Boshqaruvi kursi** — 22 ta mavzu, prompt engineering va AI agentlar" },
      { category: "feature", description: "🔓 **Ochiq kurslar** — Barcha kurslar ro'yxatdan o'tmasdan ham ko'rish mumkin" },
      { category: "feature", description: "📊 **Dataset platformasi** — Ma'lumotlar to'plamlarini yaratish va ulashish" },
      { category: "feature", description: "🗣️ **Hamjamiyat** — Forum, maqolalar va muhokamalar" },
      { category: "feature", description: "🛠️ **Til asboblari** — Transliteratsiya, imlo tekshiruv, NER, lug'at" },
      { category: "feature", description: "📖 **Atamalar bazasi** — Lingvistik atamalar lug'ati" },
      { category: "feature", description: "🔐 **Autentifikatsiya** — Ro'yxatdan o'tish, kirish, parolni tiklash" },
      { category: "feature", description: "📱 **Responsive dizayn** — Mobil va desktop uchun moslashgan" },
      { category: "feature", description: "🌙 **Qorong'u rejim** — Ko'zni charchatmaydigan interfeys" },
    ],
  },
];

const categoryIcons = {
  feature: <Sparkles className="h-4 w-4 text-green-500" />,
  fix: <Bug className="h-4 w-4 text-red-500" />,
  improvement: <Wrench className="h-4 w-4 text-blue-500" />,
  breaking: <Rocket className="h-4 w-4 text-orange-500" />,
};

const categoryLabels = {
  feature: "Yangi",
  fix: "Tuzatish",
  improvement: "Yaxshilash",
  breaking: "Muhim",
};

const typeBadgeVariant = {
  major: "destructive" as const,
  minor: "default" as const,
  patch: "secondary" as const,
};

export function ChangelogPage() {
  return (
    <AppLayout pageTitle="O'zgarishlar tarixi">
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ScrollText className="h-8 w-8 text-primary" />
                O'zgarishlar Tarixi
              </h1>
              <p className="text-muted-foreground mt-2">
                Lisoniy platformasidagi barcha yangiliklar va o'zgarishlar
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              v{changelog[0]?.version}
            </Badge>
          </div>

          {/* Changelog entries */}
          <div className="space-y-6">
            {changelog.map((entry) => (
              <Card key={entry.version} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <Badge variant={typeBadgeVariant[entry.type]} className="text-base px-3 py-1">
                        v{entry.version}
                      </Badge>
                      <span className="text-muted-foreground text-sm font-normal">
                        {formatDate(entry.date)}
                      </span>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {entry.changes.map((change, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-0.5">{categoryIcons[change.category]}</span>
                        <div className="flex-1">
                          <Badge variant="outline" className="mr-2 text-xs">
                            {categoryLabels[change.category]}
                          </Badge>
                          <span 
                            className="text-sm"
                            dangerouslySetInnerHTML={{ 
                              __html: change.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center text-muted-foreground text-sm pt-6 border-t">
            <p>
              Yangiliklar haqida xabardor bo'lish uchun{" "}
              <a href="https://t.me/lisoniy" className="text-primary hover:underline">
                Telegram kanalimizga
              </a>{" "}
              obuna bo'ling.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
