import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { AppLayout } from '@/app/components/layout/AppLayout';
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  Database,
  MessageSquare,
  Code,
  Shield,
  Heart,
  Users,
} from 'lucide-react';

const guidelines = [
  {
    title: 'Ma\'lumotlar to\'plami qo\'shish',
    icon: Database,
    description: 'Sifatli ma\'lumotlar to\'plami yaratish bo\'yicha qoidalar',
    rules: [
      {
        type: 'do',
        text: 'Ma\'lumotlar to\'plami uchun aniq va izohli nom bering',
      },
      {
        type: 'do',
        text: 'README faylida to\'pliq tavsif va foydalanish ko\'rsatmalari qo\'shing',
      },
      {
        type: 'do',
        text: 'Ma\'lumotlarni tegishli kategoriya va teglar bilan belgilang',
      },
      {
        type: 'dont',
        text: 'Mualliflik huquqi buzilgan yoki noaniq manba ma\'lumotlarini yuklamang',
      },
      {
        type: 'dont',
        text: 'Shaxsiy ma\'lumotlar yoki maxfiy ma\'lumotlarni oshkor qilmang',
      },
    ],
  },
  {
    title: 'Maqola yozish',
    icon: FileText,
    description: 'Ilmiy va ta\'limiy maqolalar uchun standartlar',
    rules: [
      {
        type: 'do',
        text: 'Maqola sarlavhasi qisqa va tushunarli bo\'lsin',
      },
      {
        type: 'do',
        text: 'Manba va havolalarni to\'liq ko\'rsating',
      },
      {
        type: 'do',
        text: 'Kod misollari va grafiklar qo\'shing',
      },
      {
        type: 'dont',
        text: 'Boshqa mualliflarning ishlarini plagiat qilmang',
      },
      {
        type: 'dont',
        text: 'Tekshirilmagan yoki noto\'g\'ri ma\'lumotlar bermang',
      },
    ],
  },
  {
    title: 'Forum va muhokamalar',
    icon: MessageSquare,
    description: 'Hamjamiyat muhokamalarida o\'zini tutish qoidalari',
    rules: [
      {
        type: 'do',
        text: 'Savollaringizni aniq va batafsil yozing',
      },
      {
        type: 'do',
        text: 'Boshqalarga hurmat bilan munosabatda bo\'ling',
      },
      {
        type: 'do',
        text: 'Foydali javoblarni "Eng yaxshi javob" deb belgilang',
      },
      {
        type: 'dont',
        text: 'Spam yoki reklama xabarlar yubormang',
      },
      {
        type: 'dont',
        text: 'Haqoratli yoki noo\'rin so\'zlar ishlatmang',
      },
    ],
  },
  {
    title: 'Kod va rivojlantirish',
    icon: Code,
    description: 'Dasturlash va hissa qo\'shish standartlari',
    rules: [
      {
        type: 'do',
        text: 'Kodni tushunarli va izohli yozing',
      },
      {
        type: 'do',
        text: 'Testlar yozing va dokumentatsiya yarating',
      },
      {
        type: 'do',
        text: 'Pull request yaratishdan oldin barcha testlarni o\'tkazing',
      },
      {
        type: 'dont',
        text: 'Boshqa loyihalarning kodini litsenziyasiz nusxalamang',
      },
      {
        type: 'dont',
        text: 'Xavfsizlik zaifliklarini yaratmang',
      },
    ],
  },
];

const communityValues = [
  {
    title: 'Hamkorlik',
    icon: Users,
    description: 'Biz bir-birimizga yordam beramiz va bilim almashish orqali o\'samiz',
  },
  {
    title: 'Ochiqlik',
    icon: Heart,
    description: 'Barcha materiallar ochiq va barchaga erkin foydalanish uchun',
  },
  {
    title: 'Sifat',
    icon: CheckCircle2,
    description: 'Yuqori sifatli ma\'lumotlar va resurslar yaratishga intilamiz',
  },
  {
    title: 'Xavfsizlik',
    icon: Shield,
    description: 'Foydalanuvchilar xavfsizligi va maxfiyligi bizning ustuvor vazifamiz',
  },
];

export function GuidelinesPage() {
  return (
    <AppLayout pageTitle="Hamjamiyat ko'rsatmalari">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Introduction */}
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Hamjamiyat ko'rsatmalari</h2>
            <p className="text-lg text-muted-foreground">
              Lisoniy platformasida faoliyat yuritish uchun qoidalar va ko'rsatmalar
            </p>
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6">
              <p className="text-sm">
                <strong>Maqsad:</strong> Lisoniy - bu o'zbek tili va lingvistikasi uchun ochiq,
                hamkorlikka asoslangan platforma. Biz yuqori sifatli resurslar yaratish va
                bilim almashish orqali o'zbek tilini rivojlantirishga yordam beramiz.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Community Values */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Asosiy qadriyatlar</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {communityValues.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{value.title}</h4>
                        <p className="text-sm text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Guidelines */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Qoidalar va ko'rsatmalar</h3>
          {guidelines.map((guideline) => {
            const Icon = guideline.icon;
            return (
              <Card key={guideline.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>{guideline.title}</CardTitle>
                      <CardDescription>{guideline.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {guideline.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {rule.type === 'do' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm flex-1">{rule.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Reporting */}
        <Card>
          <CardHeader>
            <CardTitle>Muammolar haqida xabar berish</CardTitle>
            <CardDescription>
              Agar siz qoidabuzarlik yoki muammo ko'rsangiz, bizga xabar bering
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Quyidagi holatlar haqida darhol xabar bering:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>Haqoratli yoki noo'rin xabarlar</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>Spam yoki reklama</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>Mualliflik huquqi buzilishi</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>Xavfsizlik zaifliklarixavfsizlik zaifliklar</span>
              </li>
            </ul>
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Muammo haqida xabar berish
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout >
  );
}
