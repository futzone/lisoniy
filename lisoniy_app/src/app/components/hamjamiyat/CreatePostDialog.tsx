import { useState } from 'react';
import MDEditor from "@uiw/react-md-editor";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';
import { apiClient } from '@/api/apiClient';
import { PlusCircle, Loader2, X } from 'lucide-react';
// import { toast } from 'sonner'; // Ensure sonner is installed/configured, or use a basic alert for now if unsure

interface CreatePostDialogProps {
    onPostCreated?: () => void;
}

export function CreatePostDialog({ onPostCreated }: CreatePostDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        body: '',
        type: 'discussion', // Default
        tags: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('body', formData.body);
            data.append('type', formData.type);
            data.append('tags', formData.tags);

            files.forEach((file) => {
                data.append('files', file);
            });

            await apiClient.request('/api/v1/posts/', {
                method: 'POST',
                body: data,
            });

            // Reset form
            setFormData({
                title: '',
                body: '',
                type: 'discussion',
                tags: '',
            });
            setFiles([]);
            setOpen(false);

            if (onPostCreated) {
                onPostCreated();
            }
            // alert("Muvaffaqiyatli yaratildi!"); // Or use toast if available
        } catch (error) {
            console.error('Failed to create post:', error);
            alert("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">
                    <PlusCircle className="h-4 w-4" />
                    Yangi mavzu
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Yangi mavzu yaratish</DialogTitle>
                    <DialogDescription>
                        Jamiyat bilan o'z fikrlaringiz, savollaringiz yoki maqolalaringizni bo'lishing.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Mavzu turi</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Turini tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="discussion">Muhokama / Savol</SelectItem>
                                <SelectItem value="article">Maqola</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Sarlavha</Label>
                        <Input
                            id="title"
                            placeholder="Mavzu sarlavhasi..."
                            required
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Teglar (vergul bilan ajrating)</Label>
                        <Input
                            id="tags"
                            placeholder="nlp, python, savol..."
                            value={formData.tags}
                            onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="body">Mazmun</Label>
                        <div data-color-mode="light" className="dark:hidden">
                            <MDEditor
                                value={formData.body}
                                onChange={(val) => setFormData(prev => ({ ...prev, body: val || "" }))}
                                height={300}
                                preview="edit"
                                textareaProps={{
                                    placeholder: "Batafsil ma'lumot (Markdown formatida)..."
                                }}
                            />
                        </div>
                        <div data-color-mode="dark" className="hidden dark:block">
                            <MDEditor
                                value={formData.body}
                                onChange={(val) => setFormData(prev => ({ ...prev, body: val || "" }))}
                                height={300}
                                preview="edit"
                                textareaProps={{
                                    placeholder: "Batafsil ma'lumot (Markdown formatida)..."
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="files">Fayllar (ixtiyoriy)</Label>
                        <div className="flex flex-col gap-2">
                            <Input
                                id="files"
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="cursor-pointer"
                            />
                            {files.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {files.map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                                            <span className="truncate max-w-[150px]">{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(idx)}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Chop etish
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
