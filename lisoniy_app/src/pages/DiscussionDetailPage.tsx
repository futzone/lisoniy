import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Calendar,
  User,
  Share2
} from "lucide-react";
import { motion } from "motion/react";

// Mock data
const mockDiscussion = {
  id: "1",
  title: "O'zbek tili uchun yangi NER modeli",
  author: "Dilshod Axmedov",
  authorAvatar: "DA",
  date: "2024-01-25",
  tags: ["NLP", "Dataset", "NER"],
  upvotes: 45,
  comments: 12,
  content: "Named Entity Recognition (NER) modeli uchun yangi dataset yaratdim. 50,000 ta belgilangan jumla bor. GitHub'da ochiq manba sifatida joyladim. Sizning fikrlaringiz va testlaringizni kutaman. Modelni Python kutubxonasi orqali ishlatish mumkin.",
  commentList: [
    {
      id: "c1",
      author: "Aziza Karimova",
      avatar: "AK",
      date: "2024-01-25",
      content: "Juda ajoyib ish! Dataset qayerda topish mumkin?",
      upvotes: 8
    },
    {
      id: "c2",
      author: "Javohir Tursunov",
      avatar: "JT",
      date: "2024-01-25",
      content: "Men test qildim, natijalar juda yaxshi. F1-score 0.85 atrofida.",
      upvotes: 5
    }
  ]
};

export function DiscussionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const discussion = mockDiscussion;

  return (
    <div className="container px-4 py-8">
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
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {discussion.authorAvatar}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <Link
                      to={`/hamjamiyat/author/${discussion.author}`}
                      className="font-semibold text-foreground hover:text-primary"
                    >
                      {discussion.author}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="h-3 w-3" />
                      <span>{discussion.date}</span>
                    </div>

                    <h1 className="mb-4 text-3xl font-bold text-foreground">
                      {discussion.title}
                    </h1>

                    <p className="mb-4 text-foreground leading-relaxed">
                      {discussion.content}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {discussion.tags.map((tag) => (
                        <Link key={tag} to={`/hamjamiyat/tag/${tag}`}>
                          <Badge variant="outline" className="text-xs hover:bg-primary/10 cursor-pointer">
                            #{tag}
                          </Badge>
                        </Link>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                          <ThumbsUp className="h-5 w-5" />
                          <span className="font-medium">{discussion.upvotes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                          <MessageCircle className="h-5 w-5" />
                          <span className="font-medium">{discussion.comments} izoh</span>
                        </button>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Ulashish
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Comments */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-6 text-xl font-bold">
                Izohlar ({discussion.commentList.length})
              </h2>
              <div className="space-y-6">
                {discussion.commentList.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        {comment.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Link
                          to={`/hamjamiyat/author/${comment.author}`}
                          className="font-semibold text-sm hover:text-primary"
                        >
                          {comment.author}
                        </Link>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{comment.date}</span>
                      </div>
                      <p className="mb-2 text-sm text-foreground">{comment.content}</p>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{comment.upvotes}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 border-t pt-6">
                <p className="text-sm text-muted-foreground mb-4">Izoh yozish uchun tizimga kiring</p>
                <Button>Izoh yozish</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold">Muallif</h3>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {discussion.authorAvatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    to={`/hamjamiyat/author/${discussion.author}`}
                    className="font-semibold hover:text-primary"
                  >
                    {discussion.author}
                  </Link>
                  <p className="text-sm text-muted-foreground">AI tadqiqotchisi</p>
                </div>
              </div>
              <Link to={`/hamjamiyat/author/${discussion.author}`}>
                <Button variant="outline" className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  Profilni ko'rish
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <CardContent className="p-6">
              <h3 className="mb-2 font-semibold">Savol Bering</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Jamiyatdan yordam yoki maslahat oling
              </p>
              <Link to="/hamjamiyat/new-discussion">
                <Button className="w-full" variant="default">
                  Yangi Mavzu
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}