import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { 
  Database, 
  Sparkles, 
  ArrowLeft,
  Download,
  Star,
  Calendar,
  Users,
  FileText,
  GitFork,
  Eye,
  Copy,
  ExternalLink
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

// Mock data - in real app this would come from API
const datasetDetails = {
  "1": {
    id: 1,
    name: "O'zbek tili Parallel Corpus",
    description: "O'zbek-ingliz parallel matnlar to'plami. Tarjima modellari uchun",
    type: "Parallel",
    size: "50K",
    downloads: 1234,
    stars: 89,
    forks: 12,
    views: 5623,
    created: "2024-01-15",
    updated: "2 kun oldin",
    license: "MIT",
    contributors: [
      { name: "Alisher Navoiy", contributions: 2340 },
      { name: "Bobur Mirzо", contributions: 1890 },
      { name: "Ulug'bek Mirzо", contributions: 1456 },
    ],
    readme: `# O'zbek tili Parallel Corpus

## Umumiy ma'lumot

Ushbu dataset o'zbek va ingliz tillaridagi parallel matnlarni o'z ichiga oladi. Dataset tarjima modellari, ko'p tilli modellar va cross-lingual NLP vazifalarini o'qitish uchun mo'ljallangan.

## Dataset tuzilishi

Har bir misol quyidagi maydonlarni o'z ichiga oladi:

- **source_text** (string): O'zbek tilidagi matn
- **target_text** (string): Ingliz tilidagi matn  
- **domain** (string): Matn sohasi (news, legal, general)

## Namuna ma'lumot

\`\`\`json
{
  "source_text": "Bugun havo juda yaxshi",
  "target_text": "The weather is very nice today",
  "domain": "general"
}
\`\`\`

## Qanday ishlatish

### Python orqali yuklab olish

\`\`\`python
from lisoniy import load_dataset

dataset = load_dataset("o'zbek_tili_parallel_corpus")
print(dataset[0])
\`\`\`

### Transformers bilan

\`\`\`python
from datasets import load_dataset

dataset = load_dataset("lisoniy/o'zbek_tili_parallel_corpus")
\`\`\`

## Litsenziya

MIT License - bu datasetni erkin ishlatishingiz mumkin.

## Hissa qo'shish

Datasetga hissa qo'shmoqchi bo'lsangiz, GitHub repository'siga Pull Request yuboring.
`
  }
};

export function DatasetDetailPage() {
  const { datasetId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const dataset = datasetDetails[datasetId as keyof typeof datasetDetails] || datasetDetails["1"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Orqaga
              </Button>
              <div className="h-8 border-l border-border" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-bold">Lisoniy</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Yulduz</span>
              </Button>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Yuklab olish</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold">{dataset.name}</h1>
                <Badge variant="secondary" className="text-sm">{dataset.type}</Badge>
              </div>
              <p className="text-muted-foreground text-lg mb-4">{dataset.description}</p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{dataset.downloads} yuklab olish</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{dataset.stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-4 w-4" />
                  <span>{dataset.forks}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{dataset.views}</span>
                </div>
              </div>
            </div>

            {/* README Markdown Content */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <ReactMarkdown>{dataset.readme}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Ma'lumotlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hajm</span>
                  <span className="font-semibold">{dataset.size} yozuv</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Turi</span>
                  <Badge variant="secondary">{dataset.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Litsenziya</span>
                  <span className="font-semibold">{dataset.license}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Yaratilgan</span>
                  <span className="text-sm">{dataset.created}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Yangilangan</span>
                  <span className="text-sm">{dataset.updated}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contributors */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Hissa qo'shganlar</CardTitle>
                <CardDescription>{dataset.contributors.length} ta foydalanuvchi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {dataset.contributors.map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {contributor.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{contributor.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {contributor.contributions} ta
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Harakatlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Hissa qo'shish
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ExternalLink className="h-4 w-4" />
                  GitHub'da ko'rish
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}