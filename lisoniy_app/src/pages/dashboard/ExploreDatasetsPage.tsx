import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { AppLayout } from "@/app/components/layout/AppLayout";
import {
  Database,
  Search,
  Download,
  Upload,
  Star,
  Filter,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Globe,
  Lock
} from "lucide-react";
import { motion } from "motion/react";
import { datasetApi, DatasetResponse, DatasetListResponse } from "@/api/datasetApi";
import { toast } from "sonner";


const ITEMS_PER_PAGE = 10;

export function ExploreDatasetsPage() {
  const [datasets, setDatasets] = useState<DatasetResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"new" | "top" | "largest" | "mine">("new");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const fetchDatasets = useCallback(async (query?: string, page = 0, filter = activeFilter) => {
    try {
      setLoading(true);
      let response: DatasetListResponse;

      if (query && query.trim()) {
        // Search mode
        response = await datasetApi.searchDatasets(query, undefined, page * ITEMS_PER_PAGE, ITEMS_PER_PAGE, filter === "mine" ? "new" : filter);
      } else if (filter === "mine") {
        // User's private/owned datasets
        response = await datasetApi.getMyDatasets(page * ITEMS_PER_PAGE, ITEMS_PER_PAGE);
      } else {
        // Community/Public datasets with sorting
        response = await datasetApi.getPublicDatasets(page * ITEMS_PER_PAGE, ITEMS_PER_PAGE, undefined, filter);
      }

      setDatasets(response.datasets);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch datasets:", error);
      toast.error("Datasetlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchDatasets(searchQuery, 0, activeFilter);
  }, [activeFilter]);

  const handleFilterChange = (filter: typeof activeFilter) => {
    setActiveFilter(filter);
    setOffset(0);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    // Debounce search
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setOffset(0);
      fetchDatasets(value, 0);
    }, 300);

    setSearchTimeout(timeout);
  };

  const handlePageChange = (newPage: number) => {
    const newOffset = newPage * ITEMS_PER_PAGE;
    setOffset(newOffset);
    fetchDatasets(searchQuery, newPage);
  };

  const formatTimeAgo = (dateString: string) => {
    let date: Date;
    if (dateString.endsWith('Z') || dateString.includes('+') || dateString.includes('-', 10)) {
      date = new Date(dateString);
    } else {
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

    const year = date.getFullYear();
    const day = date.getDate();
    const monthNames = [
      "yanvar", "fevral", "mart", "aprel", "may", "iyun",
      "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"
    ];
    const month = monthNames[date.getMonth()];
    return `${year}-yil, ${day}-${month}`;
  };

  const currentPage = Math.floor(offset / ITEMS_PER_PAGE);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <AppLayout pageTitle="Datasetlarni ko'rish">
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card className="border-2 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Datasetlarni qidirish..."
                    className="pl-10 h-11"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                  />
                </div>
                <Link to="/dashboard/create-dataset">
                  <Button className="h-11 px-6 gap-2">
                    <Upload className="h-4 w-4" />
                    Yangi dataset
                  </Button>
                </Link>
              </div>

              {/* Advanced Filters */}
              <div className="flex flex-wrap items-center gap-2 border-b pb-4">
                <Button
                  variant={activeFilter === "new" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleFilterChange("new")}
                  className="rounded-full px-4"
                >
                  Yangi
                </Button>
                <Button
                  variant={activeFilter === "top" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleFilterChange("top")}
                  className="rounded-full px-4"
                >
                  Top
                </Button>
                <Button
                  variant={activeFilter === "largest" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleFilterChange("largest")}
                  className="rounded-full px-4"
                >
                  Eng katta
                </Button>
                <div className="h-4 w-px bg-border mx-2" />
                <Button
                  variant={activeFilter === "mine" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleFilterChange("mine")}
                  className="rounded-full px-4"
                >
                  Menikilar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Datasets Grid */}
        {!loading && datasets.length > 0 && (
          <>
            <div className="text-sm text-muted-foreground mb-2">
              Jami: {total} ta dataset
            </div>
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {datasets.map((dataset, index) => (
                <motion.div
                  key={dataset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link to={`/dashboard/dataset/${dataset.id}`}>
                    <Card className="border-2 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-lg">{dataset.name}</CardTitle>
                              {dataset.is_public ? (
                                <Globe className="h-4 w-4 text-green-500" />
                              ) : (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <CardDescription>{dataset.description || "Tavsif yo'q"}</CardDescription>
                          </div>
                          <Badge variant="secondary">{dataset.type}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Database className="h-4 w-4" />
                              <span>{dataset.entry_count} ta</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              <span>{dataset.meta?.downloads || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{dataset.meta?.stars || 0}</span>
                            </div>
                          </div>
                          <span>{formatTimeAgo(dataset.updated_at)}</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 gap-2">
                            <Eye className="h-4 w-4" />
                            Ko'rish
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={(e: React.MouseEvent) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `/dashboard/dataset/${dataset.id}/edit`;
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Oldingi
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  {currentPage + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Keyingi
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && datasets.length === 0 && (
          <Card className="border-2">
            <CardContent className="py-12 text-center">
              <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? "Hech narsa topilmadi" : "Datasetlar yo'q"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? "Boshqa qidiruv so'zlarini sinab ko'ring"
                  : "Birinchi datasetingizni yarating"
                }
              </p>
              {!searchQuery && (
                <Link to="/dashboard/create-dataset">
                  <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Yangi dataset yaratish
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>

    </AppLayout>
  );
}