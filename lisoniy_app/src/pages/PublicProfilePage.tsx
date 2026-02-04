import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { AppLayout } from "@/app/components/layout/AppLayout";
import {
    Mail,
    Calendar,
    MapPin,
    Github,
    MessageSquare,
    Trophy,
    FileText,
    Code,
    Database,
    Link as LinkIcon,
    GraduationCap,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { userApi, UserMetaResponse } from '@/api/userApi';
import { toast } from 'sonner';
import { AchievementsCard } from './dashboard/components/AchievementsCard';

export function PublicProfilePage() {
    const { username } = useParams<{ username: string }>();
    const [meta, setMeta] = useState<UserMetaResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (username) {
            fetchMeta(username);
        }
    }, [username]);

    const fetchMeta = async (uname: string) => {
        try {
            setLoading(true);
            setError(false);
            const data = await userApi.getPublicProfile(uname);
            setMeta(data);
        } catch (err) {
            console.error("Failed to fetch public profile:", err);
            setError(true);
            toast.error("Foydalanuvchi topilmadi yoki xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);

        const year = date.getFullYear();
        const day = date.getDate();
        const monthNames = [
            "yanvar", "fevral", "mart", "aprel", "may", "iyun",
            "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"
        ];
        const month = monthNames[date.getMonth()];

        return `${year}-yil, ${day}-${month}`;
    };

    const userStats = [
        { label: "Ma'lumotlar to'plamlari", value: meta?.datasets || 0, icon: Database, color: 'from-blue-500 to-cyan-500' },
        { label: 'Maqolalar', value: meta?.articles || 0, icon: FileText, color: 'from-purple-500 to-pink-500' },
        { label: 'Muhokamalar', value: meta?.discussions || 0, icon: MessageSquare, color: 'from-orange-500 to-red-500' },
        { label: 'Terminlar', value: meta?.terms || 0, icon: Code, color: 'from-green-500 to-emerald-500' },
    ];

    if (loading) {
        return (
            <div className="container mx-auto py-8 max-w-[600px]">
                <div className="flex h-[50vh] w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        )
    }

    if (error || !meta) {
        return (

            <div className="container mx-auto py-8 max-w-[600px]">
                <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-center">
                    <AlertCircle className="h-16 w-16 text-muted-foreground" />
                    <h2 className="text-2xl font-bold">Foydalanuvchi topilmadi</h2>
                    <p className="text-muted-foreground">Qidirayotgan foydalanuvchi mavjud emas yoki o'chirilgan.</p>
                </div>
            </div>

        )
    }

    return (
        <div className="container mx-auto py-8 max-w-[600px]">
            <div className="space-y-6">
                {/* Profile Header */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                                <AvatarImage
                                    src={meta?.avatar_image ? (meta.avatar_image.startsWith('http') ? meta.avatar_image : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace('/api/v1', '')}${meta.avatar_image}`) : undefined}
                                />
                                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                                    {meta.user.full_name?.[0] || 'U'}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            {meta.user.full_name}
                                            {meta.nickname && <span className="text-base font-normal text-muted-foreground">(@{meta.nickname})</span>}
                                        </h2>
                                        <p className="text-sm text-muted-foreground mt-1">{meta.bio || "Bio ma'lumoti yo'q"}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Qo'shildi: {formatDate(meta.joined)}
                                    </div>
                                    {meta.address && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {meta.address}
                                        </div>
                                    )}
                                    {meta.education && (
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="h-4 w-4" />
                                            {meta.education}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    {meta.github && (
                                        <Button variant="outline" size="sm" className="gap-2" asChild>
                                            <a href={meta.github} target="_blank" rel="noopener noreferrer">
                                                <Github className="h-4 w-4" />
                                                GitHub
                                            </a>
                                        </Button>
                                    )}
                                    {meta.telegram && (
                                        <Button variant="outline" size="sm" className="gap-2" asChild>
                                            <a href={meta.telegram} target="_blank" rel="noopener noreferrer">
                                                <MessageSquare className="h-4 w-4" />
                                                Telegram
                                            </a>
                                        </Button>
                                    )}
                                    {meta.website && (
                                        <Button variant="outline" size="sm" className="gap-2" asChild>
                                            <a href={meta.website} target="_blank" rel="noopener noreferrer">
                                                <LinkIcon className="h-4 w-4" />
                                                Website
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 rounded-lg border-2 border-yellow-200 dark:border-yellow-900 min-w-[140px]">
                                <Trophy className="h-8 w-8 text-yellow-500" />
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{meta.ball}</div>
                                    <div className="text-xs text-muted-foreground">Jami ball</div>
                                </div>
                                <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-0">
                                    #{meta.rank || '-'} Reyting
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    {userStats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.label}>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color}`}>
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">{stat.value}</div>
                                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Statistika Section */}
                <AchievementsCard ball={meta?.ball || 0} />
            </div>
        </div>
    );
}
