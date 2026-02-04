import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Target, Lightbulb, Users, BookOpen, Sparkles, Heart, Globe } from "lucide-react";

export function AboutPage() {
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

  const goals = [
    {
      icon: Target,
      title: "Aniq va Ishonchli Ma'lumot",
      description: "Har bir so'z, ibora va tarjima chuqur tahlil qilinadi va bir necha ishonchli manbalar asosida tasdiqlanadi.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Lightbulb,
      title: "Foydalanish Osonligi",
      description: "Eng zamonaviy dizayn va texnologiyalardan foydalangan holda, ma'lumot izlash jarayonini imkon qadar tez va qulay qilishga intilamiz.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Sparkles,
      title: "Ona Tilimiz Rivoji",
      description: "O'zbek tilining boyligini — unutilayotgan so'zlarni qayta kashf etish, yangi atamalarni ommalashtirish va adabiy me'yorlarni saqlash orqali uning rivojiga hissa qo'shish.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const features = [
    {
      icon: Globe,
      title: "Kontekstual Ma'no",
      description: "Biz shunchaki \"so'zma-so'z\" tarjima qilmaymiz. So'zlarning turli vaziyatlardagi ma'no qirralarini, iboralarning asl mohiyatini va qo'llanish o'rinlarini ko'rsatib beramiz.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: BookOpen,
      title: "Boy Til Bazasi",
      description: "Platformamiz nafaqat zamonaviy so'zlarni, balki mumtoz adabiyotimiz durdonalari, xalq maqollari va shevalarga xos iboralarni ham o'z ichiga oladi.",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: Sparkles,
      title: "Doimiy Rivojlanish",
      description: "Biz doimiy izlanishdamiz. Foydalanuvchilarimizning takliflari asosida platformani muntazam yangilab, uning imkoniyatlarini kengaytirib boramiz.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: Users,
      title: "Jamiyat Hissasi",
      description: "Lisoniy — bu ochiq platforma. Har bir foydalanuvchi o'z bilimi bilan o'rtoqlashishi, yangi so'zlar qo'shishi va mavjud ma'lumotlarni yaxshilashda ishtirok etishi mumkin.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const audience = [
    {
      emoji: "🎓",
      title: "Talabalar va o'quvchilar",
      description: "bilimlarini mustahkamlash va kengaytirish uchun"
    },
    {
      emoji: "✍️",
      title: "Tarjimonlar, jurnalistlar va yozuvchilar",
      description: "o'z ishlarida aniq va ta'sirchan so'zlarni topish uchun"
    },
    {
      emoji: "🌐",
      title: "O'zbek tilini o'rganayotgan xorijliklar",
      description: "tilimizning nozik jihatlarini chuqurroq anglash uchun"
    },
    {
      emoji: "❤️",
      title: "O'z ona tilini sevuvchi har bir kishi",
      description: "tilning boyligidan bahramand bo'lish uchun"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:20px_20px]" />
        <div className="container relative px-4 py-24 md:py-32">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 inline-block"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg">
                <Globe className="h-10 w-10" />
              </div>
            </motion.div>
            <h1 className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl">
              So'zlar Orqali Dunyolarni Birlashtiramiz
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Har bir so'z ortida butun bir olam, o'ziga xos ma'no va madaniyat yashirin. <strong>Lisoniy</strong> — tillararo to'siqlarni olib tashlash va ona tilimizning beqiyos go'zalligini raqamli olamda namoyon etish uchun yaratilgan ma'rifiy platformadir.
            </p>
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Biz so'zlarning qudratiga ishonamiz va har bir insonga o'z fikrini aniq, go'zal va to'liq ifoda etish imkonini berishni maqsad qilganmiz. ✨
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="container px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-foreground">
              Bizning Maqsadimiz 🎯
            </h2>
            <p className="text-lg text-muted-foreground">
              Foydalanuvchilarga eng ishonchli, tushunarli va kontekstga boy lisoniy manbani taqdim etish
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-3"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {goals.map((goal, index) => {
              const Icon = goal.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full border-2 transition-all hover:shadow-xl">
                    <CardHeader>
                      <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${goal.color} text-white shadow-lg`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-xl">{goal.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{goal.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Why Lisoniy Section */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold text-foreground">
                Nega Aynan Lisoniy? 🤔
              </h2>
              <p className="text-lg text-muted-foreground">
                Dunyoda lisoniy vositalar ko'p, biroq biz quyidagi jihatlarimiz bilan ajralib turamiz
              </p>
            </motion.div>

            <motion.div
              className="grid gap-6 md:grid-cols-2"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <Card className="group h-full overflow-hidden border-2 bg-card transition-all hover:shadow-2xl">
                      <div className={`h-2 bg-gradient-to-r ${feature.gradient}`} />
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="mb-2">{feature.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="container px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-foreground">
              Biz Kimlar Uchunmiz? 👥
            </h2>
            <p className="text-lg text-muted-foreground">
              <strong>Lisoniy</strong> — so'zga, ma'noga va tilga befarq bo'lmagan har bir inson uchun
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {audience.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <Card className="h-full text-center transition-all hover:shadow-lg hover:border-primary/50">
                  <CardContent className="pt-6">
                    <div className="mb-4 text-5xl">{item.emoji}</div>
                    <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden border-t border-border bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-20 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <motion.div
          className="container relative px-4 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto max-w-4xl">
            <Heart className="mx-auto mb-6 h-16 w-16" />
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Sizni ham ushbu ma'rifiy safarimizda bizga hamroh bo'lishga chorlaymiz!
            </h2>
            <p className="mb-2 text-lg opacity-90">
              So'zlar ummoniga birga sho'ng'ishga tayyormisiz?
            </p>
            <p className="text-lg opacity-75">
              Hurmat bilan, <strong>Lisoniy jamoasi</strong>
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}