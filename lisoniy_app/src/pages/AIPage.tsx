import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Send, Bot, User, Sparkles, Settings } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const models = [
  { id: "lisoniy-llama-3", name: "Lisoniy-Llama-3", description: "Umumiy maqsadli model" },
  { id: "mistral-uz", name: "Mistral-Uz", description: "Tez va samarali" },
  { id: "gpt-uz-base", name: "GPT-Uz-Base", description: "Asosiy o'zbek modeli" },
  { id: "lisoniy-poet", name: "Lisoniy-Poet", description: "She'r va badiiy matn" }
];

const samplePrompts = [
  "O'zbekiston tarixi haqida qisqacha ma'lumot bering",
  "Alisher Navoiy asarlari haqida gapirib bering",
  "Sun'iy intellekt nima va qanday ishlaydi?",
  "O'zbek tilining o'ziga xos xususiyatlari nimalar?"
];

export function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedModel, setSelectedModel] = useState("lisoniy-llama-3");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI responses
  const mockResponses: Record<string, string> = {
    "default": "Bu demo versiya. Haqiqiy AI javoblarini olish uchun backend integratsiyasi kerak. Lisoniy platformasi o'zbek tili uchun maxsus AI modellarini ishlab chiqmoqda.",
    "tarixi": "O'zbekiston boy tarixga ega. Samarqand, Buxoro va Xiva kabi qadimiy shaharlar buyuk madaniyat va ilm-fan markazlari bo'lgan. Amir Temur davri alohida ahamiyatga ega.",
    "navoiy": "Alisher Navoiy (1441-1501) - o'zbek adabiyotining buyuk namoyandasi. 'Xamsa', 'Mahbub ul-qulub' kabi asarlar yaratgan. Turk tilida adabiyot yaratish mumkinligini isbotlagan.",
    "ai": "Sun'iy intellekt - kompyuter tizimlari insoniy aqlni talab qiluvchi vazifalarni bajarish qobiliyati. Machine learning, deep learning va neural networks asosida ishlaydi.",
    "til": "O'zbek tili turkiy tillar oilasiga mansub. Lotin yozuvi ishlatiladi. Agglutinativ morfologiyaga ega. Boy leksika va grammatik tuzilmaga ega."
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("tarix")) return mockResponses["tarixi"];
    if (lowerMessage.includes("navoiy")) return mockResponses["navoiy"];
    if (lowerMessage.includes("intellekt") || lowerMessage.includes("ai")) return mockResponses["ai"];
    if (lowerMessage.includes("til") || lowerMessage.includes("xususiyat")) return mockResponses["til"];
    
    return mockResponses["default"];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-3 text-4xl font-bold text-foreground">
          Lisoniy AI — O'zbek Til Modellari
        </h1>
        <p className="text-lg text-muted-foreground">
          O'zbek tilida sun'iy intellekt yordamchilari bilan suhbat
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sidebar - Model Selection */}
        <div className="lg:col-span-3">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5" />
                Sozlamalar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Model
                </label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-2 text-xs text-muted-foreground">
                  {models.find(m => m.id === selectedModel)?.description}
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="mb-2 text-sm font-semibold text-foreground">
                  Model Ma'lumotlari
                </h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Parametrlar:</span>
                    <span className="font-semibold text-foreground">7B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Context:</span>
                    <span className="font-semibold text-foreground">4096</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Til:</span>
                    <Badge variant="secondary" className="text-xs">O'zbek</Badge>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setMessages([])}
              >
                Suhbatni Tozalash
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-9">
          <Card className="flex h-[calc(100vh-250px)] flex-col">
            {/* Chat Messages */}
            <CardContent className="flex-1 overflow-y-auto p-6">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-foreground">
                    Lisoniy AI'ga Xush Kelibsiz
                  </h2>
                  <p className="mb-6 text-center text-muted-foreground">
                    O'zbek tilida savollaringizni bering
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {samplePrompts.map((prompt, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="h-auto whitespace-normal p-4 text-left text-sm"
                        onClick={() => handlePromptClick(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Bot className="h-5 w-5" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="mt-2 text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString("uz-UZ", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                      {message.role === "user" && (
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="rounded-lg bg-muted p-4">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </CardContent>

            {/* Input Area */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="O'zbek tilida prompt yozing..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Yuborish
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Enter - yuborish, Shift+Enter - yangi qator
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}