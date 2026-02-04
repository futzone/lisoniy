import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Hash,
  Loader2,
  FileText,
  MessageSquare
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { postsApi, Post } from "@/api/postsApi";
import { format } from "date-fns";

export function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostsByTag = async () => {
      if (!tag) return;
      setLoading(true);
      try {
        const fetchedPosts = await postsApi.getPosts({ tag: tag });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts by tag:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByTag();
  }, [tag]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const itemAvatarFallback = (name?: string) => {
    if (!name) return 'U';
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const articles = posts.filter(p => p.type === 'article');
  const discussions = posts.filter(p => p.type === 'discussion');
  const totalPosts = posts.length;

  const renderPostCard = (post: Post, index: number) => (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/hamjamiyat/${post.type === 'article' ? 'article' : 'discussion'}/${post.id}`}>
        <Card className="transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer h-full">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="mb-2 hover:text-primary line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[10px]">
                        {itemAvatarFallback(post.owner?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate max-w-[150px]">{post.owner?.full_name || 'Anonymous'}</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.created_at)}
                  </span>
                </CardDescription>
              </div>
              {post.type === 'article' ? (
                <FileText className="h-5 w-5 text-blue-500 opacity-50" />
              ) : (
                <MessageSquare className="h-5 w-5 text-green-500 opacity-50" />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground line-clamp-3 text-sm">
              {post.body.replace(/[#*`]/g, '')}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Badge
                  key={t}
                  variant={t === tag ? "default" : "secondary"}
                  className="text-xs"
                >
                  #{t}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {post.total_views || 0} {/* Using views or likes if avail */}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {post.total_comments || 0} izoh
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="container px-4 py-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Hash className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              {tag}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {totalPosts} ta post topildi
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-1">
          <div className="space-y-8">
            {/* Articles */}
            {articles.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-6 w-6" /> Maqolalar
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article, index) => renderPostCard(article, index))}
                </div>
              </div>
            )}

            {/* Discussions */}
            {discussions.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" /> Muhokamalar
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {discussions.map((discussion, index) => renderPostCard(discussion, index))}
                </div>
              </div>
            )}

            {totalPosts === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Hash className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Hech narsa topilmadi
                  </h3>
                  <p className="text-muted-foreground">
                    Bu teg bilan hech qanday post mavjud emas
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}