import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { 
  ArrowLeft,
  Database,
  Download,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";

// Mock data - in real app this would come from API
const allDatasets = [
  {
    id: 1,
    name: "O'zbek tili Parallel Corpus",
    description: "O'zbek-ingliz parallel matnlar to'plami. Tarjima modellari uchun",
    type: "Parallel",
    size: "50K",
    downloads: 1234,
    stars: 89,
    updated: "2 kun oldin",
    status: "published"
  },
  {
    id: 2,
    name: "NER Dataset - Atoqli otlar",
    description: "O'zbek tilidagi matnlardan olingan shaxs, joy va tashkilot nomlari",
    type: "NER",
    size: "25K",
    downloads: 856,
    stars: 67,
    updated: "1 hafta oldin",
    status: "published"
  },
  {
    id: 3,
    name: "Legal Q&A Dataset",
    description: "O'zbekiston qonunchiligiga oid savol-javoblar to'plami",
    type: "Legal Q&A",
    size: "10K",
    downloads: 423,
    stars: 45,
    updated: "3 hafta oldin",
    status: "draft"
  },
  {
    id: 4,
    name: "Sentiment Analysis Dataset",
    description: "O'zbek tilidagi matnlarning hissiy tahlili uchun belgilangan ma'lumotlar",
    type: "Sentiment",
    size: "15K",
    downloads: 678,
    stars: 52,
    updated: "1 oy oldin",
    status: "published"
  },
  {
    id: 5,
    name: "Instruction Dataset - Umumiy",
    description: "Turli sohalardagi savol-javob juftliklari to'plami",
    type: "Instruction",
    size: "30K",
    downloads: 1567,
    stars: 123,
    updated: "2 oy oldin",
    status: "published"
  },
];

const ITEMS_PER_PAGE = 10;

export function AllDatasetsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(allDatasets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDatasets = allDatasets.slice(startIndex, endIndex);

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
              <Database className="h-5 w-5" />
              <h1 className="text-xl font-bold">Mening datasetlarim</h1>
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
              Jami <span className="font-semibold text-foreground">{allDatasets.length}</span> ta dataset
            </p>
            <Badge variant="secondary" className="text-base px-3 py-1">
              Sahifa {currentPage} / {totalPages}
            </Badge>
          </div>

          {/* Datasets List */}
          <div className="space-y-4">
            {currentDatasets.map((dataset, index) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={`/dashboard/dataset/${dataset.id}`}>
                  <Card className="border-2 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{dataset.name}</h3>
                            <Badge variant="secondary">{dataset.type}</Badge>
                            {dataset.status === 'draft' && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                Draft
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{dataset.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Database className="h-4 w-4" />
                            <span>{dataset.size}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{dataset.downloads}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{dataset.stars}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">Yangilangan: {dataset.updated}</span>
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