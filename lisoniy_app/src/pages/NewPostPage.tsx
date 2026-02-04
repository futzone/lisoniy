import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, X, Upload, FileText } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { motion } from "motion/react";
import { toast } from "sonner";

export function NewPostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Sarlavha kiritilishi shart");
      return;
    }
    
    if (!excerpt.trim()) {
      toast.error("Qisqacha tavsif kiritilishi shart");
      return;
    }
    
    if (!body.trim()) {
      toast.error("Maqola matni kiritilishi shart");
      return;
    }

    if (tags.length === 0) {
      toast.error("Kamida bitta teg qo'shing");
      return;
    }
    
    // Mock submission
    console.log({
      title,
      excerpt,
      body,
      tags,
      coverImage: coverImage?.name
    });
    
    toast.success("Maqola muvaffaqiyatli yuborildi!");
    navigate("/hamjamiyat");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="container px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/hamjamiyat")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Orqaga
        </Button>

        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Yangi Maqola Yozish
          </h1>
          <p className="text-muted-foreground">
            O'z bilimlaringiz va tajribalaringizni hamjamiyat bilan bo'lishing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asosiy Ma'lumotlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Sarlavha *</Label>
                <Input
                  id="title"
                  placeholder="Maqola sarlavhasini kiriting"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Qisqacha Tavsif *</Label>
                <Input
                  id="excerpt"
                  placeholder="Maqolangiz haqida qisqacha ma'lumot"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Bu tavsif maqolalar ro'yxatida ko'rsatiladi
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover">Muqova Rasmi (ixtiyoriy)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("cover")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Rasm Yuklash
                  </Button>
                  {coverImage && (
                    <span className="text-sm text-muted-foreground">
                      {coverImage.name}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maqola Matni *</CardTitle>
            </CardHeader>
            <CardContent>
              <div data-color-mode="light" className="dark:hidden">
                <MDEditor
                  value={body}
                  onChange={(val) => setBody(val || "")}
                  height={500}
                  preview="edit"
                  textareaProps={{
                    placeholder: "Markdown formatida maqola yozing..."
                  }}
                />
              </div>
              <div data-color-mode="dark" className="hidden dark:block">
                <MDEditor
                  value={body}
                  onChange={(val) => setBody(val || "")}
                  height={500}
                  preview="edit"
                  textareaProps={{
                    placeholder: "Markdown formatida maqola yozing..."
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Markdown formatini qo'llab-quvvatlaydi: **qalin**, *italik*, `kod`, va h.k.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teglar *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Teglar qo'shish</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="NLP, Dataset, AI..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button type="button" onClick={handleAddTag}>
                    Qo'shish
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter tugmasini bosib yoki "Qo'shish" tugmasini bosib teg qo'shing
                </p>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1">
              Maqolani E'lon Qilish
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate("/hamjamiyat")}
            >
              Bekor Qilish
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}