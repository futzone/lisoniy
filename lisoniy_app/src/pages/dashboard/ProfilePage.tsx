import { useState, useEffect, useRef } from 'react';
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
  Twitter,
  Linkedin,
  Award,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  Trophy,
  FileText,
  Code,
  Database,
  Link as LinkIcon,
  GraduationCap,
  Edit,
  Loader2,
  Camera
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { userApi, UserMetaResponse, UserMetaUpdate } from '@/api/userApi';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { toast } from 'sonner';
import { AchievementsCard } from './components/AchievementsCard';

export function ProfilePage() {
  const { user } = useAuthStore();
  const [meta, setMeta] = useState<UserMetaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState<UserMetaUpdate>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMeta();
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", file.name, file.type, file.size);

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Fayl hajmi 5MB dan oshmasligi kerak");
      return;
    }

    try {
      // Optimistic or loading state could be added here
      const toastId = toast.loading("Avatar yuklanmoqda...");
      const updatedMeta = await userApi.uploadAvatar(file);
      console.log("Upload response:", updatedMeta);

      setMeta(updatedMeta);
      // Update form data too so if they edit profile, it shows new url
      setFormData(prev => ({ ...prev, avatar_image: updatedMeta.avatar_image }));
      toast.dismiss(toastId);
      toast.success("Avatar muvaffaqiyatli yangilandi");
    } catch (error) {
      console.error("Avatar upload failed:", error);
      toast.error("Avatar yuklashda xatolik yuz berdi");
    } finally {
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const fetchMeta = async () => {
    try {
      setLoading(true);
      const data = await userApi.getMyMeta();
      setMeta(data);
      setFormData({
        nickname: data.nickname,
        address: data.address,
        github_url: data.github,
        telegram_url: data.telegram,
        website_url: data.website,
        education: data.education,
        bio: data.bio,
        avatar_image: data.avatar_image
      });
    } catch (error) {
      console.error("Failed to fetch profile meta:", error);
      toast.error("Profil ma'lumotlarini yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const updated = await userApi.updateMyMeta(formData);
      setMeta(updated);
      setEditOpen(false);
      toast.success("Profil muvaffaqiyatli yangilandi");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Profilni yangilashda xatolik yuz berdi");
    } finally {
      setSaving(false);
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
      <AppLayout pageTitle="Mening profilim">
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout pageTitle="Mening profilim">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick} title="Avatarni o'zgartirish">
                <Avatar className="h-24 w-24 border-4 border-background shadow-sm transition-opacity group-hover:opacity-90">
                  <AvatarImage
                    src={meta?.avatar_image ? (meta.avatar_image.startsWith('http') ? meta.avatar_image : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace('/api/v1', '')}${meta.avatar_image}`) : undefined}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {user?.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      {meta?.user?.full_name || user?.name || meta?.nickname || 'Foydalanuvchi'}
                      {meta?.nickname && <span className="text-base font-normal text-muted-foreground">(@{meta.nickname})</span>}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">{meta?.bio || "Bio ma'lumoti kiritilmagan"}</p>
                  </div>
                  <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Tahrirlash
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Profilni tahrirlash</DialogTitle>
                        <DialogDescription>
                          O'z shaxsiy ma'lumotlaringizni o'zgartiring. Saqlash tugmasini bosishni unutmang.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="nickname" className="text-right">Nickname</Label>
                          <Input id="nickname" value={formData.nickname || ''} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="bio" className="text-right">Bio</Label>
                          <Textarea id="bio" value={formData.bio || ''} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="education" className="text-right">Ta'lim</Label>
                          <Input id="education" value={formData.education || ''} onChange={(e) => setFormData({ ...formData, education: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="address" className="text-right">Manzil</Label>
                          <Input id="address" value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="website" className="text-right">Veb-sayt</Label>
                          <Input id="website" value={formData.website_url || ''} onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="github" className="text-right">GitHub</Label>
                          <Input id="github" value={formData.github_url || ''} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="telegram" className="text-right">Telegram</Label>
                          <Input id="telegram" value={formData.telegram_url || ''} onChange={(e) => setFormData({ ...formData, telegram_url: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="avatar" className="text-right">Avatar URL</Label>
                          <Input id="avatar" value={formData.avatar_image || ''} onChange={(e) => setFormData({ ...formData, avatar_image: e.target.value })} className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleUpdate} disabled={saving}>
                          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Saqlash
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user?.email || 'user@example.com'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Qo'shildi: {formatDate(meta?.joined)}
                  </div>
                  {meta?.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {meta.address}
                    </div>
                  )}
                  {meta?.education && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      {meta.education}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  {meta?.github && (
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href={meta.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {meta?.telegram && (
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href={meta.telegram} target="_blank" rel="noopener noreferrer">
                        <MessageSquare className="h-4 w-4" />
                        Telegram
                      </a>
                    </Button>
                  )}
                  {meta?.website && (
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
                  <div className="text-2xl font-bold">{meta?.ball || 0}</div>
                  <div className="text-xs text-muted-foreground">Jami ball</div>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-0">
                  #{meta?.rank || '-'} Reyting
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {userStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
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

        {/* Tabs */}
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats">Statistika</TabsTrigger>
            <TabsTrigger value="achievements">Ma'lumotlar</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Jami ko'rsatkichlar</CardTitle>
                  <CardDescription>Barcha vaqt</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Jami hissalar (Entries)</span>
                    <span className="font-semibold">{meta?.entries || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Yaratilgan To'plamlar</span>
                    <span className="font-semibold">{meta?.datasets || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Yozilgan Maqolalar</span>
                    <span className="font-semibold">{meta?.articles || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Boshlangan Muhokamalar</span>
                    <span className="font-semibold">{meta?.discussions || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ballar hisobi</CardTitle>
                  <CardDescription>Qanday to'plangan?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Ma'lumotlar (+5):</span>
                    <span className="font-medium text-right">{(meta?.entries || 0) * 5} ball</span>

                    <span className="text-muted-foreground">Terminlar (+5):</span>
                    <span className="font-medium text-right">{(meta?.terms || 0) * 5} ball</span>

                    <span className="text-muted-foreground">Yulduzlar (+10):</span>
                    <span className="font-medium text-right">{(meta?.stars || 0) * 10} ball</span>

                    <span className="text-muted-foreground">Layklar (+3):</span>
                    <span className="font-medium text-right">{(meta?.likes || 0) * 3} ball</span>

                    <span className="text-muted-foreground">Bonuslar (100+/200+):</span>
                    <span className="font-medium text-right">{meta?.bonus || 0} ball</span>
                  </div>
                  <div className="pt-2 border-t mt-2 flex justify-between font-bold">
                    <span>Jami</span>
                    <span>{meta?.ball || 0} ball</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <div className="h-full">
              <AchievementsCard ball={meta?.ball || 0} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
