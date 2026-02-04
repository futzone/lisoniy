import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/app/components/ui/alert";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { FileText, MessageSquare, Calendar, ThumbsUp, MessageCircle, Award, TrendingUp, Loader2, Info } from "lucide-react";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { useSearchParams } from "react-router-dom";
import { CreatePostDialog } from "@/app/components/hamjamiyat/CreatePostDialog";
import { postsApi, Post, Author } from "@/api/postsApi";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/app/components/ui/button";
import { format } from "date-fns";


const authorToSlug = (name: string) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/ /g, '-');
};

export function HamjamiyatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'articles';

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [popularTags, setPopularTags] = useState<{ tag: string, contents: number }[]>([]);
  const { user } = useAuthStore();
  const limit = 10;

  const fetchPosts = async (reset = false) => {
    setLoading(true);
    try {
      const currentPage = reset ? 0 : page;
      const type = activeTab === 'articles' ? 'article' : 'discussion';

      const newPosts = await postsApi.getPosts({
        skip: currentPage * limit,
        limit: limit,
        type: type
      });

      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      if (newPosts.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (reset) setPage(1);
      else setPage(prev => prev + 1);

    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const tags = await postsApi.getPopularTags();
      setPopularTags(tags);
    } catch (error) {
      console.error("Failed to fetch sidebar data:", error);
    }
  };

  useEffect(() => {
    fetchPosts(true);
    fetchTags();
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const navigate = useNavigate();

  const handleLike = async (postId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      return;
    }
    try {
      // Optimistic update
      setPosts(prevPosts => prevPosts.map(p => {
        if (p.id === postId) {
          const isLiked = !!p.is_liked;
          return {
            ...p,
            total_likes: isLiked ? Math.max(0, p.total_likes - 1) : p.total_likes + 1,
            is_liked: !isLiked
          };
        }
        return p;
      }));

      await postsApi.likePost(postId);

      // Sync with backend
      const updatedPost = await postsApi.getPostById(postId);
      setPosts(prevPosts => prevPosts.map(p => p.id === postId ? updatedPost : p));

    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const navigateToPost = (postId: number, type: 'article' | 'discussion') => {
    navigate(`/hamjamiyat/${type}/${postId}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const renderPostCard = (post: Post, index: number) => (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => navigateToPost(post.id, post.type)}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl hover:text-primary">
                {post.title}
              </CardTitle>
              <CardDescription className="mt-2 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs">
                      {itemAvatarFallback(post.owner?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  {post.owner?.full_name || 'Anonymous'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.created_at)}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground line-clamp-3">
            {/* Simple strip markdown or just show body truncated could be better, but for now line-clamp */}
            {post.body.replace(/[#*`]/g, '').slice(0, 200)}...
          </p>
          <div className="flex flex-wrap gap-2">
            {post.tags?.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <button
              onClick={(e) => handleLike(post.id, e)}
              className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${post.is_liked ? 'text-blue-600' : ''}`}
            >
              <ThumbsUp className={`h-4 w-4 ${post.is_liked ? 'fill-current' : ''}`} />
              {post.total_likes}
            </button>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post.total_comments || 0}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const itemAvatarFallback = (name?: string) => {
    if (!name) return 'U';
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const Sidebar = () => (
    <div className="space-y-6">
      <CreatePostDialog onPostCreated={() => fetchPosts(true)} />

      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Ommabop Mavzular
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.length > 0 ? (
              popularTags.map((tag: any) => (
                <Link key={tag.tag} to={`/hamjamiyat/tag/${tag.tag}`}>
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
                  >
                    #{tag.tag} <span className="ml-1 opacity-60 text-[10px]">{tag.contents}</span>
                  </Badge>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted">Hozircha teglar yo'q</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <AppLayout pageTitle="Hamjamiyat">
      <div className="p-4 lg:p-6">
        <div className="mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <Alert className="mb-6 bg-blue-50/50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-300">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="mb-2 font-semibold">
                Ushbu maqola va forum ma'lumotlari ham dataset sifatida shakllantiriladi. Shuning uchun iltimos quyidagilarga e'tibor bering:
              </AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 ml-1">
                  <li>Imlo qoidalariga rioya qiling.</li>
                  <li>To'g'ri ma'lumotlar taqdim qiling.</li>
                  <li>Odob-axloq qoidalariga amal qiling.</li>
                </ul>
              </AlertDescription>
            </Alert>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="articles" asChild>
                <div onClick={() => handleTabChange('articles')} className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  Maqolalar
                </div>
              </TabsTrigger>
              <TabsTrigger value="forum" asChild>
                <div onClick={() => handleTabChange('forum')} className="flex items-center gap-2 cursor-pointer">
                  <MessageSquare className="h-4 w-4" />
                  Forum
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  {posts.filter(p => p.type === 'article').length === 0 && !loading ? (
                    <div className="text-center py-10 text-muted-foreground">
                      Hozircha maqolalar mavjud emas.
                    </div>
                  ) : (
                    posts.map((post, index) => renderPostCard(post, index))
                  )}

                  {loading && (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}

                  {!loading && hasMore && posts.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => fetchPosts(false)}
                    >
                      Ko'proq yuklash
                    </Button>
                  )}
                </div>
                <Sidebar />
              </div>
            </TabsContent>

            <TabsContent value="forum" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  {posts.filter(p => p.type === 'discussion').length === 0 && !loading ? (
                    <div className="text-center py-10 text-muted-foreground">
                      Hozircha muhokamalar mavjud emas.
                    </div>
                  ) : (
                    posts.map((post, index) => renderPostCard(post, index))
                  )}

                  {loading && (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}

                  {!loading && hasMore && posts.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => fetchPosts(false)}
                    >
                      Ko'proq yuklash
                    </Button>
                  )}
                </div>
                <Sidebar />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}