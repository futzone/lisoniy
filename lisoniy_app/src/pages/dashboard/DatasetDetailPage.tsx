import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Database,
  Sparkles,
  ArrowLeft,
  Download,
  Star,
  Calendar,
  Users,
  FileText,
  Eye,
  Plus,
  Loader2,
  Globe,
  Lock,
  Scale,
  Clock,
  User,
  ChevronDown,
  FileJson,
  FileSpreadsheet,
  Edit
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { datasetApi, DatasetResponse, DatasetMetaResponse, DataEntryResponse } from "@/api/datasetApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

export function DatasetDetailPage() {
  const { datasetId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState<DatasetResponse | null>(null);
  const [meta, setMeta] = useState<DatasetMetaResponse | null>(null);
  const [entries, setEntries] = useState<DataEntryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("readme");
  const [isStarred, setIsStarred] = useState(false);
  const [starLoading, setStarLoading] = useState(false);

  // Fetch dataset data
  useEffect(() => {
    const fetchData = async () => {
      if (!datasetId) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch dataset info
        const datasetData = await datasetApi.getDataset(datasetId);
        setDataset(datasetData);

        // Fetch metadata
        try {
          const metaData = await datasetApi.getDatasetMeta(datasetId);
          setMeta(metaData);
        } catch {
          // Meta might not exist yet, that's ok
          console.log("Meta not found, using defaults");
        }

        // Fetch first few entries
        try {
          const entriesData = await datasetApi.getDatasetEntries(datasetId, 0, 5);
          setEntries(entriesData.entries);
        } catch {
          console.log("Could not fetch entries");
        }
        // Check if user has starred this dataset
        const storedUser = localStorage.getItem('auth-storage');
        const hasUser = user || (storedUser && JSON.parse(storedUser)?.state?.user);

        if (hasUser) {
          try {
            const starredData = await datasetApi.isStarred(datasetId);
            setIsStarred(starredData.is_starred);
          } catch (starErr) {
            console.error("Failed to fetch star status:", starErr);
          }
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Dataset topilmadi";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [datasetId, user]);

  const handleToggleStar = async () => {
    if (!datasetId || starLoading) return;

    setStarLoading(true);
    try {
      if (isStarred) {
        await datasetApi.unstarDataset(datasetId);
        setIsStarred(false);
        if (meta) {
          setMeta({ ...meta, stars_count: Math.max(0, (meta.stars_count || 0) - 1) });
        }
      } else {
        await datasetApi.starDataset(datasetId);
        setIsStarred(true);
        if (meta) {
          setMeta({ ...meta, stars_count: (meta.stars_count || 0) + 1 });
        }
      }
    } catch {
      console.error("Failed to toggle star");
    } finally {
      setStarLoading(false);
    }
  };

  const isOwner = user?.id === dataset?.creator_id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}.${month}.${day}, ${hours}:${minutes}`;
  };

  const getDatasetTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      "instruction": "Instruction Dataset",
      "parallel": "Parallel Corpus",
      "parallel_corpus": "Parallel Corpus",
      "ner": "NER Dataset",
      "qa": "QA Dataset",
      "question_answering": "QA Dataset",
      "classification": "Classification",
      "sentiment": "Sentiment Analysis"
    };
    return types[type.toLowerCase()] || type;
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Bugun";
    if (diffDays === 1) return "Kecha";
    if (diffDays < 7) return `${diffDays} kun oldin`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta oldin`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} oy oldin`;
    return `${Math.floor(diffDays / 365)} yil oldin`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Dataset yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Dataset topilmadi</h2>
            <p className="text-muted-foreground mb-4">{error || "Bu dataset mavjud emas yoki o'chirilgan"}</p>
            <Button onClick={() => navigate('/dashboard/explore-datasets')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Orqaga
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/explore-datasets')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Orqaga
              </Button>
              <div className="h-8 border-l border-border" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-bold">Lisoniy</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isOwner && (
                <>
                  <Button variant="outline" className="gap-2" onClick={() => navigate(`/dashboard/dataset/${datasetId}/add`)}>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Yozuv qo'shish</span>
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => navigate(`/dashboard/dataset/${datasetId}/edit`)}>
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline">Tahrirlash</span>
                  </Button>
                </>
              )}
              <Button
                variant={isStarred ? "default" : "outline"}
                className={`gap-2 ${isStarred ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}`}
                onClick={handleToggleStar}
                disabled={starLoading || !user}
              >
                <Star className={`h-4 w-4 ${isStarred ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{isStarred ? 'Yulduzlangan' : 'Yulduz'}</span>
                {meta && meta.stars_count > 0 && <span>{meta.stars_count}</span>}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Yuklab olish</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => {
                      datasetApi.downloadDataset(datasetId as string, 'json');
                      if (meta) setMeta({ ...meta, downloads_count: (meta.downloads_count || 0) + 1 });
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <FileJson className="h-4 w-4 text-blue-500" />
                    JSON formatda
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      datasetApi.downloadDataset(datasetId as string, 'csv');
                      if (meta) setMeta({ ...meta, downloads_count: (meta.downloads_count || 0) + 1 });
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-green-500" />
                    CSV formatda
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <h1 className="text-3xl font-bold">{dataset.name}</h1>
                <Badge variant="secondary" className="text-sm">{getDatasetTypeLabel(dataset.type)}</Badge>
                {dataset.is_public ? (
                  <Badge variant="outline" className="text-sm gap-1">
                    <Globe className="h-3 w-3" />
                    Ochiq
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-sm gap-1">
                    <Lock className="h-3 w-3" />
                    Yopiq
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-lg mb-4">{dataset.description || "Tavsif kiritilmagan"}</p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <Database className="h-4 w-4" />
                  <span>{dataset.entry_count} yozuv</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{meta?.downloads_count || 0} yuklab olish</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{meta?.stars_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{meta?.views_count || 0}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="readme">README</TabsTrigger>
                <TabsTrigger value="entries">Yozuvlar</TabsTrigger>
                <TabsTrigger value="license">Litsenziya</TabsTrigger>
              </TabsList>

              {/* README Tab */}
              <TabsContent value="readme" className="mt-6">
                <Card className="border-2">
                  <CardContent className="pt-6">
                    {meta?.readme ? (
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {meta.readme}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>README hali kiritilmagan</p>
                        {isOwner && (
                          <Button variant="outline" className="mt-4" onClick={() => navigate(`/dashboard/dataset/${datasetId}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            README qo'shish
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Entries Tab */}
              <TabsContent value="entries" className="mt-6">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Yozuvlar</CardTitle>
                        <CardDescription>Datasetdagi ma'lumotlar</CardDescription>
                      </div>
                      {isOwner && (
                        <Button onClick={() => navigate(`/dashboard/dataset/${datasetId}/add`)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Yozuv qo'shish
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {entries.length > 0 ? (
                      <div className="space-y-3">
                        {entries.map((entry) => (
                          <div key={entry.id} className="p-4 rounded-lg border bg-muted/50">
                            <pre className="text-sm overflow-x-auto">
                              {JSON.stringify(entry.content, null, 2)}
                            </pre>
                          </div>
                        ))}
                        {dataset.entry_count > 5 && (
                          <div className="text-center pt-4">
                            <Button variant="outline">
                              Barcha {dataset.entry_count} yozuvni ko'rish
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Hali yozuvlar mavjud emas</p>
                        {isOwner && (
                          <Button className="mt-4" onClick={() => navigate(`/dashboard/dataset/${datasetId}/add`)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Birinchi yozuvni qo'shish
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* License Tab */}
              <TabsContent value="license" className="mt-6">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Litsenziya
                    </CardTitle>
                    {meta?.license_type && (
                      <CardDescription>{meta.license_type}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {meta?.license_text ? (
                      <pre className="text-sm whitespace-pre-wrap font-mono bg-muted p-4 rounded-lg overflow-x-auto">
                        {meta.license_text}
                      </pre>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Litsenziya hali kiritilmagan</p>
                        {isOwner && (
                          <Button variant="outline" className="mt-4" onClick={() => navigate(`/dashboard/dataset/${datasetId}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Litsenziya qo'shish
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Ma'lumotlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hajm</span>
                  <span className="font-semibold">{dataset.entry_count} yozuv</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Turi</span>
                  <Badge variant="secondary">{dataset.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Litsenziya</span>
                  <span className="font-semibold">{meta?.license_type || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Yaratilgan</span>
                  <span className="text-sm">{formatDate(dataset.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Yangilangan</span>
                  <span className="text-sm">{getRelativeTime(dataset.updated_at)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Owner Card */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Muallif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Foydalanuvchi #{dataset.creator_id}</p>
                    <p className="text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatDate(dataset.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}