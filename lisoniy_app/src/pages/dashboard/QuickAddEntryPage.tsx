import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
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
    Plus,
    Loader2,
    Database,
    Keyboard,
    Zap,
    CheckCircle2,
    RotateCcw
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { datasetApi, DatasetResponse } from "@/api/datasetApi";
import { toast } from "sonner";

// Language options for parallel corpus
const languageOptions = [
    { value: "uz", label: "O'zbek" },
    { value: "en", label: "Ingliz" },
    { value: "ru", label: "Rus" },
    { value: "tr", label: "Turk" },
    { value: "ar", label: "Arab" },
    { value: "de", label: "Nemis" },
    { value: "fr", label: "Fransuz" },
];

export function QuickAddEntryPage() {
    const { datasetId } = useParams();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dataset, setDataset] = useState<DatasetResponse | null>(null);
    const [entriesAdded, setEntriesAdded] = useState(0);

    // Form fields based on dataset type
    // Parallel corpus
    const [sourceLang, setSourceLang] = useState("uz");
    const [targetLang, setTargetLang] = useState("en");
    const [sourceText, setSourceText] = useState("");
    const [targetText, setTargetText] = useState("");

    // Instruction dataset
    const [instruction, setInstruction] = useState("");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    // Text classification / Sentiment
    const [text, setText] = useState("");
    const [label, setLabel] = useState("");

    // QA
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [context, setContext] = useState("");

    // NER
    const [nerText, setNerText] = useState("");
    const [nerEntities, setNerEntities] = useState<{ text: string; label: string }[]>([]);
    const [currentEntity, setCurrentEntity] = useState("");
    const [currentEntityLabel, setCurrentEntityLabel] = useState("PERSON");

    // Fetch dataset info
    useEffect(() => {
        const fetchData = async () => {
            if (!datasetId) return;

            setLoading(true);

            try {
                const datasetData = await datasetApi.getDataset(datasetId);
                setDataset(datasetData);

                if (user?.id !== datasetData.creator_id) {
                    toast.error("Sizning bu datasetga yozuv qo'shish huquqingiz yo'q");
                    navigate(`/dashboard/dataset/${datasetId}`);
                    return;
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

    const resetForm = useCallback(() => {
        setSourceText("");
        setTargetText("");
        setInstruction("");
        setInput("");
        setOutput("");
        setText("");
        setLabel("");
        setQuestion("");
        setAnswer("");
        setContext("");
        setNerText("");
        setNerEntities([]);
        setCurrentEntity("");
    }, []);

    const buildContent = useCallback(() => {
        if (!dataset) return null;

        const type = dataset.type.toLowerCase();

        if (type === "parallel" || type === "parallel_corpus") {
            if (!sourceText.trim() || !targetText.trim()) return null;
            return {
                source_lang: sourceLang,
                target_lang: targetLang,
                source_text: sourceText.trim(),
                target_text: targetText.trim()
            };
        }

        if (type === "instruction") {
            if (!instruction.trim() || !output.trim()) return null;
            return {
                instruction: instruction.trim(),
                input: input.trim() || "",
                output: output.trim()
            };
        }

        if (type === "classification" || type === "sentiment") {
            if (!text.trim() || !label.trim()) return null;
            return {
                text: text.trim(),
                label: label.trim()
            };
        }

        if (type === "qa" || type === "question_answering") {
            if (!question.trim() || !answer.trim()) return null;
            return {
                question: question.trim(),
                answer: answer.trim(),
                context: context.trim() || ""
            };
        }

        if (type === "ner") {
            if (!nerText.trim() || nerEntities.length === 0) return null;
            return {
                text: nerText.trim(),
                entities: nerEntities.map(e => ({
                    text: e.text,
                    label: e.label
                }))
            };
        }

        // Generic JSON
        return null;
    }, [dataset, sourceLang, targetLang, sourceText, targetText, instruction, input, output, text, label, question, answer, context, nerText, nerEntities]);

    const handleSubmit = async () => {
        if (!datasetId) return;

        const content = buildContent();
        if (!content) {
            toast.error("Majburiy maydonlarni to'ldiring");
            return;
        }

        setSaving(true);

        try {
            await datasetApi.createDataEntry({
                dataset_id: datasetId,
                content
            });

            setEntriesAdded(prev => prev + 1);
            toast.success("Yozuv muvaffaqiyatli qo'shildi!");
            resetForm();

            // Focus first input
            const firstInput = document.querySelector('input, textarea') as HTMLElement;
            firstInput?.focus();
        } catch (err) {
            toast.error("Xatolik yuz berdi");
        } finally {
            setSaving(false);
        }
    };

    // Keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "Enter" && !saving) {
                e.preventDefault();
                handleSubmit();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [saving, handleSubmit]);

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

    const renderFormByType = () => {
        if (!dataset) return null;

        const type = dataset.type.toLowerCase();

        // Parallel Corpus
        if (type === "parallel" || type === "parallel_corpus") {
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Manba tili</Label>
                            <Select value={sourceLang} onValueChange={setSourceLang}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {languageOptions.map(lang => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Maqsad tili</Label>
                            <Select value={targetLang} onValueChange={setTargetLang}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {languageOptions.map(lang => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Manba matn <span className="text-red-500">*</span></Label>
                        <Textarea
                            value={sourceText}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSourceText(e.target.value)}
                            placeholder="Manba tildagi matnni kiriting..."
                            rows={4}
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Tarjima <span className="text-red-500">*</span></Label>
                        <Textarea
                            value={targetText}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTargetText(e.target.value)}
                            placeholder="Tarjimani kiriting..."
                            rows={4}
                        />
                    </div>
                </div>
            );
        }

        // Instruction
        if (type === "instruction") {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Ko'rsatma (Instruction) <span className="text-red-500">*</span></Label>
                        <Textarea
                            value={instruction}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInstruction(e.target.value)}
                            placeholder="Foydalanuvchi ko'rsatmasini kiriting..."
                            rows={3}
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Kirish (Input)</Label>
                        <Textarea
                            value={input}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                            placeholder="Qo'shimcha kontekst (ixtiyoriy)..."
                            rows={2}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Chiqish (Output) <span className="text-red-500">*</span></Label>
                        <Textarea
                            value={output}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOutput(e.target.value)}
                            placeholder="Kutilgan javobni kiriting..."
                            rows={4}
                        />
                    </div>
                </div>
            );
        }

        // Classification / Sentiment
        if (type === "classification" || type === "sentiment") {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Matn <span className="text-red-500">*</span></Label>
                        <Textarea
                            value={text}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                            placeholder="Klassifikatsiya qilinadigan matnni kiriting..."
                            rows={4}
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Kategoriya <span className="text-red-500">*</span></Label>
                        <Input
                            value={label}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
                            placeholder="Masalan: positive, negative, sport, siyosat..."
                        />
                    </div>
                </div>
            );
        }

        // QA
        if (type === "qa" || type === "question_answering") {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Savol <span className="text-red-500">*</span></Label>
                        <Textarea
                            value={question}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
                            placeholder="Savolni kiriting..."
                            rows={2}
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Kontekst</Label>
                        <Textarea
                            value={context}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContext(e.target.value)}
                            placeholder="Javob topiladigan matn (ixtiyoriy)..."
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Javob <span className="text-red-500">*</span></Label>
                        <Textarea
                            value={answer}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswer(e.target.value)}
                            placeholder="Javobni kiriting..."
                            rows={3}
                        />
                    </div>
                </div>
            );
        }

        // NER
        if (type === "ner") {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Matn <span className="text-red-500">*</span></Label>
                        <Textarea
                            value={nerText}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNerText(e.target.value)}
                            placeholder="Entity belgilash uchun matn kiriting..."
                            rows={4}
                            autoFocus
                        />
                    </div>

                    {/* Entity tagging */}
                    <div className="space-y-2">
                        <Label>Entitylarni qo'shish</Label>
                        <div className="flex gap-2">
                            <Input
                                value={currentEntity}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentEntity(e.target.value)}
                                placeholder="Entity matni..."
                                className="flex-1"
                            />
                            <Select value={currentEntityLabel} onValueChange={setCurrentEntityLabel}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PERSON">Shaxs</SelectItem>
                                    <SelectItem value="LOC">Joy</SelectItem>
                                    <SelectItem value="ORG">Tashkilot</SelectItem>
                                    <SelectItem value="DATE">Sana</SelectItem>
                                    <SelectItem value="TIME">Vaqt</SelectItem>
                                    <SelectItem value="MONEY">Pul</SelectItem>
                                    <SelectItem value="PERCENT">Foiz</SelectItem>
                                    <SelectItem value="OTHER">Boshqa</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (currentEntity.trim()) {
                                        setNerEntities([...nerEntities, { text: currentEntity.trim(), label: currentEntityLabel }]);
                                        setCurrentEntity("");
                                    }
                                }}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Entity list */}
                    {nerEntities.length > 0 && (
                        <div className="space-y-2">
                            <Label>Belgilangan entitylar</Label>
                            <div className="flex flex-wrap gap-2">
                                {nerEntities.map((ent, idx) => (
                                    <Badge key={idx} variant="secondary" className="gap-1">
                                        {ent.text} ({ent.label})
                                        <button
                                            type="button"
                                            className="ml-1 text-red-500 hover:text-red-700"
                                            onClick={() => setNerEntities(nerEntities.filter((_, i) => i !== idx))}
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Fallback - generic
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>Bu dataset turi uchun tez kiritish qo'llab-quvvatlanmaydi</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate(`/dashboard/dataset/${datasetId}`)}>
                    Orqaga qaytish
                </Button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/dataset/${datasetId}`)}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Dataset
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
                            <Badge variant="secondary" className="gap-1">
                                <Keyboard className="h-3 w-3" />
                                Ctrl + Enter
                            </Badge>
                            {entriesAdded > 0 && (
                                <Badge variant="outline" className="gap-1 text-green-600">
                                    <CheckCircle2 className="h-3 w-3" />
                                    {entriesAdded} ta qo'shildi
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="space-y-6">
                    {/* Title */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Zap className="h-6 w-6 text-yellow-500" />
                            <h1 className="text-2xl font-bold">Tez kiritish</h1>
                        </div>
                        <p className="text-muted-foreground">
                            <span className="font-medium">{dataset?.name}</span> datasetiga yozuv qo'shish
                        </p>
                    </div>

                    {/* Form Card */}
                    <Card className="border-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Database className="h-5 w-5" />
                                        Yangi yozuv
                                    </CardTitle>
                                    <CardDescription>
                                        {dataset?.type && getDatasetTypeLabel(dataset.type)} turi uchun ma'lumot kiriting
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary">{dataset?.type && getDatasetTypeLabel(dataset.type)}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {renderFormByType()}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={resetForm}
                        >
                            <RotateCcw className="h-4 w-4" />
                            Tozalash
                        </Button>
                        <Button
                            className="flex-1 gap-2"
                            onClick={handleSubmit}
                            disabled={saving}
                        >
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                            Qo'shish
                        </Button>
                    </div>

                    {/* Stats */}
                    {entriesAdded > 0 && (
                        <Card className="border-dashed">
                            <CardContent className="pt-6 text-center">
                                <p className="text-lg font-medium text-green-600">
                                    Jami {entriesAdded} ta yozuv qo'shildi
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Datasetda hozir: {(dataset?.entry_count || 0) + entriesAdded} ta yozuv
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
