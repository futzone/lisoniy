import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { 
  ArrowLeft,
  MessageSquare, 
  MessageCircle,
  Eye,
  ThumbsUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";

// Mock data - in real app this would come from API
const allDiscussions = [
  {
    id: 1,
    title: "NER dataset uchun best practice'lar",
    category: "Savollar",
    replies: 12,
    views: 234,
    likes: 8,
    created: "3 kun oldin",
    lastActivity: "1 kun oldin"
  },
  {
    id: 2,
    title: "O'zbek tilida sentiment analysis",
    category: "Muhokamalar",
    replies: 5,
    views: 89,
    likes: 3,
    created: "1 hafta oldin",
    lastActivity: "3 kun oldin"
  },
  {
    id: 3,
    title: "Parallel corpus sifatini oshirish yo'llari",
    category: "Taklif",
    replies: 18,
    views: 456,
    likes: 15,
    created: "2 hafta oldin",
    lastActivity: "5 kun oldin"
  },
  {
    id: 4,
    title: "Dataset versiyalash tizimi",
    category: "Muhokamalar",
    replies: 7,
    views: 123,
    likes: 5,
    created: "3 hafta oldin",
    lastActivity: "1 hafta oldin"
  },
  {
    id: 5,
    title: "O'zbek tilida tokenization",
    category: "Savollar",
    replies: 15,
    views: 345,
    likes: 12,
    created: "1 oy oldin",
    lastActivity: "2 hafta oldin"
  },
];

const ITEMS_PER_PAGE = 10;

export function AllDiscussionsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(allDiscussions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDiscussions = allDiscussions.slice(startIndex, endIndex);

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
              <MessageSquare className="h-5 w-5" />
              <h1 className="text-xl font-bold">Mening forum muhokamalarim</h1>
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
              Jami <span className="font-semibold text-foreground">{allDiscussions.length}</span> ta muhokama
            </p>
            <Badge variant="secondary" className="text-base px-3 py-1">
              Sahifa {currentPage} / {totalPages}
            </Badge>
          </div>

          {/* Discussions List */}
          <div className="space-y-4">
            {currentDiscussions.map((discussion, index) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={`/hamjamiyat?tab=forum&discussion=${discussion.id}`}>
                  <Card className="border-2 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{discussion.title}</h3>
                            <Badge variant="outline">{discussion.category}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{discussion.replies} javob</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{discussion.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{discussion.likes}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>Yaratilgan: {discussion.created}</div>
                          <div className="text-xs">Oxirgi: {discussion.lastActivity}</div>
                        </div>
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