import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Copy, Zap, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function NLPPage() {
  const [translitInput, setTranslitInput] = useState("");
  const [translitOutput, setTranslitOutput] = useState("");
  const [tokenizerInput, setTokenizerInput] = useState("");
  const [tokens, setTokens] = useState<Array<{ text: string; type: string }>>([]);

  // Simple Cyrillic to Latin transliteration map for Uzbek
  const cyrillicToLatin: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo',
    ж: 'j', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
    н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ф: 'f', х: 'x', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch',
    ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya',
    ў: "o'", қ: 'q', ғ: "g'", ҳ: 'h',
    А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Е: 'E', Ё: 'Yo',
    Ж: 'J', З: 'Z', И: 'I', Й: 'Y', К: 'K', Л: 'L', М: 'M',
    Н: 'N', О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U',
    Ф: 'F', Х: 'X', Ц: 'Ts', Ч: 'Ch', Ш: 'Sh', Щ: 'Shch',
    Ъ: '', Ы: 'I', Ь: '', Э: 'E', Ю: 'Yu', Я: 'Ya',
    Ў: "O'", Қ: 'Q', Ғ: "G'", Ҳ: 'H'
  };

  const handleTranslit = () => {
    let result = "";
    for (let char of translitInput) {
      result += cyrillicToLatin[char] || char;
    }
    setTranslitOutput(result);
  };

  const handleTokenize = () => {
    // Simple tokenization: split by spaces and punctuation
    const text = tokenizerInput.trim();
    if (!text) {
      setTokens([]);
      return;
    }

    const tokenRegex = /[\p{L}\p{N}]+|[.,!?;:()]/gu;
    const matches = text.match(tokenRegex) || [];
    
    const tokenList = matches.map(token => {
      if (/^[.,!?;:()]$/.test(token)) {
        return { text: token, type: "punctuation" };
      } else if (/^\d+$/.test(token)) {
        return { text: token, type: "number" };
      } else {
        return { text: token, type: "word" };
      }
    });

    setTokens(tokenList);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Nusxalandi!");
  };

  const getTokenColor = (type: string) => {
    switch (type) {
      case "word":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "punctuation":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "number":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-3 text-4xl font-bold text-foreground">
          Lisoniy NLP — Laboratoriya
        </h1>
        <p className="text-lg text-muted-foreground">
          O'zbek tili uchun tabiiy til qayta ishlash vositalari
        </p>
      </div>

      <Tabs defaultValue="translit" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="translit">Transliteratsiya</TabsTrigger>
          <TabsTrigger value="tokenizer">Tokenizatsiya</TabsTrigger>
          <TabsTrigger value="spellcheck">Imlo Tekshiruv</TabsTrigger>
        </TabsList>

        {/* Transliteration Tab */}
        <TabsContent value="translit">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Kirish (Kirill)</CardTitle>
                <CardDescription>
                  Kirill yozuvidagi matnni kiriting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Мисол: Ўзбек тили — туркий тиллар оиласига мансуб тил"
                  className="min-h-[200px] font-mono"
                  value={translitInput}
                  onChange={(e) => setTranslitInput(e.target.value)}
                />
                <Button onClick={handleTranslit} className="w-full gap-2">
                  <Zap className="h-4 w-4" />
                  Transliteratsiya Qilish
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Natija (Lotin)</CardTitle>
                <CardDescription>
                  Lotin yozuviga o'girilgan matn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Natija bu yerda ko'rinadi..."
                  className="min-h-[200px] font-mono"
                  value={translitOutput}
                  readOnly
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(translitOutput)}
                  disabled={!translitOutput}
                  className="w-full gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Nusxalash
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tokenizer Tab */}
        <TabsContent value="tokenizer">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Kirish Matni</CardTitle>
                <CardDescription>
                  Tahlil qilish uchun matn kiriting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Misol: Lisoniy platformasi o'zbek tili uchun mo'ljallangan."
                  className="min-h-[200px]"
                  value={tokenizerInput}
                  onChange={(e) => setTokenizerInput(e.target.value)}
                />
                <Button onClick={handleTokenize} className="w-full gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Tokenizatsiya Qilish
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tokenlar</CardTitle>
                <CardDescription>
                  {tokens.length} ta token topildi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[200px] rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex flex-wrap gap-2">
                    {tokens.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Tokenlar bu yerda ko'rinadi...
                      </p>
                    ) : (
                      tokens.map((token, idx) => (
                        <Badge
                          key={idx}
                          className={getTokenColor(token.type)}
                          variant="outline"
                        >
                          {token.text}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-blue-500" />
                    <span className="text-muted-foreground">So'z</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-green-500" />
                    <span className="text-muted-foreground">Raqam</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-gray-500" />
                    <span className="text-muted-foreground">Tinish belgi</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Spell Check Tab */}
        <TabsContent value="spellcheck">
          <Card>
            <CardHeader>
              <CardTitle>Imlo Tekshirish</CardTitle>
              <CardDescription>
                Bu funksiya ishlab chiqilmoqda. Tez orada chiqadi!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-border">
                <div className="text-center">
                  <Zap className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Tez orada
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Avtomatik imlo tekshiruv va tuzatish vositasi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}