import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { AppLayout } from '@/app/components/layout/AppLayout';
import { Link } from 'react-router-dom';
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  Code,
  Package,
  Heart,
  Users,
  Download,
  BookOpen,
} from 'lucide-react';

const repositories = [
  {
    name: 'lisoniy-platform',
    description: 'Lisoniy platformasi - O\'zbek tili uchun NLP va lingvistika platformasi',
    language: 'TypeScript',
    stars: 1234,
    forks: 89,
    license: 'MIT',
    url: 'https://github.com/lisoniy/platform',
  },
  {
    name: 'uzbek-tokenizer',
    description: 'O\'zbek tili uchun tokenizer - so\'z va gap bo\'laklarga ajratish',
    language: 'Python',
    stars: 567,
    forks: 45,
    license: 'Apache 2.0',
    url: 'https://github.com/lisoniy/uzbek-tokenizer',
  },
  {
    name: 'uzbek-stemmer',
    description: 'O\'zbek tili uchun stemmer - so\'z asoslarini aniqlash',
    language: 'Python',
    stars: 432,
    forks: 34,
    license: 'MIT',
    url: 'https://github.com/lisoniy/uzbek-stemmer',
  },
  {
    name: 'uzbek-transliterator',
    description: 'Lotin va kirill alifbolari o\'rtasida transliteratsiya',
    language: 'JavaScript',
    stars: 789,
    forks: 56,
    license: 'MIT',
    url: 'https://github.com/lisoniy/uzbek-transliterator',
  },
  {
    name: 'uzbek-corpus',
    description: 'O\'zbek tili korpusi - turli manbalardan to\'plangan matnlar',
    language: 'Python',
    stars: 2134,
    forks: 178,
    license: 'CC BY-SA 4.0',
    url: 'https://github.com/lisoniy/uzbek-corpus',
  },
  {
    name: 'uzbek-ner',
    description: 'O\'zbek tili uchun NER (Named Entity Recognition) modeli',
    language: 'Python',
    stars: 456,
    forks: 38,
    license: 'MIT',
    url: 'https://github.com/lisoniy/uzbek-ner',
  },
];

const packages = [
  {
    name: 'lisoniy-py',
    description: 'Python SDK - Lisoniy API bilan ishlash uchun',
    platform: 'PyPI',
    downloads: '12.5K',
    version: 'v1.2.3',
  },
  {
    name: 'lisoniy-js',
    description: 'JavaScript/TypeScript SDK',
    platform: 'npm',
    downloads: '8.9K',
    version: 'v1.1.0',
  },
  {
    name: 'uzbek-nlp',
    description: 'O\'zbek tili uchun NLP kutubxonasi',
    platform: 'PyPI',
    downloads: '25.3K',
    version: 'v2.0.1',
  },
];

export function OpenSourcePage() {
  return (
    <AppLayout pageTitle="Ochiq manba">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Introduction */}
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Ochiq manba loyihalari</h2>
            <p className="text-lg text-muted-foreground">
              Lisoniy platformasi va uning barcha komponentlari ochiq manba hisoblanadi
            </p>
          </div>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Hamkorlikka ochiq</h3>
                  <p className="text-sm text-muted-foreground">
                    Biz ochiq manba tamoyillariga sodiqmiz. Barcha kodlar, ma'lumotlar va modellar
                    bepul va erkin foydalanish uchun ochiq. Siz ham hissa qo'shishingiz mumkin!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Github className="h-8 w-8 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-xs text-muted-foreground">Repozitoriyalar</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">5.6K</div>
                  <div className="text-xs text-muted-foreground">GitHub Stars</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">234</div>
                  <div className="text-xs text-muted-foreground">Contributors</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Download className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-xs text-muted-foreground">Downloads</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Repositories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Repozitoriyalar</h3>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href="https://github.com/lisoniy" target="_blank" rel="noopener noreferrer">
                Barchasini ko'rish
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {repositories.map((repo) => (
              <Card key={repo.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <Code className="h-5 w-5" />
                        {repo.name}
                      </CardTitle>
                      <CardDescription>{repo.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">{repo.language}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{repo.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4 text-muted-foreground" />
                      <span>{repo.forks}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {repo.license}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                    <a href={repo.url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      GitHub'da ochish
                      <ExternalLink className="h-4 w-4 ml-auto" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Packages */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Paketlar va SDK</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {packages.map((pkg) => (
              <Card key={pkg.name}>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-purple-500" />
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform:</span>
                    <Badge variant="secondary">{pkg.platform}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Version:</span>
                    <Badge variant="outline">{pkg.version}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Downloads:</span>
                    <span className="font-medium">{pkg.downloads}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contributing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-500" />
              Hissa qo'shish
            </CardTitle>
            <CardDescription>
              Loyihalarga hissa qo'shish orqali o'zbek tilini rivojlantirishga yordam bering
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Repository'ni fork qiling</h4>
                  <p className="text-sm text-muted-foreground">
                    GitHub'da loyihani fork qilib, o'z nusxangizni yarating
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">O'zgarishlar kiriting</h4>
                  <p className="text-sm text-muted-foreground">
                    Kodni yaxshilang, xatolarni tuzating yoki yangi funksiya qo'shing
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Pull request yuboring</h4>
                  <p className="text-sm text-muted-foreground">
                    O'zgarishlaringizni tasvirlab, pull request yarating
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="gap-2" asChild>
                <a href="https://github.com/lisoniy" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  GitHub'da boshla
                </a>
              </Button>
              <Button variant="outline" className="gap-2" asChild>
                <Link to="/docs/guidelines">
                  <BookOpen className="h-4 w-4" />
                  Ko'rsatmalar
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
