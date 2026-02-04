import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ThumbsUp, MessageCircle, User, Calendar, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";

interface HubPost {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  content: string;
  tags: string[];
  upvotes: number;
  comments: number;
  date: string;
  type: 'article' | 'discussion';
}

interface Contributor {
  name: string;
  avatar: string;
  contributions: number;
  rank: string;
}

const mockPosts: Post[] = [
  {
    id: "1",
    title: "O'zbek tili uchun yangi NER modeli",
    author: "Dilshod Axmedov",
    authorAvatar: "DA",
    content: "Named Entity Recognition (NER) modeli uchun yangi dataset yaratdim. 50,000 ta belgilangan jumla bor.",
    tags: ["NLP", "Dataset", "NER"],
    upvotes: 45,
    comments: 12,
    date: "2024-01-25"
  },
  {
    id: "2",
    title: "Transliteratsiya API - ochiq manba",
    author: "Nodira Tursunova",
    authorAvatar: "NT",
    content: "Kirill-Lotin transliteratsiya uchun RESTful API yaratdim. GitHub'da mavjud.",
    tags: ["API", "Open-Source", "Transliteratsiya"],
    upvotes: 38,
    comments: 8,
    date: "2024-01-24"
  },
  {
    id: "3",
    title: "O'zbek grammatikasi uchun parser",
    author: "Javohir Karimov",
    authorAvatar: "JK",
    content: "Morfologik tahlil va sintaktik parsing uchun yangi vosita. Testdan o'tkazish uchun yordam kerak.",
    tags: ["Grammatika", "Parser", "Testing"],
    upvotes: 52,
    comments: 15,
    date: "2024-01-23"
  },
  {
    id: "4",
    title: "Lisoniy platformasi haqida fikrlaringiz?",
    author: "Malika Rahimova",
    authorAvatar: "MR",
    content: "Platformadan foydalanyapman. Juda yaxshi lekin ba'zi xususiyatlarni qo'shish mumkin deb o'ylayman.",
    tags: ["Fikr", "Platform", "Taklif"],
    upvotes: 29,
    comments: 22,
    date: "2024-01-22"
  },
  {
    id: "5",
    title: "O'zbek tilida sentiment analiz dataset",
    author: "Aziz Yusupov",
    authorAvatar: "AY",
    content: "Ijtimoiy tarmoqlardan 100K+ xabar yig'ib sentiment analiz uchun dataset tayyorladim.",
    tags: ["Dataset", "Sentiment", "Social Media"],
    upvotes: 67,
    comments: 18,
    date: "2024-01-21",
    type: 'article'
  }
];

const topContributors: Contributor[] = [
  { name: "Dilshod Axmedov", avatar: "DA", contributions: 156, rank: "Expert" },
  { name: "Nodira Tursunova", avatar: "NT", contributions: 142, rank: "Expert" },
  { name: "Javohir Karimov", avatar: "JK", contributions: 128, rank: "Advanced" },
  { name: "Aziz Yusupov", avatar: "AY", contributions: 98, rank: "Advanced" },
  { name: "Malika Rahimova", avatar: "MR", contributions: 76, rank: "Intermediate" }
];

const trendingTopics = [
  { tag: "#NLP", count: 234 },
  { tag: "#Dataset", count: 189 },
  { tag: "#AI", count: 156 },
  { tag: "#Transliteratsiya", count: 142 },
  { tag: "#Grammatika", count: 98 }
];

export function HubPage() {
  const [filter, setFilter] = useState<"all" | "discussions" | "articles">("all");

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-3 text-4xl font-bold text-foreground">
          Lisoniy Hub — Hamjamiyat
        </h1>
        <p className="text-lg text-muted-foreground">
          Bilim almashish, muhokama va hamkorlik platformasi
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Feed */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Barchasi</TabsTrigger>
              <TabsTrigger value="discussions">Muhokamalar</TabsTrigger>
              <TabsTrigger value="articles">Maqolalar</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {mockPosts.map((post: HubPost) => (
              <Card key={post.id} className="transition-all hover:shadow-md hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <span className="font-semibold">{post.authorAvatar}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <Link to={`/hamjamiyat/${post.type === 'article' ? 'article' : 'discussion'}/${post.id}`}>
                        <h3 className="mb-2 text-xl font-semibold text-foreground hover:text-primary cursor-pointer">
                          {post.title}
                        </h3>
                      </Link>
                      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                        <span>•</span>
                        <Calendar className="h-3 w-3" />
                        <span>{post.date}</span>
                      </div>
                      <p className="mb-4 text-foreground">{post.content}</p>

                      {/* Tags */}
                      <div className="mb-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button className="flex items-center gap-1 transition-colors hover:text-primary">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.upvotes}</span>
                        </button>
                        <button className="flex items-center gap-1 transition-colors hover:text-primary">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments} izoh</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-6 text-center">
            <Button variant="outline">Ko'proq Yuklash</Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="space-y-6">
            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Top Hissa Qo'shuvchilar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topContributors.map((contributor, idx) => (
                  <div key={contributor.name} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      {contributor.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{contributor.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {contributor.contributions} hissa
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {contributor.rank}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Mashhur Mavzular
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {trendingTopics.map((topic) => (
                  <div key={topic.tag} className="flex items-center justify-between">
                    <span className="font-medium text-primary hover:underline cursor-pointer">
                      {topic.tag}
                    </span>
                    <span className="text-sm text-muted-foreground">{topic.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
              <CardHeader>
                <CardTitle>Hissa Qo'shing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Jamiyatga qo'shiling va o'zbek tili rivojiga hissa qo'shing
                </p>
                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    Mavzu Yaratish
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Dataset Yuklash
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}