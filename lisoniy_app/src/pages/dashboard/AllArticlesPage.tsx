import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { 
  ArrowLeft,
  FileText,
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";

// Mock data - in real app this would come from API
const allArticles = [
  {
    id: 1,
    title: "O'zbek tili uchun NER modellarini yaratish",
    excerpt: "Ushbu maqolada o'zbek tili uchun Named Entity Recognition modellarini yaratish bo'yicha tajriba ulashiladi...",
    tags: ["NER", "ML", "NLP"],
    views: 567,
    likes: 34,
    comments: 8,
    published: "1 hafta oldin"
  },
  {
    id: 2,
    title: "Dataset sifatini baholash metodlari",
    excerpt: "Ma'lumotlar to'plami sifatini baholashning turli usullari va mezonlari haqida batafsil...",
    tags: ["Dataset", "Quality", "Best Practices"],
    views: 342,
    likes: 21,
    comments: 5,
    published: "2 hafta oldin"
  },
  {
    id: 3,
    title: "Transformerlar bilan ishlash",
    excerpt: "O'zbek tili uchun transformer modellarini sozlash va ishlatish bo'yicha amaliy qo'llanma...",
    tags: ["Transformers", "BERT", "Training"],
    views: 789,
    likes: 45,
    comments: 12,
    published: "3 hafta oldin"
  },
  {
    id: 4,
    title: "Ma'lumotlarni tozalash texnikalari",
    excerpt: "Dataset yaratishda ma'lumotlarni tozalash va tayyorlashning eng yaxshi usullari...",
    tags: ["Data Cleaning", "Preprocessing"],
    views: 234,
    likes: 15,
    comments: 4,
    published: "1 oy oldin"
  },
];

const ITEMS_PER_PAGE = 10;

export function AllArticlesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(allArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = allArticles.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Orqaga
            </Button>
            <div className="h-8 border-l border-border" />
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <h1 className="text-xl font-bold">Mening maqolalarim</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Stats */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Jami <span className="font-semibold text-foreground">{allArticles.length}</span> ta maqola
            </p>
            <Badge variant="secondary" className="text-base px-3 py-1">
              Sahifa {currentPage} / {totalPages}
            </Badge>
          </div>

          {/* Articles List */}
          <div className="space-y-4">
            {currentArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={`/hamjamiyat?tab=articles&article=${article.id}`}>
                  <Card className="border-2 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{article.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{article.comments}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.published}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Oldingi
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Keyingi
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}