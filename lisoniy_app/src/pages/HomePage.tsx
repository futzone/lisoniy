import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Database, Sparkles, MessageSquare, FileText, Zap, Users, Quote, Star, HelpCircle, GitBranch, Code2, Database as DatabaseIcon, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { SEO } from "@/app/components/SEO";
import { generateOrganizationSchema } from "@/lib/seo";
import { useAuthStore } from "@/store/authStore";

export function HomePage() {
  const baseUrl = window.location.origin;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const organizationSchema = generateOrganizationSchema(baseUrl);

  const features = [
    {
      icon: Zap,
      title: "NLP Vositalari",
      description: "Transliteratsiya, tokenizatsiya va morfologik tahlil",
      href: "/nlp",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Database,
      title: "Lisoniy Corpus",
      description: "1M+ jumla, turli janr va manbalar",
      href: "/corpus",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Sparkles,
      title: "AI Modellar",
      description: "O'zbek tili uchun maxsus AI yordamchilari",
      href: "/ai",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: MessageSquare,
      title: "Lisoniy Hub",
      description: "Jamiyat, forum va bilim almashish",
      href: "/hamjamiyat",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: FileText,
      title: "Imlo Tekshiruv",
      description: "Avtomatik xatoliklarni aniqlash va tuzatish",
      href: "/nlp",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Users,
      title: "Hissa Qo'shish",
      description: "Open-source loyiha, jamoaga qo'shiling",
      href: "/hamjamiyat",
      gradient: "from-cyan-500 to-blue-500"
    }
  ];

  const stats = [
    { label: "Jumlalar", value: "1M+" },
    { label: "Ma'lumot", value: "20GB+" },
    { label: "A'zolar", value: "100+" },
    { label: "To'plamlar", value: "20+" }
  ];

  const testimonials = [
    {
      name: "Aziza Karimova",
      role: "Tilshunos, O'zMU",
      avatar: "AK",
      content: "Lisoniy platformasi O'zbek tilini raqamlashtirish sohasida haqiqiy inqilob. Talabalarimga tavsiya qilaman!",
      rating: 5
    },
    {
      name: "Sardor Alimov",
      role: "NLP Developer",
      avatar: "SA",
      content: "API va vositalar juda qulay. O'zbek tiliga oid loyihalarim uchun zarur bo'lgan hamma narsa bir joyda.",
      rating: 5
    },
    {
      name: "Malika Rustamova",
      role: "Tarjimon va yozuvchi",
      avatar: "MR",
      content: "Imlo tekshiruv va transliteratsiya vositalari mening ishimni ancha osonlashtirdi. Rahmat!",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "Lisoniy platformasi bepulmi?",
      answer: "Ha, Lisoniy to'liq bepul va ochiq manba (open-source) platformasidir. Barcha asosiy funksiyalar va vositalar hech qanday to'lovsiz foydalanish uchun mavjud.",
      icon: HelpCircle,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      question: "Qanday qilib hissa qo'shishim mumkin?",
      answer: "Siz GitHub orqali kodga hissa qo'shishingiz, yangi ma'lumotlar to'plamini yuklashingiz, forum orqali savol-javoblarda qatnashishingiz yoki yangi g'oyalar taklif qilishingiz mumkin. Har qanday hissa qadrlashimiz!",
      icon: GitBranch,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      question: "API mavjudmi?",
      answer: "Ha, biz RESTful API taqdim etamiz. Transliteratsiya, tokenizatsiya, NER va boshqa NLP vositalariga dasturiy ta'minot orqali kirish imkoniyati mavjud. Hujjatlar bo'limida batafsil ma'lumot topishingiz mumkin.",
      icon: Code2,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      question: "Ma'lumotlar qayerdan olingan?",
      answer: "Bizning korpusimiz turli manbalardan: adabiy asarlar, yangiliklar, ijtimoiy tarmoqlar, ilmiy maqolalar va boshqa ochiq manbalardan to'plangan. Barcha ma'lumotlar tozalangan va teglar bilan belgilangan.",
      icon: DatabaseIcon,
      gradient: "from-orange-500 to-red-500"
    },
    {
      question: "Maxfiylik va xavfsizlik haqida qanday?",
      answer: "Biz foydalanuvchilar ma'lumotlarini jiddiy qabul qilamiz. Platformada ishlatilgan barcha ma'lumotlar shifrlangan va xavfsiz saqlanadi. Shaxsiy ma'lumotlaringiz hech qachon uchinchi tomonlarga berilmaydi.",
      icon: Lock,
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col">
      <SEO
        title="Lisoniy - O'zbek tilining raqamli kelajagi"
        description="O'zbek tilining raqamli resurslari, NLP vositalari, lingvistik ma'lumotlar va modellar. 1M+ jumla, 20+ ma'lumot to'plamlari, AI modellar va jamiyat."
        keywords={["uzbek nlp", "o'zbek tili", "corpus", "dataset", "ai", "linguistic resources", "transliteration"]}
        image={`${baseUrl}/og-images/default.jpg`}
        url={baseUrl}
        type="website"
        structuredData={organizationSchema}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent dark:from-slate-950/50" />
        <div className="container relative px-4 py-12 sm:py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 sm:mb-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary shadow-lg backdrop-blur-sm">
                <Quote className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="font-mono">Hammasi "Yaral" degan so'zdan boshlangan edi...</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="mb-4 sm:mb-6 pb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-2xl sm:text-4xl font-bold tracking-tight text-transparent md:text-6xl">
                Lisoniy - O'zbek tilining raqamli kelajagi
              </h1>
            </motion.div>
            <motion.p
              className="mb-6 sm:mb-8 text-sm sm:text-lg text-muted-foreground md:text-xl px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              O'zbek tilining raqamli resurslari, NLP vositalari, lingvistik ma'lumotlar va modellar
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link to="/dashboard/learn" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Zap className="h-5 w-5" />
                  Sinab ko'rish
                </Button>
              </Link>
              <Link to="/hamjamiyat" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  <Users className="h-5 w-5" />
                  Hissa qo'shish
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
        {/* Decorative gradient orbs */}
        <div className="absolute -top-24 left-0 h-48 w-48 sm:h-96 sm:w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-0 h-48 w-48 sm:h-96 sm:w-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-card">
        <div className="container px-4 py-8 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  variants={fadeIn}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="mb-1 sm:mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl sm:text-3xl font-bold text-transparent md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container px-4 py-10 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-8 sm:mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-2 sm:mb-4 text-xl sm:text-3xl font-bold text-foreground">
              Modullar va Imkoniyatlar
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground">
              O'zbek tili uchun to'liq raqamli ekotizim
            </p>
          </motion.div>
          <motion.div
            className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeIn}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Link to={feature.href}>
                    <Card className="group h-full overflow-hidden border-2 transition-all hover:shadow-xl hover:border-primary/50">
                      <div className={`h-1 sm:h-2 bg-gradient-to-r ${feature.gradient}`} />
                      <CardHeader className="p-3 sm:p-6">
                        <div className={`mb-2 sm:mb-3 inline-flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}>
                          <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                        </div>
                        <CardTitle className="text-sm sm:text-base">{feature.title}</CardTitle>
                        <CardDescription className="mt-1 sm:mt-2 text-xs sm:text-sm line-clamp-2">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-y border-border bg-muted/30 py-10 sm:py-16 md:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="mb-8 sm:mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-2 sm:mb-4 text-xl sm:text-3xl font-bold text-foreground">
                Foydalanuvchilar Fikri
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground">
                Bizning platformamizdan foydalanayotgan mutaxassislar
              </p>
            </motion.div>
            <motion.div
              className="grid gap-4 sm:gap-6 md:grid-cols-3"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full border-2 transition-all hover:shadow-lg">
                    <CardHeader className="p-4 sm:p-6">
                      <div className="mb-3 sm:mb-4 flex items-center gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-sm sm:text-base">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5 sm:gap-1 mb-2">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <Quote className="mb-2 h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground" />
                      <p className="text-xs sm:text-sm text-muted-foreground italic">
                        {testimonial.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950/50 dark:to-purple-950/50 py-10 sm:py-16 md:py-24">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:20px_20px]" />
        <div className="container relative px-4">
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="mb-8 sm:mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-2 sm:mb-4 text-xl sm:text-3xl font-bold text-foreground">
                Ko'p Beriladigan Savollar
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground">
                Platformamiz haqida tez-tez so'raladigan savollarga javoblar
              </p>
            </motion.div>
            <motion.div
              className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {faqs.map((faq, index) => {
                const Icon = faq.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <Card className="group h-full overflow-hidden border-2 transition-all hover:shadow-2xl hover:border-primary/50">
                      <div className={`h-1 sm:h-2 bg-gradient-to-r ${faq.gradient}`} />
                      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                        <div className="mb-3 sm:mb-4 flex items-start justify-between">
                          <div className={`inline-flex h-8 w-8 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br ${faq.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}>
                            <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                          </div>
                        </div>
                        <CardTitle className="text-sm sm:text-xl leading-tight">
                          {faq.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0">
                        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
        {/* Decorative gradient orbs */}
        <div className="absolute -top-24 right-0 h-48 w-48 sm:h-96 sm:w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-48 w-48 sm:h-96 sm:w-96 rounded-full bg-blue-500/20 blur-3xl" />
      </section>
    </div>
  );
}