import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Input } from '@/app/components/ui/input';
import { AppLayout } from "@/app/components/layout/AppLayout";
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  Award,
  Crown,
  Database,
  MessageSquare,
  FileText,
  Code,
  Search,
  ChevronRight,
} from 'lucide-react';

interface LeaderboardUser {
    id: number;
    full_name: string | null;
    nickname: string | null;
    avatar_image: string | null;
    ball: number;
    rank: string | null;
    total_posts: number;
    total_datasets: number;
}

const categories = [
  { id: 'all', label: 'Umumiy', icon: Trophy },
  { id: 'datasets', label: 'Ma\'lumotlar', icon: Database },
  { id: 'articles', label: 'Maqolalar', icon: FileText },
  { id: 'discussions', label: 'Muhokamalar', icon: MessageSquare },
  { id: 'code', label: 'Kod', icon: Code },
];

export function LeaderboardPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.lisoniy.uz';
            const res = await fetch(`${apiUrl}/api/v1/leaderboard/`);
            if (res.ok) {
                const data = await res.json();
                setLeaders(data);
            }
        } catch (error) {
            console.error("Leaderboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    const rank = index + 1;
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-slate-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-600" />;
    return <span className="text-xl font-bold text-muted-foreground">#{rank}</span>;
  };

  const getBadgeColor = (rank: string | null) => {
      switch(rank) {
          case 'Legend': return 'from-yellow-500 to-amber-600';
          case 'Master': return 'from-slate-400 to-slate-500';
          case 'Expert': return 'from-orange-600 to-amber-700';
          default: return 'from-blue-500 to-cyan-500';
      }
  };

  return (
    <AppLayout pageTitle="Yetakchilar">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Yetakchi faollar reytingi</h2>
            <p className="text-muted-foreground">
              Platformaga eng ko'p hissa qo'shgan foydalanuvchilar
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Foydalanuvchi qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                className="gap-2 whitespace-nowrap"
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          {loading ? (
              <div className="text-center py-10">Yuklanmoqda...</div>
          ) : leaders.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">Hozircha ma'lumot yo'q.</div>
          ) : leaders.map((leader, idx) => (
            <Card key={leader.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 flex items-center justify-center">
                    {getRankIcon(idx)}
                  </div>

                  {/* Avatar and Name */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-lg">
                        {(leader.full_name || leader.nickname || "User").split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{leader.full_name || "Foydalanuvchi"}</h3>
                      <p className="text-sm text-muted-foreground">@{leader.nickname || `user${leader.id}`}</p>
                    </div>
                    <Badge className={`bg-gradient-to-r ${getBadgeColor(leader.rank)} text-white border-0`}>
                      {leader.rank || "Newbie"}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="hidden lg:flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{leader.ball.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Ball</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{leader.total_datasets}</div>
                      <div className="text-xs text-muted-foreground">Datasetlar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{leader.total_posts}</div>
                      <div className="text-xs text-muted-foreground">Postlar</div>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="flex lg:hidden items-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">{leader.ball.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Ball</div>
                    </div>
                  </div>

                  {/* View Profile */}
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/dashboard/profile?user=${leader.nickname || leader.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid gap-6 md:grid-cols-3 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Ball tizimi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ma'lumot to'plami</span>
                <span className="font-medium">100 ball</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Maqola</span>
                <span className="font-medium">50 ball</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Muhokama</span>
                <span className="font-medium">10 ball</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" />
                Nishonlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Oltin</span>
                <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-0">
                  10,000+
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Kumush</span>
                <Badge className="bg-gradient-to-r from-slate-400 to-slate-500 text-white border-0">
                  5,000+
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bronza</span>
                <Badge className="bg-gradient-to-r from-orange-600 to-amber-700 text-white border-0">
                  1,000+
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Statistika
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jami foydalanuvchilar</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Faol foydalanuvchilar</span>
                <span className="font-medium">456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ushbu oy</span>
                <span className="font-medium text-green-500">+89</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
