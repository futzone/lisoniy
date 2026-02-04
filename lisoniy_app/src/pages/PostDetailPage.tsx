import { useState, useEffect } from "react";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Textarea } from "@/app/components/ui/textarea";
import {
    ArrowLeft,
    ThumbsUp,
    MessageCircle,
    Calendar,
    User,
    Share2,
    Loader2,
    Send
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "motion/react";
import { SEO } from "@/app/components/SEO";
import { generateArticleSchema, truncateText, extractPlainText } from "@/lib/seo";
import { postsApi, Post, Comment } from "@/api/postsApi";
import { useAuthStore } from "@/store/authStore";
import { format } from "date-fns";

export function PostDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentBody, setCommentBody] = useState("");
    const [sendingComment, setSendingComment] = useState(false);

    useEffect(() => {
        if (id) {
            fetchPost(id);
            fetchComments(id);
        }
    }, [id]);

    const fetchPost = async (postId: string) => {
        setLoading(true);
        try {
            const data = await postsApi.getPostById(postId);
            setPost(data);
        } catch (error) {
            console.error("Failed to fetch post:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (postId: string) => {
        setLoadingComments(true);
        try {
            const data = await postsApi.getComments(postId);
            setComments(data);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setLoadingComments(false);
        }
    };

    const itemAvatarFallback = (name?: string) => {
        if (!name) return 'U';
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const handleLike = async () => {
        if (!post || !user) return;

        // Check current state before optimistic update
        const isCurrentlyLiked = !!post.is_liked;

        try {
            // Optimistic update
            setPost((prev: Post | null) => {
                if (!prev) return null;
                return {
                    ...prev,
                    total_likes: isCurrentlyLiked ? Math.max(0, prev.total_likes - 1) : prev.total_likes + 1,
                    is_liked: !isCurrentlyLiked
                };
            });

            if (isCurrentlyLiked) {
                await postsApi.unlikePost(post.id);
            } else {
                await postsApi.likePost(post.id);
            }

            // Sync with backend
            const updatedPost = await postsApi.getPostById(post.id);
            setPost(updatedPost);
        } catch (error) {
            console.error("Failed to like post:", error);
            // Sync on error to clear invalid state
            if (post) {
                const updatedPost = await postsApi.getPostById(post.id);
                setPost(updatedPost);
            }
        }
    };

    const [replyTo, setReplyTo] = useState<Comment | null>(null);

    const handleCommentSubmit = async () => {
        if (!post || !user || !commentBody.trim()) return;
        setSendingComment(true);
        try {
            await postsApi.createComment(post.id, {
                body: commentBody,
                parent_id: replyTo?.id
            });
            setCommentBody("");
            setReplyTo(null);
            fetchComments(post.id.toString());

            // Sync post data
            const updatedPost = await postsApi.getPostById(post.id);
            setPost(updatedPost);
        } catch (error) {
            console.error("Failed to submit comment:", error);
        } finally {
            setSendingComment(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        try {
            return format(new Date(dateString), 'dd MMM yyyy');
        } catch (e) {
            return dateString;
        }
    };

    const CommentItem = ({ comment, depth = 0 }: { comment: Comment, depth?: number }) => (
        <div className={`space-y-4 ${depth > 0 ? 'ml-8 mt-4 border-l pl-4' : ''}`}>
            <div key={comment.id} className="flex gap-4">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>{itemAvatarFallback(comment.owner?.full_name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{comment.owner?.full_name || 'Foydalanuvchi'}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-sm text-foreground/90">{comment.body}</p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setReplyTo(comment);
                                document.getElementById('comment-input')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-xs text-muted-foreground hover:text-primary"
                        >
                            Javob berish
                        </button>
                    </div>
                </div>
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-4">
                    {comment.replies.map((reply: Comment) => (
                        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Mavzu topilmadi</h1>
                <Button onClick={() => navigate('/hamjamiyat')}>Ortga qaytish</Button>
            </div>
        );
    }

    // Generate SEO data
    const baseUrl = window.location.origin;
    const articleSchema = generateArticleSchema({
        ...post,
        author: post.owner?.full_name || 'Anonymous',
        date: post.created_at,
        content: post.body,
        likes: post.total_likes,
        comments: post.total_comments || post.comments_count || 0
    }, baseUrl);
    const description = truncateText(extractPlainText(post.body), 160);
    const postUrl = `${baseUrl}/hamjamiyat/${post.type === 'article' ? 'article' : 'discussion'}/${post.id}`;

    return (
        <AppLayout pageTitle="Hamjamiyat">
            <div className="container px-4 py-8">
                <SEO
                    title={`${post.title} | Lisoniy`}
                    description={description}
                    keywords={post.tags}
                    url={postUrl}
                    type="article"
                    author={post.owner?.full_name}
                    publishedTime={post.created_at}
                    structuredData={articleSchema}
                />
                <Button
                    variant="ghost"
                    className="mb-6 gap-2"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Orqaga
                </Button>

                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card>
                                <CardHeader>
                                    <div className="mb-4 flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                                {itemAvatarFallback(post.owner?.full_name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <Link
                                                to={`/hamjamiyat/author/${post.owner_id}`}
                                                className="font-semibold text-foreground hover:text-primary"
                                            >
                                                {post.owner?.full_name || 'Anonymous'}
                                            </Link>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatDate(post.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <CardTitle className="text-3xl">{post.title}</CardTitle>

                                    <div className="flex flex-wrap gap-2 pt-4">
                                        {post.tags?.map((tag: string) => (
                                            <Link key={tag} to={`/hamjamiyat?tag=${tag}`}>
                                                <Badge variant="outline" className="text-xs hover:bg-primary/10 cursor-pointer">
                                                    #{tag}
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                </CardHeader>

                                <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                                    <ReactMarkdown>{post.body}</ReactMarkdown>
                                </CardContent>

                                <div className="border-t p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={handleLike}
                                                className={`flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary ${post.is_liked ? 'text-blue-600' : ''}`}
                                            >
                                                <ThumbsUp className={`h-5 w-5 ${post.is_liked ? 'fill-current text-blue-600' : ''}`} />
                                                <span className="font-medium">{post.total_likes}</span>
                                            </button>
                                            <button className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                                                <MessageCircle className="h-5 w-5" />
                                                <span className="font-medium">{post.total_comments || post.comments_count || 0} izoh</span>
                                            </button>
                                        </div>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Share2 className="h-4 w-4" />
                                            Ulashish
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            {/* Comments Section */}
                            <Card className="mt-6" id="comments">
                                <CardHeader>
                                    <CardTitle>Izohlar ({post.total_comments || post.comments_count || 0})</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Comment Input */}
                                    {user ? (
                                        <div className="flex gap-4" id="comment-input">
                                            <Avatar>
                                                <AvatarFallback>{itemAvatarFallback(user.full_name || user.email)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-2">
                                                {replyTo && (
                                                    <div className="flex items-center justify-between bg-muted/50 p-2 rounded text-sm">
                                                        <span>
                                                            <span className="text-muted-foreground">Javob berish:</span> @{replyTo.owner?.full_name}
                                                        </span>
                                                        <button onClick={() => setReplyTo(null)} className="text-muted-foreground hover:text-destructive">
                                                            Bekor qilish
                                                        </button>
                                                    </div>
                                                )}
                                                <Textarea
                                                    placeholder={replyTo ? "Javobingizni qoldiring..." : "Fikringizni qoldiring..."}
                                                    value={commentBody}
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentBody(e.target.value)}
                                                />
                                                <div className="flex justify-end">
                                                    <Button onClick={handleCommentSubmit} disabled={sendingComment || !commentBody.trim()}>
                                                        {sendingComment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                        Yuborish
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                                            Izoh qoldirish uchun <Link to="/auth/login" className="text-primary underline">tizimga kiring</Link>
                                        </div>
                                    )}

                                    {/* Comments List */}
                                    <div className="space-y-6 mt-6">
                                        {loadingComments ? (
                                            <div className="flex justify-center py-4">
                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                            </div>
                                        ) : comments.length === 0 ? (
                                            <p className="text-center text-muted-foreground py-4">Hozircha izohlar yo'q. Birinchi bo'lib fikr bildiring!</p>
                                        ) : (
                                            comments.map((comment) => (
                                                <CommentItem key={comment.id} comment={comment} />
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Muallif haqida</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                                            {itemAvatarFallback(post.owner?.full_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Link
                                            to={`/hamjamiyat/author/${post.owner_id}`}
                                            className="font-semibold hover:text-primary"
                                        >
                                            {post.owner?.full_name || 'Anonymous'}
                                        </Link>
                                        <p className="text-sm text-muted-foreground">Muallif</p>
                                    </div>
                                </div>
                                <Link to={`/hamjamiyat/author/${post.owner_id}`}>
                                    <Button variant="outline" className="w-full">
                                        <User className="mr-2 h-4 w-4" />
                                        Profilni ko'rish
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
