# 1.4. Reverse Prompting: Muammoni Aniqlashtirish va "To'g'ri Savol" Texnologiyasi

Ko'pincha biz AIga yechim so'rab murojaat qilamiz, lekin muammoning o'zi hali to'liq tushunilmagan bo'ladi. **Reverse Prompting (Teskari Prompt)** texnikasi bu jarayonni o'zgartiradi: siz AIdan javob berishni emas, balki **sizga savol berishni** so'raysiz. Bu usul noaniqlikni yo'qotish, yashirin talablarni (unknown unknowns) aniqlash va loyiha ko'lamini to'g'ri belgilash uchun eng samarali vositadir.

## 1. Reverse Promptingning Mohiyati

Oddiy muloqotda oqim $Foydalanuvchi \rightarrow So'rov \rightarrow AI \rightarrow Javob$ shaklida bo'ladi. Reverse Promptingda esa oqim o'zgaradi:
1.  **Foydalanuvchi:** Maqsadni bayon qiladi.
2.  **AI:** Aniqlashtiruvchi savollar beradi yoki bajarilishi kerak bo'lgan savollar ro'yxatini tuzadi.
3.  **Foydalanuvchi:** Javob beradi.
4.  **AI:** To'liq kontekst asosida yakuniy yechimni taqdim etadi.

Tadqiqotlar shuni ko'rsatadiki, foydalanuvchi maqsadi noaniq bo'lganda, AIning "faol aniqlashtirish" (active clarification) qobiliyati gallyutsinatsiyalarni kamaytiradi va natija aniqligini oshiradi.

---

## 2. Asosiy Protokollar

Ushbu texnikani qo'llashning uchta asosiy muhandislik protokoli mavjud:

### A. Protocol 20: Question Generation (Savol Yaratish)
Siz yangi loyiha boshlayapsiz, lekin qayerdan boshlashni bilmayapsiz. AIdan yechim emas, balki e'tibor qaratish kerak bo'lgan **savollar ro'yxatini** so'rang.

> **Vaziyat:** Siz yangi to'lov tizimi API'sini loyihalashtirmoqchisiz.
> **❌ Yomon Prompt:** "Menga to'lov API'si arxitekturasini chizib ber."
> **✅ Reverse Prompt:** "Men to'lov tizimi API'sini loyihalashtiryapman. Kod yozishdan oldin, xavfsizlik, masshtablilik va qonuniy talablar (compliance) bo'yicha javob berishim kerak bo'lgan **10 ta tanqidiy savolni** tuzib ber."

### B. Protocol 8: Clarification Mode (Aniqlashtirish Rejimi)
AI o'zicha taxmin qilishiga yo'l qo'ymaslik uchun, javob berishdan oldin undan ruxsat so'rashni va savol berishni talab qiling.

> **Prompt Shablon:**
> "Bizning ilova uchun kesh (cache) strategiyasini ishlab chiq.
> **MUHIM:** Yechimni taklif qilishdan oldin, mening texnologik stekim, kutilayotgan trafik hajmi va ma'lumotlarning yangilanish tezligi haqida **aniqlashtiruvchi savollar ber**. Men javob berganimdan keyingina strategiyani yoz."

### C. Protocol 58: Socratic Questioning (Sokrat Metodi)
Bu usulda AI sizga to'g'ridan-to'g'ri javob bermaydi, balki savollar orqali sizni to'g'ri yechimga yetaklaydi. Bu muammolar yechimini chuqur tahlil qilish (discovery) uchun ishlatiladi.

> **Prompt:** "Men tizim arxitekturasini tanlashda ikkilanayapman. Menga yechim taklif qilma. Buning o'rniga, talablar, cheklovlar va xatarlarni o'zim anglab yetishim uchun menga **8-10 ta Sokrat usulidagi savollarni** ber. Mening javoblarimni kut va shundan so'ng keyingi savolga o't."

---

## 3. Amaliyot: "Unknown Unknowns"ni Topish

Ko'pincha biz nimani bilmasligimizni bilmaymiz. Reverse Prompting bu "ko'r nuqtalar"ni ochishga yordam beradi.

**Ssenariy:** Startap uchun MVP (Minimum Viable Product) yaratish.

**Prompt:**
```markdown
# CONTEXT
Biz [Mahsulot g'oyasi] ustida ishlayapmiz.

# TASK
Ushbu g'oyani amalga oshirishda biz e'tibordan chetda qoldirgan bo'lishimiz mumkin bo'lgan **"yashirin xatarlar"** va **"texnik bo'shliqlar"**ni aniqlash uchun menga teskari intervyu o'tkaz.

# PROCEDURE
1. Menga bitta qiyin savol ber (masalan, foydalanuvchilar bazasi o'sishi yoki xavfsizlik haqida).
2. Mening javobimni kut.
3. Javobim asosida zaif tomonlarni ko'rsat va keyingi savolni ber.
```

---

## 4. Reverse Prompting uchun Cheatsheet

| Maqsad | Tavsiya etilgan Prompt (Buyruq) |
| :--- | :--- |
| **Talablarni yig'ish** | "Loyiha spetsifikatsiyasini yozishim uchun menga kerak bo'ladigan barcha savollarni ber." |
| **Xatoni topish (Debug)** | "Kodimda xato bor deb taxmin qilma. Menga kodning qaysi qismini tekshirishim kerakligi bo'yicha diagnostik savollar ber." |
| **Muzokara (Soft Skills)** | "Men maoshimni oshirishni so'ramoqchiman. Menejerim menga qanday qarshi savollar berishi mumkin? Meni o'sha savollarga tayyorla." |
| **Arxitektura** | "Yechim berishdan oldin, tizim yuklamasi va byudjet haqida so'ra." |

**Xulosa:** Reverse Prompting – bu AIni ijrochidan **maslahatchiga** aylantirish usulidir. U sizning noaniq g'oyalaringizni aniq muhandislik talablariga aylantirishga yordam beradi.