import { useState, useEffect } from "react";
import { terminologyApi, type Category, type CategoryCreate, type CategoryUpdate } from "@/api/terminologyApi";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/app/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function CategoriesManager() {
    const { accessToken } = useAuthStore();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit State
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Form State
    const [formData, setFormData] = useState<CategoryCreate>({
        name: "",
        slug: "",
        description: ""
    });

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const data = await terminologyApi.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            toast.error("Kategoriyalarni yuklashda xatolik yuz berdi");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || ""
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: "", slug: "", description: "" });
        }
        setIsDialogOpen(true);
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow lowercase alphanumeric and hyphens
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
        setFormData({ ...formData, slug: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessToken) {
            toast.error("Siz tizimga kirmagansiz");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingCategory) {
                // Update
                const updateData: CategoryUpdate = {
                    name: formData.name,
                    description: formData.description
                };
                await terminologyApi.updateCategory(editingCategory.id, updateData);
                toast.success("Kategoriya yangilandi");
            } else {
                // Create
                await terminologyApi.createCategory(formData);
                toast.success("Yangi kategoriya yaratildi");
            }
            setIsDialogOpen(false);
            fetchCategories();
        } catch (error: any) {
            console.error("Operation failed:", error);
            toast.error(error.detail || "Amaliyot bajarilmadi");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!accessToken) return;

        try {
            await terminologyApi.deleteCategory(id);
            toast.success("Kategoriya o'chirildi");
            fetchCategories();
        } catch (error: any) {
            toast.error(error.detail || "O'chirishda xatolik");
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle>Kategoriyalar</CardTitle>
                    <CardDescription>Atamalar uchun mavzular va yo'nalishlar</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchCategories} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        <span className="sr-only">Yangilash</span>
                    </Button>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => handleOpenDialog()}>
                                <Plus className="mr-2 h-4 w-4" />
                                Yangi Kategoriya
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingCategory ? "Kategoriyani O'zgartirish" : "Yangi Kategoriya Yaratish"}
                                </DialogTitle>
                                <DialogDescription>
                                    Yangi yo'nalish qo'shish yoki mavjudini tahrirlash. Slug unikal bo'lishi shart.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nomi</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const name = e.target.value;
                                            // Auto-generate slug if creating new category
                                            if (!editingCategory) {
                                                const slug = name.toLowerCase()
                                                    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
                                                    .replace(/\s+/g, '-')         // Replace spaces with -
                                                    .replace(/-+/g, '-');         // Remove duplicate -
                                                setFormData({ ...formData, name, slug });
                                            } else {
                                                setFormData({ ...formData, name });
                                            }
                                        }}
                                        placeholder="Masalan: Axborot Texnologiyalari"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="slug">Slug (URL uchun)</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={handleSlugChange}
                                        placeholder="it-texnologiyalar"
                                        disabled={!!editingCategory} // Slug cannot be changed after creation usually
                                        required
                                    />
                                    {editingCategory && <p className="text-xs text-muted-foreground">Slug o'zgartirilmaydi</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Tavsif</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description || ""}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Qisqacha tavsif..."
                                    />
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
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nomi</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Tavsif</TableHead>
                                <TableHead className="w-[100px]">Amallar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        {isLoading ? "Yuklanmoqda..." : "Kategoriyalar topilmadi"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell className="font-mono text-xs">{category.slug}</TableCell>
                                        <TableCell className="max-w-xs truncate" title={category.description}>
                                            {category.description || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(category)}>
                                                    <Pencil className="h-4 w-4 text-blue-500" />
                                                    <span className="sr-only">Tahrirlash</span>
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                            <span className="sr-only">O'chirish</span>
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Ishonchingiz komilmi?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Ushbu kategoriyani o'chirib yubormoqchisiz.
                                                                <br />
                                                                <span className="font-bold text-red-500">DIQQAT:</span> Bu kategoriya ichidagi barcha atamalar ham o'chib ketadi!
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(category.id)}
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
