import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Languages,
  ArrowLeftRight,
  Copy,
  RotateCcw,
  MessageSquare
} from "lucide-react";
import { AppLayout } from "@/app/components/layout/AppLayout";
import Transliterator from "lotin-kirill";
import { toast } from "sonner";

export function TransliterationPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [direction, setDirection] = useState<"toLatin" | "toCyrillic">("toLatin");

  const transliterator = new Transliterator();

  // Auto-detect script based on word count
  const detectScript = (text: string): "cyrillic" | "latin" | "unknown" => {
    if (!text.trim()) return "unknown";

    // Split into words
    const words = text.split(/\s+/).filter(word => word.length > 0);

    let cyrillicWordCount = 0;
    let latinWordCount = 0;

    const cyrillicPattern = /[а-яёА-ЯЁ]/;
    const latinPattern = /[a-zA-Z]/;

    // Count words by script
    words.forEach(word => {
      const hasCyrillic = cyrillicPattern.test(word);
      const hasLatin = latinPattern.test(word);

      if (hasCyrillic && !hasLatin) {
        cyrillicWordCount++;
      } else if (hasLatin && !hasCyrillic) {
        latinWordCount++;
      } else if (hasCyrillic && hasLatin) {
        // Mixed word - count towards whichever script appears first
        if (word.search(cyrillicPattern) < word.search(latinPattern)) {
          cyrillicWordCount++;
        } else {
          latinWordCount++;
        }
      }
    });

    // Determine language based on word count
    if (cyrillicWordCount > latinWordCount) return "cyrillic";
    if (latinWordCount > cyrillicWordCount) return "latin";
    if (cyrillicWordCount > 0) return "cyrillic"; // If equal, prefer cyrillic
    return "unknown";
  };

  useEffect(() => {
    if (inputText.trim() === "") {
      setOutputText("");
      return;
    }

    const detectedScript = detectScript(inputText);

    // Auto-switch direction based on detected script
    if (detectedScript === "cyrillic" && direction === "toCyrillic") {
      setDirection("toLatin");
    } else if (detectedScript === "latin" && direction === "toLatin") {
      setDirection("toCyrillic");
    }

    try {
      if (direction === "toLatin") {
        setOutputText(transliterator.textToLatin(inputText));
      } else {
        setOutputText(transliterator.textToCyrillic(inputText));
      }
    } catch (error) {
      console.error("Transliteration error:", error);
      setOutputText("");
    }
  }, [inputText, direction]);

  const handleSwapDirection = () => {
    setDirection(direction === "toLatin" ? "toCyrillic" : "toLatin");
    // Swap input and output
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
  };

  const handleCopy = async () => {
    if (outputText) {
      try {
        await navigator.clipboard.writeText(outputText);
        toast.success("Nusxalandi!");
      } catch (error) {
        toast.error("Nusxalashda xatolik");
      }
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  return (
    <AppLayout pageTitle="Transliteratsiya">
      <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
        {/* Transliteration Interface */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              O'zbek tilida transliteratsiya
            </CardTitle>
            <CardDescription>
              Kirill va Lotin alifbolari o'rtasida matn konvertatsiyasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
              {/* Input Textarea */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">
                    {direction === "toLatin" ? "Кириллча" : "Lotincha"}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {inputText.length} belgi
                  </span>
                </div>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    direction === "toLatin"
                      ? "Кириллча матн киритинг..."
                      : "Lotincha matn kiriting..."
                  }
                  className="min-h-[450px] resize-none text-base"
                />
                <Button onClick={handleClear} variant="outline" size="sm" className="gap-2 w-fit mt-2">
                  <RotateCcw className="h-4 w-4" />
                  Tozalash
                </Button>
              </div>

              {/* Swap Icon Button - Center */}
              <div className="flex items-center justify-center">
                <Button
                  onClick={handleSwapDirection}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                >
                  <ArrowLeftRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Output Textarea */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">
                    {direction === "toLatin" ? "Lotincha" : "Кириллча"}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {outputText.length} belgi
                  </span>
                </div>
                <Textarea
                  value={outputText}
                  readOnly
                  placeholder="Natija bu yerda ko'rinadi..."
                  className="min-h-[450px] resize-none text-base bg-muted/50"
                />
                <Button onClick={handleCopy} variant="outline" size="sm" className="gap-2 w-fit mt-2" disabled={!outputText}>
                  <Copy className="h-4 w-4" />
                  Nusxalash
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-2 bg-muted/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <Languages className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Transliteratsiya haqida</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Bu vosita o'zbek tilida yozilgan matnlarni Kirill va Lotin alifbosi o'rtasida konvertatsiya qiladi.
                  Transliteratsiya real vaqt rejimida amalga oshiriladi.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Yuqori aniqlik bilan ishlaydi</li>
                  <li>• Real vaqt rejimida natija beradi</li>
                  <li>• Katta hajmdagi matnlarni qo'llab-quvvatlaydi</li>
                  <li>• Avtomatik til aniqlash funksiyasi</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Report Card */}
        <Card className="border-2 border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Xatolik bormi?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Agar transliteratsiyada noto'g'ri natija yoki xatolik topsangiz, bizga xabar bering.
                  Sizning xabaringiz vositani yaxshilashga yordam beradi.
                </p>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Xatolik haqida xabar berish
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}