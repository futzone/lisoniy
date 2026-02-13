import { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Separator } from "@/app/components/ui/separator";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function TermsOfService() {
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
            {lang === "uz" ? "Foydalanish Shartlari" : "Terms of Service"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {lang === "uz" ? "Lisoniy Platformasidan foydalanish qoidalari" : "Rules for using the Lisoniy Platform"}
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
                  Ushbu Foydalanish Shartlari ("Shartlar") siz va "Lisoniy" platformasi o'rtasidagi huquqiy kelishuvdir. 
                  Platformaga kirish yoki undan foydalanish orqali siz ushbu shartlarga to'liq rozi bo'lasiz.
                </p>
              </div>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">1. Litsenziya va Huquqlar</h2>
                <p className="mb-2 text-muted-foreground">
                  Lisoniy - Ochiq Manba (Open Source) platformasidir.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Ochiq Kontent:</strong> Platformadagi ochiq datasetlar va kodlar tegishli ochiq litsenziyalar (MIT, Apache 2.0, CC BY 4.0) ostida tarqatiladi.</li>
                  <li><strong>Sizning Kontentingiz:</strong> Siz yuklagan kontentga egalik huquqi sizda qoladi, lekin bizga uni platformada ko'rsatish va tarqatish huquqini berasiz.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Foydalanish Qoidalari</h2>
                <p>Siz quyidagilarni qilmaslikka majbursiz:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Platforma xavfsizligini buzish yoki buzishga urinish.</li>
                  <li>Noqonuniy, zararli yoki haqoratli kontent yuklash.</li>
                  <li>Boshqa foydalanuvchilarning shaxsiy ma'lumotlarini ruxsatsiz yig'ish.</li>
                  <li>Platforma infratuzilmasiga ortiqcha yuklama (DDoS) berish.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Hisob va Xavfsizlik</h2>
                <p>
                  Siz o'z hisobingiz xavfsizligi uchun javobgarsiz. Parolingizni maxfiy saqlang. Agar hisobingiz buzilganini sezsaniz, 
                  darhol bizga xabar bering.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Javobgarlikni Cheklash</h2>
                <p>
                  Lisoniy platformasi "BORICHA" (AS IS) va "MAVJUD BO'LGANDA" (AS AVAILABLE) taqdim etiladi. 
                  Biz platformaning uzluksiz ishlashiga yoki xatolardan xoli bo'lishiga kafolat bermaymiz. 
                  Ma'lumotlaringiz yo'qolishi uchun biz javobgar emasmiz (muntazam backup qilish tavsiya etiladi).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. O'zgartirishlar va Bekor Qilish</h2>
                <p>
                  Biz ushbu shartlarni istalgan vaqtda o'zgartirish huquqiga egamiz. O'zgarishlar e'lon qilingandan so'ng kuchga kiradi. 
                  Agar siz qoidalarni buzsangiz, biz sizning hisobingizni ogohlantirishsiz bloklashimiz mumkin.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Bog'lanish</h2>
                <p>
                  Yuridik savollar bo'yicha biz bilan bog'laning:
                  <br />
                  <a href="mailto:legal@lisoniy.uz" className="text-primary font-semibold hover:underline mt-2 inline-block">
                    legal@lisoniy.uz
                  </a>
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <p className="text-sm text-muted-foreground mb-4">Last Updated: February 6, 2026</p>
                <p>
                  These Terms of Service ("Terms") constitute a legal agreement between you and the Lisoniy Platform. 
                  By accessing or using the Platform, you agree to be bound by these Terms.
                </p>
              </div>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">1. License and Rights</h2>
                <p className="mb-2 text-muted-foreground">
                  Lisoniy is an Open Source platform.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Open Content:</strong> Public datasets and code are distributed under appropriate open licenses (MIT, Apache 2.0, CC BY 4.0).</li>
                  <li><strong>Your Content:</strong> You retain ownership of content you upload, but grant us a license to display and distribute it on the Platform.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Usage Rules</h2>
                <p>You agree NOT to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Compromise or attempt to compromise the Platform's security.</li>
                  <li>Upload illegal, harmful, or offensive content.</li>
                  <li>Collect other users' personal data without authorization.</li>
                  <li>Overload the Platform infrastructure (DDoS).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Account & Security</h2>
                <p>
                  You are responsible for maintaining the security of your account. Keep your password confidential. 
                  Notify us immediately if you suspect unauthorized access.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Limitation of Liability</h2>
                <p>
                  Lisoniy is provided "AS IS" and "AS AVAILABLE". We do not guarantee uninterrupted or error-free operation. 
                  We are not liable for data loss (regular backups are recommended).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Changes & Termination</h2>
                <p>
                  We reserve the right to modify these Terms at any time. Changes take effect upon posting. 
                  We may terminate or suspend your account without notice if you violate these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Contact</h2>
                <p>
                  For legal inquiries, please contact us at:
                  <br />
                  <a href="mailto:legal@lisoniy.uz" className="text-primary font-semibold hover:underline mt-2 inline-block">
                    legal@lisoniy.uz
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
