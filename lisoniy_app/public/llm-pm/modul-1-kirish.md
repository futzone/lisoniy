# 1-Modul: Advanced Prompt Engineering (Muloqot Arxitekturasi)

## 1.1. Kirish: Prompt Engineering nima va u nima uchun o‘zgardi?

2025-yilda Prompt Engineering shunchaki "chiroyli gapirish san'ati" emas, balki **tizimli muhandislik intizomidir**. Dastlabki bosqichlarda biz modeldan javob olish uchun turli "sehrli so‘zlar"ni qidirgan bo'lsak, endi biz modelning xatti-harakatini dasturlash uchun aniq protokollar va tuzilmalardan foydalanamiz.

**Asosiy farq:**
*   **Oddiy Prompt:** "Menga marketing rejasi yozib ber." (Natija noaniq, umumiy).
*   **Advanced Prompt Engineering:** Modelga vazifa, kontekst, cheklovlar va kutilayotgan formatni aniq belgilab berish orqali uning "fikrlash jarayonini" boshqarish.

Ushbu modulda biz AIni "sehrli quti" sifatida emas, balki **davlatga (state) ega bo'lmagan funksiya** sifatida ko'ramiz: Kirish (Input) sifatli bo'lsa, Chiqish (Output) ham sifatli bo'ladi.

---

## 1.2. Muloqot Arxitekturasining 3 Ustuni

Samarali prompt yozish uchun **"Task $\rightarrow$ Context $\rightarrow$ Constraints"** (Vazifa $\rightarrow$ Kontekst $\rightarrow$ Cheklovlar) formulasidan foydalanish tavsiya etiladi.

### 1. Vazifa (The Task)
Model nima qilishi kerakligini aniq fe'llar bilan ifodalang.
*   *Yomon:* "Buni ko'rib chiq."
*   *Yaxshi:* "Quyidagi kodni xavfsizlik zaifliklari bo'yicha **tahlil qil**, xatolarni **aniqla** va tuzatilgan versiyasini **yoz**".

### 2. Kontekst (The Context)
Modelga vazifani bajarish uchun kerak bo'lgan "muhit"ni yarating. Bu qism modelga kim ekanligini (Persona) va vaziyatni tushuntiradi.
*   **Role Prompting (Rol berish):** "Sen 10 yillik tajribaga ega Senior Java Dasturchisisan". Bu modelga o'z ichki bilimlar bazasining qaysi qismiga murojaat qilish kerakligini ko'rsatadi.
*   **Vaziyat:** "Biz hozir yuqori yuklamali tizimni optimizatsiya qilyapmiz, foydalanuvchilar soni 1 milliondan oshdi."

### 3. Cheklovlar (The Constraints)
Model nima qilmasligi kerakligini va javob qaysi formatda bo'lishini belgilang. Bu "gallyutsinatsiya" (yolg'on ma'lumot)ni kamaytirishning eng samarali yo'lidir.
*   *Format:* "Javobni faqat JSON formatida qaytar. Hech qanday tushuntirish matni yozma".
*   *Uslub:* "Juda rasmiy tilda yozma, sodda va lo'nda bo'lsin."
*   *Manfiy buyruqlar:* "Hech qachon 'Menimcha' yoki 'Balki' so'zlarini ishlatma".

---

## 1.3. Asosiy Texnikalar (Core Techniques)

Ushbu texnikalar modelning "aqlli" ko'rinishini ta'minlaydi va murakkab vazifalarni bajarishga yordam beradi.

### A. Few-Shot Prompting (Namunalar bilan ishlash)
Modelga shunchaki ta'rif berish o'rniga, unga 1-2 ta ideal namuna (misol) ko'rsating. Bu modelga siz kutayotgan uslub va tuzilmani "ko'chirib olish" imkonini beradi.

> **Misol:**
> *Vazifa:* Mahsulot nomidan shior yaratish.
> *Namuna 1:* Mahsulot: Nike krossovkalari -> Shior: Just Do It.
> *Namuna 2:* Mahsulot: Apple iPhone -> Shior: Think Different.
> *Surov:* Mahsulot: Tezkor qahva -> Shior: ...

### B. Chain-of-Thought (Fikrlash Zanjiri)
Modeldan darhol javob berishni so'rash o'rniga, unga **"bosqichma-bosqich o'ylab ko'r"** (Let's think step by step) deb buyruq berish. Bu ayniqsa mantiqiy va matematik masalalarda aniqlikni keskin oshiradi.
*   2025-yilda bu texnika "Audit Trail Mode" (Tekshiruv Izi) deb ham ataladi, ya'ni model o'z qarorini qanday qabul qilganini ko'rsatib berishi kerak.

### C. System Prompts (Tizim Ko'rsatmalari)
Bu modelning "miyasiga" o'rnatiladigan asosiy qonuniyatlardir. Tizim prompti foydalanuvchi suhbati davomida o'zgarmaydi va modelning umumiy xulq-atvorini belgilaydi.
*   *Maqsad:* Modelni xavfsiz, foydali va kompaniya qadriyatlariga mos ushlab turish.

---

## 1.4. Amaliy Mashg'ulot: Promptni Qayta Yozish

Keling, oddiy promptni "muhandislik" darajasiga olib chiqamiz.

**❌ Yomon Prompt:**
> "Menga loyiha boshqaruvi haqida post yozib ber."

*(Muammo: Juda umumiy, maqsadsiz, auditoriya noma'lum, format yo'q.)*

**✅ Yaxshi (Engineering) Prompt:**
> **Role:** Sen tajribali IT Loyiha Menejerisan (PMP sertifikatiga ega).
> **Task:** LinkedIn uchun "Agile metodologiyasining 3 ta asosiy afzalligi" haqida post yoz.
> **Context:** Auditoriya – endi ish boshlayotgan yosh dasturchilar. Ular murakkab terminlarni tushunmaydi.
> **Constraints:**
> 1. Matn uzunligi 150 so'zdan oshmasin.
> 2. Har bir afzallikni emoji (✅) bilan ajratib ko'rsat.
> 3. Post oxirida munozara uchun bitta savol qoldir.
> 4. Hech qanday "Kirish" yoki "Xulosa" degan sarlavhalarni ishlatma.

---

## 1.5. Xulosa va Keyingi Qadam

Prompt Engineering – bu til orqali dasturlashdir. Sizning maqsadingiz modelni "o'ylashga" majbur qilish va uning javob berish maydonini kerakli chegara ichida ushlab turishdir.

**Keyingi modullarda biz:**
*   Modelga tashqi ma'lumotlarni (hujjatlarni) qanday to'g'ri berish (**Context Engineering**).
*   AI agentlarni qanday qilib avtonom ishlatish (Agentic Workflow) haqida gaplashamiz.

***

**Sizga topshiriq:** O'zingizning kundalik ishingizdagi biror vazifani (masalan, email yozish yoki kod tekshirish) oling va yuqoridagi "Task-Context-Constraints" formulasi asosida mukammal prompt tuzib ko'ring. Tayyormisiz?