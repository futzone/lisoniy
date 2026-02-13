import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ThumbsUp, MessageCircle, User, Calendar, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";

// ... (keep interfaces)

export function HubPage() {
  const [filter, setFilter] = useState<"all" | "discussions" | "articles">("all");
  const [posts, setPosts] = useState<HubPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Use environment variable for API URL
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.lisoniy.uz';
        const response = await fetch(`${apiUrl}/posts?limit=20`);
        if (response.ok) {
            const data = await response.json();
            // Map API data to UI format if needed
            const mappedPosts = data.items ? data.items.map((p: any) => ({
                id: p.id,
                title: p.title,
                author: p.author?.full_name || "Unknown",
                authorAvatar: p.author?.full_name?.[0] || "U",
                content: p.content?.substring(0, 150) + "...",
                tags: p.tags || [],
                upvotes: p.upvotes || 0,
                comments: p.comments_count || 0,
                date: formatDate(p.created_at),
                type: p.type || 'article'
            })) : [];
            setPosts(mappedPosts);
        }
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="container px-3 sm:px-4 py-4 sm:py-8">
      <div className="mb-4 sm:mb-8">
        <h1 className="mb-2 sm:mb-3 text-xl sm:text-4xl font-bold text-foreground">
          Lisoniy Hub — Hamjamiyat
        </h1>
        <p className="text-sm sm:text-lg text-muted-foreground">
          Bilim almashish, muhokama va hamkorlik platformasi
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
        {/* Main Feed */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="all" className="mb-4 sm:mb-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="text-xs sm:text-sm">Barchasi</TabsTrigger>
              <TabsTrigger value="discussions" className="text-xs sm:text-sm">Muhokamalar</TabsTrigger>
              <TabsTrigger value="articles" className="text-xs sm:text-sm">Maqolalar</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-3 sm:space-y-4">
            {loading ? (
                <div className="text-center py-10">Yuklanmoqda...</div>
            ) : posts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">Hozircha postlar yo'q.</div>
            ) : posts.map((post: HubPost) => (
              <Card key={post.id} className="transition-all hover:shadow-md hover:border-primary/50">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex gap-3 sm:gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs sm:text-base">
                        <span className="font-semibold">{post.authorAvatar}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/hamjamiyat/${post.type === 'article' ? 'article' : 'discussion'}/${post.id}`}>
                        <h3 className="mb-1 sm:mb-2 text-sm sm:text-xl font-semibold text-foreground hover:text-primary cursor-pointer line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      <div className="mb-2 sm:mb-3 flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="truncate max-w-[80px] sm:max-w-none">{post.author}</span>
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