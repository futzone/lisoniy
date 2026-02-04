import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, X, Upload } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { motion } from "motion/react";
import { toast } from "sonner";

export function NewDiscussionPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Sarlavha kiritilishi shart");
      return;
    }
    
    if (!body.trim()) {
      toast.error("Matn kiritilishi shart");
      return;
    }

    // In real app, submit to API
    toast.success("Muhokama muvaffaqiyatli yaratildi!");
    navigate("/hamjamiyat");
  };

  return (
    <div className="container px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Orqaga
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Yangi Muhokama</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Sarlavha *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Muhokama sarlavhasini kiriting..."
                  className="text-lg"
                />
              </div>

              {/* Body with Markdown Editor */}
              <div className="space-y-2">
                <Label>Matn * (Markdown qo'llab-quvvatlanadi)</Label>
                <div data-color-mode="light">
                  <MDEditor
                    value={body}
                    onChange={(val) => setBody(val || "")}
                    height={400}
                    preview="edit"
                    hideToolbar={false}
                    enableScroll={true}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Markdown sintaksisidan foydalanishingiz mumkin
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Teglar</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Teg kiriting va Enter bosing"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Qo'shish
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
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
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="files">Fayllar</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="files"
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    className="cursor-pointer"
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                {files.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {files.length} ta fayl tanlangan
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button type="submit" size="lg">
                  Muhokamani Joylashtirish
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(-1)}
                >
                  Bekor qilish
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preview Card */}
      {body && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Ko'rinish</CardTitle>
            </CardHeader>
            <CardContent>
              <div data-color-mode="light">
                <MDEditor.Markdown source={body} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}