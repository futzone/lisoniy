import { Link } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { AppLayout } from "@/app/components/layout/AppLayout";
import {
  Database,
  MessageSquare,
  FileText,
  Star,
  MessageCircle,
  ThumbsUp,
  ArrowRight,
  Download
} from "lucide-react";
import { motion } from "motion/react";

// Mock data for user's contributions
const userDiscussions = [
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
];

const userArticles = [
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
];

const userDatasets = [
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
];

export function MyContributionsPage() {
  return (
    <AppLayout pageTitle="Mening hissalarim">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Forum Discussions Card */}
        <Card className="border-2 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Forum muhokamalar
              </CardTitle>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {userDiscussions.length}
              </Badge>
            </div>
            <CardDescription>Boshlagan va qatnashgan</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            {userDiscussions.length > 0 ? (
              <>
                <div className="space-y-3 mb-4">
                  {userDiscussions.slice(0, 3).map((discussion, index) => (
                    <motion.div
                      key={discussion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link to={`/hamjamiyat?tab=forum&discussion=${discussion.id}`}>
                        <div className="p-3 rounded-lg border hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer">
                          <h3 className="font-medium text-sm mb-2 line-clamp-2">{discussion.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{discussion.replies}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{discussion.likes}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <Link to="/dashboard/contributions/discussions">
                  <Button variant="outline" className="w-full gap-2">
                    Barchasi
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Hali muhokamalar yo'q</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Articles Card */}
        <Card className="border-2 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Maqolalar
              </CardTitle>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {userArticles.length}
              </Badge>
            </div>
            <CardDescription>Yozgan maqolalaringiz</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            {userArticles.length > 0 ? (
              <>
                <div className="space-y-3 mb-4">
                  {userArticles.slice(0, 3).map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link to={`/articles/${article.id}`}>
                        <div className="p-3 rounded-lg border hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer">
                          <h3 className="font-medium text-sm mb-2 line-clamp-2">{article.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              <span>{article.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{article.comments}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <Link to="/dashboard/contributions/articles">
                  <Button variant="outline" className="w-full gap-2">
                    Barchasi
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Hali maqolalar yo'q</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Datasets Card */}
        <Card className="border-2 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Datasetlar
              </CardTitle>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {userDatasets.length}
              </Badge>
            </div>
            <CardDescription>Yuklangan datasetlar</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            {userDatasets.length > 0 ? (
              <>
                <div className="space-y-3 mb-4">
                  {userDatasets.slice(0, 3).map((dataset, index) => (
                    <motion.div
                      key={dataset.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link to={`/dashboard/dataset/${dataset.id}`}>
                        <div className="p-3 rounded-lg border hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer">
                          <h3 className="font-medium text-sm mb-2 line-clamp-2">{dataset.name}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              <span>{dataset.downloads}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {dataset.type}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <Link to="/dashboard/contributions/datasets">
                  <Button variant="outline" className="w-full gap-2">
                    Barchasi
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Hali datasetlar yo'q</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}