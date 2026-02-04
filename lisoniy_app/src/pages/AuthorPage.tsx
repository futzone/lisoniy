import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageCircle, 
  User, 
  Calendar,
  Award,
  FileText,
  MessageSquare,
  Mail,
  MapPin
} from "lucide-react";
import { motion } from "motion/react";

interface Author {
  name: string;
  avatar: string;
  contributions: number;
  rank: string;
  specialization: string;
  bio: string;
  location: string;
  email: string;
  joinDate: string;
}

interface Article {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  likes: number;
  comments: number;
}

interface Discussion {
  id: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
  upvotes: number;
  comments: number;
}

// Mock data
const mockAuthors: Record<string, Author> = {
  "dr-aziza-rahimova": {
    name: "Dr. Aziza Rahimova",
    avatar: "AR",
    contributions: 156,
    rank: "Expert",
    specialization: "NLP tadqiqotchisi",
    bio: "O'zbek tili uchun tabiiy tilni qayta ishlash sohasida 10 yildan ortiq tajribaga ega. Hozirda Toshkent Axborot Texnologiyalari Universitetida dotsent.",
    location: "Toshkent, O'zbekiston",
    email: "aziza.rahimova@example.com",
    joinDate: "2022-03-15"
  },
  "javohir-karimov": {
    name: "Javohir Karimov",
    avatar: "JK",
    contributions: 142,
    rank: "Expert",
    specialization: "Korpus muhandisi",
    bio: "Katta hajmdagi til korpuslari yaratish va qayta ishlashda mutaxassis. Open-source loyihalar ishtirokchisi.",
    location: "Samarqand, O'zbekiston",
    email: "javohir.karimov@example.com",
    joinDate: "2022-05-20"
  }
};

const mockArticlesByAuthor: Record<string, Article[]> = {
  "dr-aziza-rahimova": [
    {
      id: "1",
      title: "O'zbek tilida NLP: Hozirgi holat va kelajak istiqbollari",
      date: "2024-01-25",
      excerpt: "O'zbek tili uchun NLP texnologiyalari rivojlanishi va kelajakdagi imkoniyatlar haqida batafsil tahlil.",
      tags: ["NLP", "Tahlil", "Kelajak"],
      likes: 124,
      comments: 18
    },
    {
      id: "4",
      title: "Morfologik tahlil uchun yangi yondashuvlar",
      date: "2024-01-18",
      excerpt: "O'zbek tilining morfologik xususiyatlarini hisobga olgan yangi tahlil metodlari.",
      tags: ["Morfologiya", "NLP", "Tadqiqot"],
      likes: 95,
      comments: 14
    }
  ],
  "javohir-karimov": [
    {
      id: "2",
      title: "O'zbek korpusi yaratishda qiyinchiliklar va yechimlar",
      date: "2024-01-22",
      excerpt: "Katta hajmdagi korpus to'plashda duch keladigan muammolar va ularni hal qilish yo'llari.",
      tags: ["Korpus", "Ma'lumotlar", "Metodologiya"],
      likes: 98,
      comments: 12
    }
  ]
};

const mockDiscussionsByAuthor: Record<string, Discussion[]> = {
  "dr-aziza-rahimova": [
    {
      id: "4",
      title: "O'zbek tilida sentiment analysis",
      date: "2024-01-21",
      content: "Sentiment analysis uchun qanday yondashuvlarni tavsiya qilasiz?",
      tags: ["Sentiment", "NLP"],
      upvotes: 28,
      comments: 10
    }
  ],
  "javohir-karimov": [
    {
      id: "3",
      title: "O'zbek grammatikasi uchun parser",
      date: "2024-01-23",
      content: "Morfologik tahlil va sintaktik parsing uchun yangi vosita. Testdan o'tkazish uchun yordam kerak.",
      tags: ["Grammatika", "Parser", "Testing"],
      upvotes: 52,
      comments: 15
    }
  ]
};

export function AuthorPage() {
  const { authorSlug } = useParams<{ authorSlug: string }>();
  const navigate = useNavigate();

  const author = mockAuthors[authorSlug || ""];
  const articles = mockArticlesByAuthor[authorSlug || ""] || [];
  const discussions = mockDiscussionsByAuthor[authorSlug || ""] || [];

  if (!author) {
    return (
      <div className="container px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Muallif topilmadi
            </h3>
            <p className="text-muted-foreground mb-4">
              Siz qidirayotgan muallif mavjud emas
            </p>
            <Button onClick={() => navigate("/hamjamiyat")}>
              Hamjamiyatga Qaytish
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/hamjamiyat")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Hamjamiyatga Qaytish
        </Button>

        {/* Author Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-3xl font-bold">
                  {author.avatar}
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">
                      {author.name}
                    </h1>
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
                      {author.rank}
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {author.specialization}
                  </p>
                </div>
                <p className="text-foreground mb-4">
                  {author.bio}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{author.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Qo'shilgan: {author.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span>{author.contributions} hissa</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Xabar Yuborish
                </Button>
                <Button variant="outline">
                  Kuzatish
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Author Content */}
        <Tabs defaultValue="maqolalar" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="maqolalar" className="gap-2">
              <FileText className="h-4 w-4" />
              Maqolalar ({articles.length})
            </TabsTrigger>
            <TabsTrigger value="muhokamalar" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Muhokamalar ({discussions.length})
            </TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="maqolalar">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                {articles.length > 0 ? (
                  articles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link to={`/hamjamiyat/post/${article.id}`}>
                        <Card className="transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                          <CardHeader>
                            <CardTitle className="mb-2 hover:text-primary">
                              {article.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{article.date}</span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-muted-foreground">{article.excerpt}</p>
                            <div className="flex flex-wrap gap-2">
                              {article.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                {article.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                {article.comments} izoh
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Hali maqola yozilmagan
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistika</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Maqolalar</span>
                      <span className="font-semibold">{articles.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Muhokamalar</span>
                      <span className="font-semibold">{discussions.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Jami Hissalar</span>
                      <span className="font-semibold text-primary">{author.contributions}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Aloqa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${author.email}`} className="text-primary hover:underline">
                        {author.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{author.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="muhokamalar">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                {discussions.length > 0 ? (
                  discussions.map((discussion, index) => (
                    <motion.div
                      key={discussion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link to={`/hamjamiyat/discussion/${discussion.id}`}>
                        <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                          <CardContent className="p-6">
                            <h3 className="mb-2 text-xl font-semibold text-foreground hover:text-primary">
                              {discussion.title}
                            </h3>
                            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{discussion.date}</span>
                            </div>
                            <p className="mb-4 text-foreground">{discussion.content}</p>
                            <div className="mb-4 flex flex-wrap gap-2">
                              {discussion.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                {discussion.upvotes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                {discussion.comments} izoh
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Hali muhokama boshlanmagan
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistika</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Maqolalar</span>
                      <span className="font-semibold">{articles.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Muhokamalar</span>
                      <span className="font-semibold">{discussions.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Jami Hissalar</span>
                      <span className="font-semibold text-primary">{author.contributions}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Aloqa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${author.email}`} className="text-primary hover:underline">
                        {author.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{author.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}