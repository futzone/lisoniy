import { useState } from 'react';
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

const leaderboardData = [
  {
    rank: 1,
    name: 'Alisher Navoiy',
    username: '@alisher_n',
    avatar: '',
    points: 12450,
    contributions: 342,
    datasets: 28,
    articles: 45,
    discussions: 89,
    badge: 'Oltin',
    badgeColor: 'from-yellow-500 to-amber-600',
  },
  {
    rank: 2,
    name: 'Zahiriddin Bobur',
    username: '@z_bobur',
    avatar: '',
    points: 10230,
    contributions: 298,
    datasets: 24,
    articles: 38,
    discussions: 76,
    badge: 'Kumush',
    badgeColor: 'from-slate-400 to-slate-500',
  },
  {
    rank: 3,
    name: 'Mirzo Ulug\'bek',
    username: '@ulugbek_m',
    avatar: '',
    points: 9876,
    contributions: 276,
    datasets: 22,
    articles: 34,
    discussions: 68,
    badge: 'Bronza',
    badgeColor: 'from-orange-600 to-amber-700',
  },
  {
    rank: 4,
    name: 'Ahmad Yugnakiy',
    username: '@ahmad_y',
    avatar: '',
    points: 8542,
    contributions: 245,
    datasets: 19,
    articles: 31,
    discussions: 62,
    badge: 'Faol',
    badgeColor: 'from-blue-500 to-cyan-500',
  },
  {
    rank: 5,
    name: 'Yusuf Xos Hojib',
    username: '@yusuf_xh',
    avatar: '',
    points: 7890,
    contributions: 223,
    datasets: 17,
    articles: 28,
    discussions: 54,
    badge: 'Faol',
    badgeColor: 'from-blue-500 to-cyan-500',
  },
];

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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-slate-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-600" />;
    return <span className="text-xl font-bold text-muted-foreground">#{rank}</span>;
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
          {leaderboardData.map((leader) => (
            <Card key={leader.rank} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 flex items-center justify-center">
                    {getRankIcon(leader.rank)}
                  </div>

                  {/* Avatar and Name */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-lg">
                        {leader.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{leader.name}</h3>
                      <p className="text-sm text-muted-foreground">{leader.username}</p>
                    </div>
                    <Badge className={`bg-gradient-to-r ${leader.badgeColor} text-white border-0`}>
                      {leader.badge}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="hidden lg:flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{leader.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Ball</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{leader.datasets}</div>
                      <div className="text-xs text-muted-foreground">Ma'lumotlar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{leader.articles}</div>
                      <div className="text-xs text-muted-foreground">Maqolalar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{leader.discussions}</div>
                      <div className="text-xs text-muted-foreground">Muhokama</div>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="flex lg:hidden items-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">{leader.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Ball</div>
                    </div>
                  </div>

                  {/* View Profile */}
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/dashboard/profile?user=${leader.username}`}>
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
