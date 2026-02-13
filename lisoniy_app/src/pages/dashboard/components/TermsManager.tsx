import { useState, useEffect } from "react";
import { terminologyApi, type Category, type Term, type TermCreate, type TermUpdate } from "@/api/terminologyApi";
import { formatDateTime } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/app/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export function TermsManager() {
    const { accessToken } = useAuthStore();
    const [categories, setCategories] = useState<Category[]>([]);
    const [terms, setTerms] = useState<Term[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Pagination & Filter State
    const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("");
    const [offset, setOffset] = useState(0);
    const [limit] = useState(20);
    const [total, setTotal] = useState(0);

    // Dialog & Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingTerm, setEditingTerm] = useState<Term | null>(null);

    // Form Data
    const [formData, setFormData] = useState({
        keyword: "",
        categoryId: "",
        // We'll manage definitions as simple fields for now (UZ, EN, RU)
        // Could be dynamic, but fixed fields are easier for MVP
        defUz: "",
        defEn: "",
        defRu: "",
        exUz: "",
        exEn: "",
        exRu: ""
    });

    // 1. Fetch Categories for select dropdown and filtering
    const fetchCategories = async () => {
        try {
            const data = await terminologyApi.getCategories();
            setCategories(data);
            if (data.length > 0 && !selectedCategorySlug) {
                setSelectedCategorySlug(data[0].slug); // Default select first category
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // 2. Fetch Terms when category or pagination changes
    const fetchTerms = async () => {
        if (!selectedCategorySlug) return;

        setIsLoading(true);
        try {
            const data = await terminologyApi.getCategoryTerms(selectedCategorySlug, offset, limit);
            setTerms(data.terms);
            setTotal(data.total);
        } catch (error) {
            console.error("Failed to fetch terms:", error);
            // toast.error("Atamalarni yuklashda xatolik");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTerms();
    }, [selectedCategorySlug, offset]);


    const handleOpenDialog = (term?: Term) => {
        if (term) {
            // Edit Mode
            setEditingTerm(term);

            // Extract definitions
            const uz = term.definitions.find(d => d.language === 'uz');
            const en = term.definitions.find(d => d.language === 'en');
            const ru = term.definitions.find(d => d.language === 'ru');

            setFormData({
                keyword: term.keyword,
                categoryId: term.category_id,
                defUz: uz?.text || "",
                exUz: uz?.example || "",
                defEn: en?.text || "",
                exEn: en?.example || "",
                defRu: ru?.text || "",
                exRu: ru?.example || ""
            });
        } else {
            // Create Mode
            setEditingTerm(null);
            // Find category ID from slug
            const currentCat = categories.find(c => c.slug === selectedCategorySlug);

            setFormData({
                keyword: "",
                categoryId: currentCat?.id || "",
                defUz: "", exUz: "",
                defEn: "", exEn: "",
                defRu: "", exRu: ""
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessToken) {
            toast.error("Tizimga kirmagansiz");
            return;
        }

        // Build definitions array
        const definitions = [];
        if (formData.defUz) definitions.push({ language: 'uz', text: formData.defUz, example: formData.exUz });
        if (formData.defEn) definitions.push({ language: 'en', text: formData.defEn, example: formData.exEn });
        if (formData.defRu) definitions.push({ language: 'ru', text: formData.defRu, example: formData.exRu });

        if (definitions.length === 0) {
            toast.error("Kamida bitta ta'rif (uz) kiritilishi shart");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingTerm) {
                // Update (Currently API supports keyword/category update via PATCH)
                // BE NOTE: Providing definitions in update might require a different logic if backend supports it.
                // Looking at schema: TermUpdate only has keyword and category_id. 
                // Definitions are child objects. Usually tricky.
                // For MVP: Let's assume we can only update metadata or we need a new endpoint for FULL update.
                // If backend schema TermUpdate doesn't have definitions, we can't update them simply via PATCH /terms/{id}.
                // We might need to handle definitions separately if the backend requires it.
                // NOTE: The `terminology.py` schema for TermUpdate indeed DOES NOT have definitions.
                // So we can only update Keyword/Category. 
                // For now, let's just update keyword/category.

                await terminologyApi.updateTerm(editingTerm.id, {
                    keyword: formData.keyword,
                    category_id: formData.categoryId
                });

                toast.success("Atama yangilandi (Ta'riflarni o'zgartirish hozircha ishlamaydi)");
            } else {
                // Create
                await terminologyApi.createTerm({
                    keyword: formData.keyword,
                    category_id: formData.categoryId,
                    definitions: definitions
                });
                toast.success("Yangi atama yaratildi");
            }
            setIsDialogOpen(false);
            fetchTerms();
        } catch (error: any) {
            console.error(error);
            toast.error(error.detail || "Amaliyot bajarilmadi");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!accessToken) return;
        try {
            await terminologyApi.deleteTerm(id);
            toast.success("Atama o'chirildi");
            fetchTerms();
        } catch (error: any) {
            toast.error(error.detail || "O'chirishda xatolik");
        }
    };

    // View State
    const [viewTerm, setViewTerm] = useState<Term | null>(null);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle>Atamalar Ro'yxati</CardTitle>
                        <CardDescription>Kategoriyalar bo'yicha atamalar</CardDescription>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Select
                            value={selectedCategorySlug}
                            onValueChange={(val) => {
                                setSelectedCategorySlug(val);
                                setOffset(0); // Reset pagination
                            }}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Kategoriyani tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => handleOpenDialog()} disabled={!selectedCategorySlug}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Qo'shish
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingTerm ? "Atamani Tahrirlash" : "Yangi Atama"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Atama va uning tarjimalarini kiriting.
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="keyword">Atama (Keyword)</Label>
                                            <Input
                                                id="keyword"
                                                value={formData.keyword}
                                                onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Kategoriya</Label>
                                            <Select
                                                value={formData.categoryId}
                                                onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Tanlang" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Definitions Sections */}
                                    <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                                        <h4 className="font-semibold text-sm">O'zbekcha (Majburiy)</h4>
                                        <div className="grid gap-2">
                                            <Label>Ta'rif</Label>
                                            <Textarea
                                                value={formData.defUz}
                                                onChange={(e) => setFormData({ ...formData, defUz: e.target.value })}
                                                placeholder="Atamaning o'zbek tilidagi izohi..."
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Misol</Label>
                                            <Input
                                                value={formData.exUz}
                                                onChange={(e) => setFormData({ ...formData, exUz: e.target.value })}
                                                placeholder="Jumla misoli..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                                        <h4 className="font-semibold text-sm">English (Ixtiyoriy)</h4>
                                        <div className="grid gap-2">
                                            <Label>Definition</Label>
                                            <Textarea
                                                value={formData.defEn}
                                                onChange={(e) => setFormData({ ...formData, defEn: e.target.value })}
                                                placeholder="English definition..."
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Example</Label>
                                            <Input
                                                value={formData.exEn}
                                                onChange={(e) => setFormData({ ...formData, exEn: e.target.value })}
                                                placeholder="Example sentence..."
                                            />
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Bekor qilish</Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Saqlash
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Atama</TableHead>
                                <TableHead>Ta'rif (Uz)</TableHead>
                                <TableHead>Tarjimalar</TableHead>
                                <TableHead className="w-[100px]">Amallar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {terms.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        {isLoading ? "Yuklanmoqda..." : "Bu kategoriyada atamalar yo'q"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                terms.map((term) => {
                                    const defUz = term.definitions.find(d => d.language === 'uz');
                                    const otherLangs = term.definitions.filter(d => d.language !== 'uz').map(d => d.language.toUpperCase()).join(", ");

                                    return (
                                        <TableRow key={term.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setViewTerm(term)}>
                                            <TableCell className="font-medium">{term.keyword}</TableCell>
                                            <TableCell className="max-w-md truncate" title={defUz?.text}>
                                                {defUz?.text || "-"}
                                            </TableCell>
                                            <TableCell>
                                                {otherLangs || <span className="text-muted-foreground text-xs">Yo'q</span>}
                                            </TableCell>
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => setViewTerm(term)}>
                                                        <Search className="h-4 w-4 text-green-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(term)}>
                                                        <Pencil className="h-4 w-4 text-blue-500" />
                                                    </Button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>O'chirish</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    "{term.keyword}" atamasini o'chirib yubormoqchimisiz?
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(term.id)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    O'chirish
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {total > limit && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOffset(Math.max(0, offset - limit))}
                            disabled={offset === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Oldingi
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            {offset + 1}-{Math.min(offset + limit, total)} / {total}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOffset(offset + limit)}
                            disabled={offset + limit >= total}
                        >
                            Keyingi
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardContent>

            {/* View Details Dialog */}
            <Dialog open={!!viewTerm} onOpenChange={(open) => !open && setViewTerm(null)}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            {viewTerm?.keyword}
                        </DialogTitle>
                        <DialogDescription>
                            {viewTerm?.category?.name || "Kategoriya"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Definitions */}
                        {viewTerm?.definitions.map(def => (
                            <div key={def.id} className="space-y-1">
                                <h4 className="font-semibold text-sm uppercase text-muted-foreground">
                                    {def.language === 'uz' ? "O'zbekcha" : def.language === 'en' ? "English" : def.language}
                                </h4>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                    <p className="text-sm leading-relaxed">{def.text}</p>
                                    {def.example && (
                                        <p className="mt-2 text-xs text-muted-foreground italic">
                                            Misol: "{def.example}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Metadata */}
                        <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                                <span className="block font-medium text-foreground">Yaratdi:</span>
                                {viewTerm?.creator?.full_name || viewTerm?.creator?.email || "Noma'lum"}
                            </div>
                            <div>
                                <span className="block font-medium text-foreground">Yaratilgan sana:</span>
                                {viewTerm?.created_at ? formatDateTime(viewTerm.created_at) : "-"}
                            </div>
                            {viewTerm?.updated_at && viewTerm.updated_at !== viewTerm.created_at && (
                                <div className="col-span-2">
                                    <span className="block font-medium text-foreground">So'nggi tahrir:</span>
                                    {formatDateTime(viewTerm.updated_at)}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setViewTerm(null)}>Yopish</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
