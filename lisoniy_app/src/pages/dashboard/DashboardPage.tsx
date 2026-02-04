import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Database,
  MessageSquare,
  FileText,
  Zap,
  Target,
  Loader2,
  Star,
  Code,
  Trophy
} from "lucide-react";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { motion } from "motion/react";
import { userApi, UserMetaResponse, UserActivityResponse } from "@/api/userApi";

export function DashboardPage() {
  const [meta, setMeta] = useState<UserMetaResponse | null>(null);
  const [activity, setActivity] = useState<UserActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [metaData, activityData] = await Promise.all([
          userApi.getMyMeta(),
          userApi.getMyActivity()
        ]);
        setMeta(metaData);
        setActivity(activityData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = [
    { label: "Ma'lumotlar to'plamlari", value: meta?.datasets || 0, icon: Database, color: "from-blue-500 to-cyan-500" },
    { label: "Maqolalar", value: meta?.articles || 0, icon: FileText, color: "from-purple-500 to-pink-500" },
    { label: "Muhokamalar", value: meta?.discussions || 0, icon: MessageSquare, color: "from-orange-500 to-red-500" },
    { label: "Terminlar", value: meta?.terms || 0, icon: Code, color: "from-green-500 to-emerald-500" },
    { label: "Ballar", value: meta?.ball || 0, icon: Star, color: "from-yellow-500 to-amber-500" },
    { label: "Reyting", value: `#${meta?.rank || '-'}`, icon: Trophy, color: "from-rose-500 to-pink-500" },
  ];

  const formatTimeAgo = (dateString: string) => {
    // Ensure the date is parsed as UTC if it doesn't have timezone info
    let date: Date;
    if (dateString.endsWith('Z') || dateString.includes('+') || dateString.includes('-', 10)) {
      // Already has timezone info
      date = new Date(dateString);
    } else {
      // Assume UTC if no timezone
      date = new Date(dateString + 'Z');
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Hozirgina";
    if (diffMins < 60) return `${diffMins} daqiqa oldin`;
    if (diffHours < 24) return `${diffHours} soat oldin`;
    if (diffDays < 7) return `${diffDays} kun oldin`;

    // For older dates, show full local date
    const year = date.getFullYear();
    const day = date.getDate();
    const monthNames = [
      "yanvar", "fevral", "mart", "aprel", "may", "iyun",
      "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"
    ];
    const month = monthNames[date.getMonth()];
    return `${year}-yil, ${day}-${month}`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'dataset': return { icon: Database, bgClass: 'bg-blue-100 dark:bg-blue-950', iconClass: 'text-blue-600' };
      case 'article': return { icon: FileText, bgClass: 'bg-purple-100 dark:bg-purple-950', iconClass: 'text-purple-600' };
      case 'discussion': return { icon: MessageSquare, bgClass: 'bg-orange-100 dark:bg-orange-950', iconClass: 'text-orange-600' };
      case 'term': return { icon: Code, bgClass: 'bg-green-100 dark:bg-green-950', iconClass: 'text-green-600' };
      default: return { icon: Zap, bgClass: 'bg-gray-100 dark:bg-gray-950', iconClass: 'text-gray-600' };
    }
  };

  // Combine all activities into a single sorted list
  const allActivities = [
    ...(activity?.datasets?.map(d => ({ type: 'dataset', title: `Dataset yaratildi: ${d.name}`, timestamp: d.created_at })) || []),
    ...(activity?.articles?.map(a => ({ type: 'article', title: `Maqola yozildi: ${a.title}`, timestamp: a.created_at })) || []),
    ...(activity?.discussions?.map(d => ({ type: 'discussion', title: `Muhokama boshlandi: ${d.title}`, timestamp: d.created_at })) || []),
    ...(activity?.activity_logs?.map(l => ({ type: 'term', title: `${l.action}: ${l.term_keyword}`, timestamp: l.timestamp })) || []),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  if (loading) {
    return (
      <AppLayout pageTitle="Bosh Sahifa">
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="Bosh Sahifa">
      <div className="p-4 lg:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Xush kelibsiz, {meta?.user?.full_name || 'Foydalanuvchi'}! 👋
                </CardTitle>
                <CardDescription className="text-base">
                  Lisoniy platformasiga muvaffaqiyatli kirdingiz. Quyida sizning statistikangiz va tezkor havolalar mavjud.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-2 transition-all hover:shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-2xl font-bold text-transparent`}>
                            {stat.value}
                          </div>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Tezkor Harakatlar</CardTitle>
                <CardDescription>
                  Ko'p ishlatiladigan xususiyatlarga tezkor kirish
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link to="/tools/transliteration">
                  <Button variant="outline" className="h-auto w-full flex-col gap-2 p-6">
                    <Zap className="h-8 w-8 text-blue-500" />
                    <div className="text-center">
                      <div className="font-semibold">NLP Vositalari</div>
                      <div className="text-xs text-muted-foreground">Matn tahlili</div>
                    </div>
                  </Button>
                </Link>

                <Link to="/dashboard/explore-datasets">
                  <Button variant="outline" className="h-auto w-full flex-col gap-2 p-6">
                    <Database className="h-8 w-8 text-green-500" />
                    <div className="text-center">
                      <div className="font-semibold">Datasetlar</div>
                      <div className="text-xs text-muted-foreground">Ma'lumotlar bazasi</div>
                    </div>
                  </Button>
                </Link>

                <Link to="/hamjamiyat?tab=forum">
                  <Button variant="outline" className="h-auto w-full flex-col gap-2 p-6">
                    <MessageSquare className="h-8 w-8 text-orange-500" />
                    <div className="text-center">
                      <div className="font-semibold">Forum</div>
                      <div className="text-xs text-muted-foreground">Muhokama</div>
                    </div>
                  </Button>
                </Link>

                <Link to="/tools/spellchecker">
                  <Button variant="outline" className="h-auto w-full flex-col gap-2 p-6">
                    <FileText className="h-8 w-8 text-pink-500" />
                    <div className="text-center">
                      <div className="font-semibold">Imlo Tekshiruv</div>
                      <div className="text-xs text-muted-foreground">Xatolar topish</div>
                    </div>
                  </Button>
                </Link>

                <Link to="/dashboard/contributions">
                  <Button variant="outline" className="h-auto w-full flex-col gap-2 p-6">
                    <Target className="h-8 w-8 text-cyan-500" />
                    <div className="text-center">
                      <div className="font-semibold">Loyihalar</div>
                      <div className="text-xs text-muted-foreground">Mening ishlarim</div>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>So'nggi Faollik</CardTitle>
                <CardDescription>Sizning oxirgi harakatlaringiz</CardDescription>
              </CardHeader>
              <CardContent>
                {allActivities.length > 0 ? (
                  <div className="space-y-4">
                    {allActivities.map((item, idx) => {
                      const { icon: Icon, bgClass, iconClass } = getActivityIcon(item.type);
                      return (
                        <div key={idx} className="flex items-center gap-4 rounded-lg border p-4">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bgClass}`}>
                            <Icon className={`h-5 w-5 ${iconClass}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{formatTimeAgo(item.timestamp)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Hozircha faollik yo'q. Datasetlar yarating yoki forumda ishtirok eting!
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}