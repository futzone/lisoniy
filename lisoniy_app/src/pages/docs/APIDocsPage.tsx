import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Code,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Shield,
  Terminal,
  Settings,
} from 'lucide-react';
import { AppLayout } from '@/app/components/layout/AppLayout';

export function APIDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    python: `import requests

# API tokenni o'rnatish
API_TOKEN = "your_api_token_here"
headers = {"Authorization": f"Bearer {API_TOKEN}"}

# Transliteratsiya
response = requests.post(
    "https://api.lisoniy.uz/v1/transliterate",
    headers=headers,
    json={
        "text": "Salom dunyo",
        "from": "latin",
        "to": "cyrillic"
    }
)

print(response.json())`,

    javascript: `const API_TOKEN = 'your_api_token_here';

// Transliteratsiya
const response = await fetch('https://api.lisoniy.uz/v1/transliterate', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${API_TOKEN}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Salom dunyo',
    from: 'latin',
    to: 'cyrillic'
  })
});

const data = await response.json();
console.log(data);`,

    curl: `curl -X POST https://api.lisoniy.uz/v1/transliterate \\
  -H "Authorization: Bearer your_api_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Salom dunyo",
    "from": "latin",
    "to": "cyrillic"
  }'`,
  };

  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/v1/transliterate',
      description: 'Matnni lotin yoki kirill alifbosiga transliteratsiya qilish',
      params: ['text', 'from', 'to'],
    },
    {
      method: 'POST',
      endpoint: '/v1/spellcheck',
      description: 'Matndagi imlo xatolarini tekshirish',
      params: ['text', 'language'],
    },
    {
      method: 'POST',
      endpoint: '/v1/ner',
      description: 'Matndagi nomlanmalarni aniqlash (NER)',
      params: ['text', 'model'],
    },
    {
      method: 'GET',
      endpoint: '/v1/datasets',
      description: 'Mavjud ma\'lumotlar to\'plamlarini olish',
      params: ['page', 'limit', 'type'],
    },
    {
      method: 'GET',
      endpoint: '/v1/datasets/:id',
      description: 'Ma\'lumotlar to\'plami tafsilotlarini olish',
      params: ['id'],
    },
  ];

  return (
    <AppLayout pageTitle="API Hujjatlari">
      <div className="mx-auto max-w-5xl p-6 space-y-8">
        {/* Introduction */}
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Lisoniy API</h2>
            <p className="text-lg text-muted-foreground">
              O'zbek tili uchun NLP va til asboblariga RESTful API orqali kirish
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Zap className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Tez</h3>
                    <p className="text-sm text-muted-foreground">{'<'}100ms javob</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <Shield className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Xavfsiz</h3>
                    <p className="text-sm text-muted-foreground">OAuth 2.0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <Terminal className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Oson</h3>
                    <p className="text-sm text-muted-foreground">RESTful</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Authentication */}
        <Card>
          <CardHeader>
            <CardTitle>Autentifikatsiya</CardTitle>
            <CardDescription>
              API dan foydalanish uchun API token kerak. Tokenni sozlamalarda yarating.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Barcha so'rovlarda Authorization header ishlatiladi:
              </p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>Authorization: Bearer your_api_token_here</code>
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard('Authorization: Bearer your_api_token_here', 'auth')}
                >
                  {copiedCode === 'auth' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button className="gap-2" asChild>
              <Link to="/dashboard/settings">
                <Settings className="h-4 w-4" />
                API Token yaratish
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Kod misollari</CardTitle>
            <CardDescription>
              Turli dasturlash tillarida Lisoniy API dan foydalanish
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="python" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="curl">cURL</TabsTrigger>
              </TabsList>
              {Object.entries(codeExamples).map(([lang, code]) => (
                <TabsContent key={lang} value={lang} className="mt-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{code}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(code, lang)}
                    >
                      {copiedCode === lang ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
            <CardDescription>
              Mavjud API endpointlar va ularning parametrlari
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiEndpoints.map((endpoint, index) => (
              <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-3 mb-2">
                  <Badge
                    variant="outline"
                    className={`${endpoint.method === 'POST'
                        ? 'border-blue-500 text-blue-500'
                        : 'border-green-500 text-green-500'
                      }`}
                  >
                    {endpoint.method}
                  </Badge>
                  <div className="flex-1">
                    <code className="text-sm font-mono">{endpoint.endpoint}</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      {endpoint.description}
                    </p>
                  </div>
                </div>
                <div className="ml-16">
                  <p className="text-xs text-muted-foreground mb-1">Parametrlar:</p>
                  <div className="flex gap-2 flex-wrap">
                    {endpoint.params.map((param) => (
                      <Badge key={param} variant="secondary" className="text-xs">
                        {param}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card>
          <CardHeader>
            <CardTitle>So'rovlar cheklovi</CardTitle>
            <CardDescription>
              API so'rovlar soni bo'yicha cheklovlar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bepul foydalanuvchilar</span>
                <Badge>100 so'rov / soat</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pro foydalanuvchilar</span>
                <Badge>1000 so'rov / soat</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Enterprise</span>
                <Badge>Cheklovsiz</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
