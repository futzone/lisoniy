import { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Separator } from "@/app/components/ui/separator";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function PrivacyPolicy() {
  const [lang, setLang] = useState<"uz" | "en">("uz");

  return (
    <div className="container px-4 py-12 max-w-5xl mx-auto">
      <Link to="/" className="inline-block mb-6">
        <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
          <ArrowLeft className="h-4 w-4" />
          {lang === "uz" ? "Bosh sahifaga qaytish" : "Back to Home"}
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
            {lang === "uz" ? "Maxfiylik Siyosati" : "Privacy Policy"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {lang === "uz" ? "Lisoniy Platformasi ma'lumotlarni himoya qilish standartlari" : "Data Protection Standards of Lisoniy Platform"}
          </p>
        </div>
        
        <Tabs value={lang} onValueChange={(v) => setLang(v as "uz" | "en")} className="w-[200px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="uz">O'zbek</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
        <CardContent className="p-8 md:p-12 space-y-8 text-lg leading-relaxed">
          {lang === "uz" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <p className="text-sm text-muted-foreground mb-4">Oxirgi yangilanish: 2026-yil 6-fevral</p>
                <p>
                  "Lisoniy" platformasi (keyingi o'rinlarda "Biz" yoki "Platforma") foydalanuvchilarning maxfiyligini 
                  qadrlaydi va himoya qiladi. Ushbu Maxfiylik Siyosati biz sizning ma'lumotlaringizni qanday yig'ishimiz, 
                  ishlatishimiz va himoya qilishimizni belgilaydi. Biz Ochiq Manba (Open Source) tamoyillariga sodiqmiz.
                </p>
              </div>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">1. Ma'lumotlarni Yig'ish</h2>
                <p className="mb-2 text-muted-foreground">Biz quyidagi turdagi ma'lumotlarni yig'amiz:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Shaxsiy Ma'lumotlar:</strong> Ism, email manzili, profil rasmi (OAuth orqali).</li>
                  <li><strong>Texnik Ma'lumotlar:</strong> IP manzil, brauzer turi, qurilma ma'lumotlari va cookie fayllari.</li>
                  <li><strong>Foydalanuvchi Kontenti:</strong> Siz yuklagan datasetlar, maqolalar, izohlar va kodlar.</li>
                  <li><strong>Analitika:</strong> Saytdan foydalanish statistikasi (sahifalar ko'rish soni, vaqt).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Ma'lumotlardan Foydalanish</h2>
                <p className="mb-2 text-muted-foreground">Sizning ma'lumotlaringiz quyidagi maqsadlarda ishlatiladi:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Platforma xizmatlarini taqdim etish va takomillashtirish.</li>
                  <li>Xavfsizlikni ta'minlash va firibgarlikni oldini olish.</li>
                  <li>Siz bilan bog'lanish (yangiliklar, o'zgarishlar haqida xabar berish).</li>
                  <li>Open Source hamjamiyatini rivojlantirish (faqat ochiq ma'lumotlar).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Ochiq Ma'lumotlar va Maxfiylik</h2>
                <p>
                  Lisoniy - bu Ochiq Manba platformasi. Siz yuklagan "Public" datasetlar va kodlar barcha foydalanuvchilar 
                  uchun ochiq bo'ladi. "Private" deb belgilangan ma'lumotlar esa qat'iy himoyalanadi va uchinchi shaxslarga berilmaydi.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Cookie Fayllari va Kuzatuv</h2>
                <p>
                  Biz foydalanuvchi tajribasini yaxshilash uchun Cookie fayllaridan foydalanamiz. Siz brauzer sozlamalari orqali 
                  ularni boshqarishingiz mumkin, ammo bu saytning ba'zi funksiyalariga ta'sir qilishi mumkin.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Ma'lumotlar Xavfsizligi</h2>
                <p>
                  Biz sanoat standartlariga mos shifrlash (SSL/TLS) va xavfsizlik choralarini qo'llaymiz. Biroq, internet orqali 
                  ma'lumot uzatish 100% xavfsiz bo'lishiga kafolat bera olmaymiz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Foydalanuvchi Huquqlari (GDPR/CCPA)</h2>
                <p className="mb-2 text-muted-foreground">Siz quyidagi huquqlarga egasiz:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>O'z ma'lumotlaringizni ko'rish va nusxasini olish.</li>
                  <li>Noto'g'ri ma'lumotlarni tuzatishni talab qilish.</li>
                  <li>Ma'lumotlaringizni to'liq o'chirishni talab qilish ("Unutish huquqi").</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Bog'lanish</h2>
                <p>
                  Maxfiylik bo'yicha savollaringiz bo'lsa, bizning DPO (Data Protection Officer) bilan bog'laning:
                  <br />
                  <a href="mailto:privacy@lisoniy.uz" className="text-primary font-semibold hover:underline mt-2 inline-block">
                    privacy@lisoniy.uz
                  </a>
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <p className="text-sm text-muted-foreground mb-4">Last Updated: February 6, 2026</p>
                <p>
                  Lisoniy Platform (hereinafter "We" or "Platform") values and protects the privacy of its users. 
                  This Privacy Policy outlines how we collect, use, and protect your information. 
                  We are committed to Open Source principles.
                </p>
              </div>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">1. Information Collection</h2>
                <p className="mb-2 text-muted-foreground">We collect the following types of data:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Personal Data:</strong> Name, email address, profile picture (via OAuth).</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device info, and cookies.</li>
                  <li><strong>User Content:</strong> Datasets, articles, comments, and code you upload.</li>
                  <li><strong>Analytics:</strong> Usage statistics (page views, session duration).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Use of Information</h2>
                <p className="mb-2 text-muted-foreground">Your data is used for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Providing and improving Platform services.</li>
                  <li>Ensuring security and preventing fraud.</li>
                  <li>Communicating with you (updates, newsletters).</li>
                  <li>Fostering the Open Source community (public data only).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Open Data & Privacy</h2>
                <p>
                  Lisoniy is an Open Source platform. Datasets and code marked as "Public" will be accessible to all users. 
                  Data marked as "Private" is strictly protected and not shared with third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Cookies & Tracking</h2>
                <p>
                  We use cookies to enhance user experience. You can manage them via your browser settings, 
                  though this may affect some site functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
                <p>
                  We implement industry-standard encryption (SSL/TLS) and security measures. However, we cannot guarantee 
                  100% security for data transmitted over the internet.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. User Rights (GDPR/CCPA)</h2>
                <p className="mb-2 text-muted-foreground">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access and obtain a copy of your data.</li>
                  <li>Request correction of inaccurate data.</li>
                  <li>Request deletion of your data ("Right to be Forgotten").</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Contact</h2>
                <p>
                  For privacy-related inquiries, please contact our Data Protection Officer (DPO):
                  <br />
                  <a href="mailto:privacy@lisoniy.uz" className="text-primary font-semibold hover:underline mt-2 inline-block">
                    privacy@lisoniy.uz
                  </a>
                </p>
              </section>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
