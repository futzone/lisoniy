import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { BookOpen } from "lucide-react";
import { AppLayout } from "@/app/components/layout/AppLayout";

export function LearnPage() {

  return (
    <AppLayout pageTitle="O'rganing">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                O'rganing
              </h1>
              <p className="text-muted-foreground mt-2">
                O'zbek NLP va lingvistika bo'yicha to'liq ta'lim materiallari
              </p>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/dashboard/learn/korpus-lingvistikasi">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl mb-3">
                    📚
                  </div>
                  <CardTitle>Korpus Lingvistikasi</CardTitle>
                  <CardDescription>Til korpuslari, annotatsiya va parallel matnlar</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">6 ta mavzu</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/learn/uzbek-morphology">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl mb-3">
                    🔤
                  </div>
                  <CardTitle>O'zbek Tili Morfologiyasi</CardTitle>
                  <CardDescription>Agglyutinativ tillar va morfologik tahlil</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">5 ta mavzu</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/learn/nlp-basics">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-2xl mb-3">
                    🤖
                  </div>
                  <CardTitle>NLP Asoslari</CardTitle>
                  <CardDescription>Preprocessing, tokenizatsiya va matn tahlili</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Tez orada qo'shiladi...</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/learn/large-language-models">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl mb-3">
                    🧠
                  </div>
                  <CardTitle>Katta Til Modellari</CardTitle>
                  <CardDescription>BERT, GPT va transformer arxitekturasi</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Tez orada qo'shiladi...</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/learn/speech-technologies">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl mb-3">
                    🎙️
                  </div>
                  <CardTitle>Nutq Texnologiyalari</CardTitle>
                  <CardDescription>ASR, TTS va ovozli ma'lumotlar</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Tez orada qo'shiladi...</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/learn/specialized-areas">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-2xl mb-3">
                    🎯
                  </div>
                  <CardTitle>Ixtisoslashgan Yo'nalishlar</CardTitle>
                  <CardDescription>Dialektlar, inklyuziv texnologiyalar</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Tez orada qo'shiladi...</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}