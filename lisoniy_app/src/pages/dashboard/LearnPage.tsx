import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { BookOpen } from "lucide-react";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { SEO } from "@/app/components/SEO";

export function LearnPage() {
  const baseUrl = window.location.origin;

  const coursesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Lisoniy Bepul Kurslar",
    "description": "O'zbek tili uchun NLP va AI kurslari",
    "numberOfItems": 8,
    "itemListElement": [
      {
        "@type": "Course",
        "position": 1,
        "name": "NLP Asoslari",
        "description": "Tabiiy tilni qayta ishlash asoslari — 28 ta mavzu",
        "provider": { "@type": "Organization", "name": "Lisoniy" },
        "isAccessibleForFree": true,
        "inLanguage": "uz",
        "url": `${baseUrl}/dashboard/learn/nlp-basics`
      },
      {
        "@type": "Course",
        "position": 2,
        "name": "SI, KTM, Agentlar",
        "description": "Sun'iy intellekt, katta til modellari va agentlar — 32+ mavzu",
        "provider": { "@type": "Organization", "name": "Lisoniy" },
        "isAccessibleForFree": true,
        "inLanguage": "uz",
        "url": `${baseUrl}/dashboard/learn/llm-project-management`
      },
      {
        "@type": "Course",
        "position": 3,
        "name": "Barcha Sohalar Uchun SI",
        "description": "Istalgan kasb uchun sun'iy intellektdan foydalanish — 24 ta mavzu",
        "provider": { "@type": "Organization", "name": "Lisoniy" },
        "isAccessibleForFree": true,
        "inLanguage": "uz",
        "url": `${baseUrl}/dashboard/learn/ai-for-all`
      },
      {
        "@type": "Course",
        "position": 4,
        "name": "O'zbek Morfologiyasi",
        "description": "O'zbek tili morfologik tahlili — 5 ta mavzu",
        "provider": { "@type": "Organization", "name": "Lisoniy" },
        "isAccessibleForFree": true,
        "inLanguage": "uz",
        "url": `${baseUrl}/dashboard/learn/uzbek-morphology`
      },
      {
        "@type": "Course",
        "position": 5,
        "name": "Korpus Lingvistikasi",
        "description": "Til korpuslari va annotatsiya — 6 ta mavzu",
        "provider": { "@type": "Organization", "name": "Lisoniy" },
        "isAccessibleForFree": true,
        "inLanguage": "uz",
        "url": `${baseUrl}/dashboard/learn/korpus-lingvistikasi`
      }
    ]
  };

  return (
    <AppLayout pageTitle="O'rganing">
      <SEO
        title="Bepul NLP va AI Kurslari — Lisoniy"
        description="O'zbek tili uchun bepul NLP kurslari: Prompt Engineering, RAG, AI Agentlar, O'zbek morfologiyasi, Korpus lingvistikasi. Ro'yxatdan o'tmasdan o'rganing!"
        keywords={["NLP kurslari", "AI kurs", "Prompt Engineering", "RAG", "O'zbek tili", "bepul kurslar", "sun'iy intellekt", "AI agentlar"]}
        url={`${baseUrl}/dashboard/learn`}
        structuredData={coursesSchema}
      />
      <div className="p-3 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                O'rganing
              </h1>
              <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
                O'zbek NLP va lingvistika bo'yicha to'liq ta'lim materiallari
              </p>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <Link to="/dashboard/learn/korpus-lingvistikasi">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="p-3 sm:p-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-lg sm:text-2xl mb-2 sm:mb-3">
                    📚
                  </div>
                  <CardTitle className="text-sm sm:text-base">Korpus Lingvistikasi</CardTitle>
                  <CardDescription className="text-xs sm:text-sm line-clamp-2">Til korpuslari, annotatsiya va parallel matnlar</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">6 ta mavzu</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/learn/uzbek-morphology">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="p-3 sm:p-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg sm:text-2xl mb-2 sm:mb-3">
                    🔤
                  </div>
                  <CardTitle className="text-sm sm:text-base">O'zbek Morfologiyasi</CardTitle>
                  <CardDescription className="text-xs sm:text-sm line-clamp-2">Agglyutinativ tillar va morfologik tahlil</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">5 ta mavzu</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/learn/nlp-basics">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="p-3 sm:p-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-lg sm:text-2xl mb-2 sm:mb-3">
                    🤖
                  </div>
                  <CardTitle className="text-sm sm:text-base">NLP Asoslari</CardTitle>
                  <CardDescription className="text-xs sm:text-sm line-clamp-2">Preprocessing, tokenizatsiya va matn tahlili</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">28 ta mavzu</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/learn/large-language-models">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="p-3 sm:p-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-lg sm:text-2xl mb-2 sm:mb-3">
                    🧠
                  </div>
                  <CardTitle className="text-sm sm:text-base">Katta Til Modellari</CardTitle>
                  <CardDescription className="text-xs sm:text-sm line-clamp-2">BERT, GPT va transformer arxitekturasi</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Tez orada...</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/learn/speech-technologies">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="p-3 sm:p-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-lg sm:text-2xl mb-2 sm:mb-3">
                    🎙️
                  </div>
                  <CardTitle className="text-sm sm:text-base">Nutq Texnologiyalari</CardTitle>
                  <CardDescription className="text-xs sm:text-sm line-clamp-2">ASR, TTS va ovozli ma'lumotlar</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Tez orada...</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/learn/specialized-areas">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="p-3 sm:p-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-lg sm:text-2xl mb-2 sm:mb-3">
                    🎯
                  </div>
                  <CardTitle className="text-sm sm:text-base">Ixtisoslashgan</CardTitle>
                  <CardDescription className="text-xs sm:text-sm line-clamp-2">Dialektlar, inklyuziv texnologiyalar</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Tez orada...</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/learn/llm-project-management">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="p-3 sm:p-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-lg sm:text-2xl mb-2 sm:mb-3">
                    🤖
                  </div>
                  <CardTitle className="text-sm sm:text-base">SI, KTM, Agentlar</CardTitle>
                  <CardDescription className="text-xs sm:text-sm line-clamp-2">Prompt engineering, RAG, AI agentlar</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">32+ mavzu</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/learn/ai-for-all">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="p-3 sm:p-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-lg sm:text-2xl mb-2 sm:mb-3">
                    🌟
                  </div>
                  <CardTitle className="text-sm sm:text-base">Barcha Uchun SI</CardTitle>
                  <CardDescription className="text-xs sm:text-sm line-clamp-2">Istalgan kasb uchun sun'iy intellekt</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">24 ta mavzu</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}