import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Search, Filter, Eye, Download } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface CorpusEntry {
  id: string;
  text: string;
  source: string;
  genre: string;
  date: string;
  metadata: Record<string, any>;
}

const mockData: CorpusEntry[] = [
  {
    id: "UZ001",
    text: "O'zbekiston Respublikasi mustaqil, demokratik davlatdir.",
    source: "Konstitutsiya",
    genre: "Huquqiy",
    date: "1992-12-08",
    metadata: { dialect: "Standard", region: "Toshkent", author: "O'zbekiston Oliy Majlisi" }
  },
  {
    id: "UZ002",
    text: "Alisher Navoiy o'zbek adabiyotining buyuk namoyandasi hisoblanadi.",
    source: "Adabiyot kitoblari",
    genre: "Ta'lim",
    date: "2020-03-15",
    metadata: { dialect: "Standard", region: "Farg'ona", topic: "Adabiyot" }
  },
  {
    id: "UZ003",
    text: "Sun'iy intellekt texnologiyalari hayotimizning bir qismi bo'lib bormoqda.",
    source: "Texnologiya Yangiliklari",
    genre: "Texnologiya",
    date: "2024-01-20",
    metadata: { dialect: "Standard", region: "Toshkent", category: "AI/ML" }
  },
  {
    id: "UZ004",
    text: "Bahorda tabiat jonlanadi, ko'klamzor bo'lib ketadi.",
    source: "She'riyat to'plami",
    genre: "Badiiy",
    date: "2019-04-10",
    metadata: { dialect: "Standard", region: "Samarqand", style: "Poetry" }
  },
  {
    id: "UZ005",
    text: "Informatika fani zamonaviy ta'limning asosiy yo'nalishlaridan biridir.",
    source: "Ta'lim dasturlari",
    genre: "Ta'lim",
    date: "2021-09-01",
    metadata: { dialect: "Standard", region: "Buxoro", subject: "Informatika" }
  },
  {
    id: "UZ006",
    text: "O'zbekiston iqtisodiyoti barqaror rivojlanib bormoqda.",
    source: "Iqtisodiy Tahlillar",
    genre: "Iqtisod",
    date: "2023-06-12",
    metadata: { dialect: "Standard", region: "Toshkent", sector: "Economics" }
  },
  {
    id: "UZ007",
    text: "Sport hayotimizning muhim qismi, sog'lom turmush tarzining kaliti.",
    source: "Sog'lom turmush",
    genre: "Salomatlik",
    date: "2022-11-05",
    metadata: { dialect: "Standard", region: "Andijon", category: "Health & Sports" }
  },
  {
    id: "UZ008",
    text: "O'zbek tillida ko'plab she'rlar va qo'shiqlar yaratilgan.",
    source: "Madaniyat arxivi",
    genre: "Madaniyat",
    date: "2018-07-22",
    metadata: { dialect: "Standard", region: "Xorazm", type: "Cultural Heritage" }
  }
];

export function CorpusPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedEntry, setSelectedEntry] = useState<CorpusEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const genres = ["all", "Huquqiy", "Ta'lim", "Texnologiya", "Badiiy", "Iqtisod", "Salomatlik", "Madaniyat"];
  const years = ["all", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];

  const filteredData = mockData.filter((entry) => {
    const matchesSearch = entry.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "all" || entry.genre === selectedGenre;
    const matchesYear = selectedYear === "all" || entry.date.startsWith(selectedYear);
    return matchesSearch && matchesGenre && matchesYear;
  });

  const handleViewDetails = (entry: CorpusEntry) => {
    setSelectedEntry(entry);
    setDialogOpen(true);
  };

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-3 text-4xl font-bold text-foreground">
          Lisoniy Corpus — Ma'lumotlar Eksploreri
        </h1>
        <p className="text-lg text-muted-foreground">
          1M+ jumla, turli janr va manbalardan
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-12">
        {/* Search */}
        <div className="relative md:col-span-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Matn yoki manba bo'yicha qidirish..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Genre Filter */}
        <div className="md:col-span-3">
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Janr" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre === "all" ? "Barcha Janrlar" : genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Filter */}
        <div className="md:col-span-3">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Yil" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year === "all" ? "Barcha Yillar" : year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
        <span>Natijalar: <strong className="text-foreground">{filteredData.length}</strong></span>
        <span>•</span>
        <span>Jami: <strong className="text-foreground">{mockData.length}</strong></span>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Matn
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Manba
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Janr
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Sana
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.map((entry) => (
                  <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                      {entry.id}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="max-w-md truncate">{entry.text}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {entry.source}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{entry.genre}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {entry.date}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(entry)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* JSONB Viewer Dialog */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-lg border border-border bg-card p-6 shadow-lg">
            <Dialog.Title className="mb-4 text-2xl font-bold text-foreground">
              Batafsil Ma'lumot
            </Dialog.Title>
            <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
              <X className="h-4 w-4" />
            </Dialog.Close>

            {selectedEntry && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">ID</label>
                  <p className="font-mono text-foreground">{selectedEntry.id}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Matn</label>
                  <p className="text-foreground">{selectedEntry.text}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Manba</label>
                    <p className="text-foreground">{selectedEntry.source}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Janr</label>
                    <p><Badge variant="secondary">{selectedEntry.genre}</Badge></p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Sana</label>
                  <p className="text-foreground">{selectedEntry.date}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Metadata (JSONB)</label>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                    {JSON.stringify(selectedEntry.metadata, null, 2)}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Yuklab Olish
                  </Button>
                  <Dialog.Close asChild>
                    <Button>Yopish</Button>
                  </Dialog.Close>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}