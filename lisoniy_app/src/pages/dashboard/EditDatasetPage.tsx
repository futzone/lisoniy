import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import {
    Sparkles,
    ArrowLeft,
    Save,
    Loader2,
    Database,
    Globe,
    Lock,
    FileText,
    Scale
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { datasetApi, DatasetResponse, DatasetMetaResponse } from "@/api/datasetApi";
import { toast } from "sonner";

// License templates
const licenseTemplates: Record<string, string> = {
    "MIT": `MIT License

Copyright (c) ${new Date().getFullYear()} [Dataset Creator Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
    "Apache-2.0": `Apache License 2.0

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.`,
    "CC-BY-4.0": `Creative Commons Attribution 4.0 International (CC BY 4.0)

You are free to:
• Share — copy and redistribute the material in any medium or format
• Adapt — remix, transform, and build upon the material for any purpose

Under the following terms:
• Attribution — You must give appropriate credit`,
    "CC0-1.0": `CC0 1.0 Universal (Public Domain Dedication)

The person who associated a work with this deed has dedicated the work
to the public domain by waiving all of his or her rights to the work worldwide.

You can copy, modify, distribute and perform the work, even for commercial
purposes, all without asking permission.`
};

export function EditDatasetPage() {
    const { datasetId } = useParams();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dataset, setDataset] = useState<DatasetResponse | null>(null);
    const [meta, setMeta] = useState<DatasetMetaResponse | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [readme, setReadme] = useState("");
    const [licenseType, setLicenseType] = useState("");
    const [licenseText, setLicenseText] = useState("");

    // Auto-fill license text when type is selected
    useEffect(() => {
        if (licenseType && licenseType !== "custom" && licenseTemplates[licenseType]) {
            setLicenseText(licenseTemplates[licenseType]);
        }
    }, [licenseType]);

    // Fetch existing data
    useEffect(() => {
        const fetchData = async () => {
            if (!datasetId) return;

            setLoading(true);

            try {
                const datasetData = await datasetApi.getDataset(datasetId);
                setDataset(datasetData);

                // Populate form with existing data
                setName(datasetData.name);
                setDescription(datasetData.description || "");
                setIsPublic(datasetData.is_public);

                // Check if user is owner
                if (user?.id !== datasetData.creator_id) {
                    toast.error("Sizning bu datasetni tahrirlash huquqingiz yo'q");
                    navigate(`/dashboard/dataset/${datasetId}`);
                    return;
                }

                // Fetch metadata
                try {
                    const metaData = await datasetApi.getDatasetMeta(datasetId);
                    setMeta(metaData);
                    setReadme(metaData.readme || "");
                    setLicenseType(metaData.license_type || "");
                    setLicenseText(metaData.license_text || "");
                } catch {
                    console.log("No existing metadata");
                }
            } catch (err) {
                toast.error("Dataset topilmadi");
                navigate(`/dashboard/explore-datasets`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [datasetId, user, navigate]);

    const handleSave = async () => {
        if (!datasetId || !name.trim()) {
            toast.error("Dataset nomi kiritilishi shart");
            return;
        }

        setSaving(true);

        try {
            // Update dataset info
            await datasetApi.updateDataset(datasetId, {
                name: name.trim(),
                description: description.trim() || undefined,
                is_public: isPublic
            });

            // Update metadata
            await datasetApi.updateDatasetMeta(datasetId, {
                readme: readme.trim() || undefined,
                license_type: licenseType || undefined,
                license_text: licenseText.trim() || undefined
            });

            toast.success("Dataset muvaffaqiyatli yangilandi!");
            navigate(`/dashboard/dataset/${datasetId}`);
        } catch (err) {
            toast.error("Xatolik yuz berdi. Qayta urinib ko'ring.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Yuklanmoqda...</p>
                </div>
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
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/dataset/${datasetId}`)}>
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

                        <Button onClick={handleSave} disabled={saving} className="gap-2">
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Saqlash
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Dataset tahrirlash</h1>
                        <p className="text-muted-foreground">
                            Dataset ma'lumotlarini yangilang
                        </p>
                    </div>

                    {/* Basic Info Card */}
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Asosiy ma'lumotlar
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Dataset nomi <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    placeholder="Dataset nomini kiriting"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Tavsif</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                    placeholder="Dataset haqida qisqacha"
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="flex items-center gap-2">
                                        {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                        {isPublic ? "Ochiq dataset" : "Yopiq dataset"}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        {isPublic
                                            ? "Har kim ko'ra oladi va yuklab olishi mumkin"
                                            : "Faqat siz ko'ra olasiz"}
                                    </p>
                                </div>
                                <Switch
                                    checked={isPublic}
                                    onCheckedChange={setIsPublic}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* README Card */}
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                README
                            </CardTitle>
                            <CardDescription>
                                Markdown formatida dataset haqida to'liq ma'lumot
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={readme}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReadme(e.target.value)}
                                placeholder={`# Dataset nomi

## Umumiy ma'lumot
Dataset haqida...

## Ma'lumotlar tuzilishi
- field1: tavsif
- field2: tavsif

## Qanday ishlatish
\`\`\`python
# Kod namunasi
\`\`\``}
                                rows={15}
                                className="font-mono text-sm"
                            />
                        </CardContent>
                    </Card>

                    {/* License Card */}
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scale className="h-5 w-5" />
                                Litsenziya
                            </CardTitle>
                            <CardDescription>
                                Dataset foydalanish shartlari
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Litsenziya turi</Label>
                                <Select value={licenseType} onValueChange={setLicenseType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Litsenziya turini tanlang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MIT">MIT License</SelectItem>
                                        <SelectItem value="Apache-2.0">Apache License 2.0</SelectItem>
                                        <SelectItem value="CC-BY-4.0">CC BY 4.0</SelectItem>
                                        <SelectItem value="CC0-1.0">CC0 (Public Domain)</SelectItem>
                                        <SelectItem value="custom">Boshqa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Litsenziya matni</Label>
                                <Textarea
                                    value={licenseText}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLicenseText(e.target.value)}
                                    placeholder="Litsenziya to'liq matni..."
                                    rows={10}
                                    className="font-mono text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => navigate(`/dashboard/dataset/${datasetId}`)}>
                            Bekor qilish
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="gap-2">
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            O'zgarishlarni saqlash
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
