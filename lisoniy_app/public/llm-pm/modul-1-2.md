# 1.2. Chain-of-Thought & Reasoning (Mantiqiy Fikrlash Zanjiri)

AI modellari asosan "ehtimollik" asosida ishlaydi (System 1 - tez fikrlash). Ular ko'pincha birinchi kelgan javobni qaytarishga harakat qiladi, bu esa mantiqiy xatolarga olib keladi. **Chain-of-Thought (CoT)** texnikasi modelni sekinlashtiradi va javob berishdan oldin "o'ylab olishga" (System 2 - sekin fikrlash) majbur qiladi.

## 1. CoT ning Asosiy Tamoyillari

### Nega bu kerak?
Oddiy promptda model savoldan to'g'ridan-to'g'ri javobga sakraydi ($Input \rightarrow Output$). CoTda esa oraliq qadamlar hosil qilinadi ($Input \rightarrow Reasoning \rightarrow Output$).
Tadqiqotlar shuni ko'rsatadiki, CoT murakkab vazifalarda aniqlikni **20-50% ga oshiradi**.

### Asosiy Triggerlar (Ishga tushirgichlar)
*   **Zero-Shot CoT:** Eng oddiy usul. Prompt oxiriga *"Let's think step by step"* (Keling, bosqichma-bosqich o'ylab ko'raylik) deb qo'shish.
*   **Manual CoT:** Modelga qanday fikrlash kerakligini aniq ko'rsatib berish (quyida batafsil).

---

## 2. Advanced Reasoning Protocols (2025-2026 Standard)

Zamonaviy muhandislikda oddiy "o'ylab ko'r" degan gap yetarli emas. Biz quyidagi protokollardan foydalanamiz:

### A. Protocol 9: Explicit Reasoning Steps (Aniq Mantiqiy Qadamlar)
Modelga shunchaki "yechim top" demang, unga fikrlash algoritmini bering.

> **Misol (API sekin ishlashi tahlili):**
> "Checkout API javob berishi 3 soniya vaqt olyapti. Ildiz sababni tahlil qil (Root Cause Analysis):
> 1.  **Mumkin bo'lgan sabablar ro'yxatini tuz** (Tarmoq, DB, Kod, Tashqi API).
> 2.  Har bir kategoriya uchun **diagnostika usulini yoz**.
> 3.  Muammolarni **ehtimollik bo'yicha sarala**.
> 4.  Tekshirish uchun **top-3 ta tavsiya ber**.
> **MUHIM:** Har bir qadamda nima uchun bunday o'ylayotganingni asoslab ber (Show your reasoning)."

### B. Protocol 86: Audit Trail Mode (Tekshiruv Izi)
Bu moliya, huquq va kodlashda juda muhim. Model javobni qayerdan olganini va qanday qarorga kelganini "Audit Trail" sifatida ko'rsatishi shart.

> **Prompt Qismi:**
> "Menga eng yaxshi ma'lumotlar bazasini tavsiya qil. Javobingda quyidagi **Audit Trail** bo'lsin:
> *   **STEP 1 - Talablar tahlili:** Mening so'rovimdan qaysi texnik talablarni ajratib olding?
> *   **STEP 2 - Alternativlar:** Qaysi variantlarni ko'rib chiqding va nima uchun boshqalarini rad etding?
> *   **STEP 3 - Trade-offs (Yutuq va Yo'qotishlar):** Nimani qurbon qilyapmiz (tezlikmi yoki narx)?
> *   **STEP 4 - Final Tavsiya:** Ishonch darajasi bilan."

### C. Protocol 61: Inversion (Teskari Fikrlash)
Ba'zan to'g'ri yechimni topish qiyin bo'ladi. Shunda modeldan **"Nima qilsak, tizim aniq buziladi?"** deb so'rash samaraliroq bo'ladi.

> **Prompt:**
> "Qanday qilib xavfsiz tizim qurishni emas, balki **'Nima qilsak, tizimimiz 100% buziladi?'** degan savolga javob ber. Barcha zaif nuqtalarni ro'yxat qil va keyin ularni yopish rejalarini tuz."

---

## 3. Reasoning Effort (Fikrlash Kuchini Sozlash)

Yangi modellarda (masalan, GPT-5.2 yoki o1/o3 seriyalari) siz **`reasoning_effort`** parametrini boshqarishingiz mumkin.

*   **Low/None:** Chat, oddiy savollar uchun (tez va arzon).
*   **Medium:** Ma'lumotlarni tahlil qilish, SQL yozish.
*   **High/xHigh:** Murakkab arxitektura qurish, refactoring qilish yoki xavfsizlik auditini o'tkazish. Bu rejimda model javob berishdan oldin uzoqroq "o'ylaydi" va ichki "monolog" orqali xatolarini tuzatadi.

---

## 4. Amaliy Mashg'ulot: Kodni Refactoring Qilish

Keling, oddiy promptni **Reasoning Protocol** ga aylantiramiz.

**❌ Oddiy Prompt:**
> "Bu kodni optimizatsiya qilib ber."

**✅ Reasoning Prompt (Advanced):**
```markdown
# TASK
Quyidagi Python funksiyasini optimizatsiya qil.

# REASONING PROCESS
Javobni yozishdan oldin, quyidagi bosqichlardan o't (Chain-of-Thought):
1.  **Complexity Analysis:** Hozirgi kodning Time va Space complexity (Big O) darajasini aniqla.
2.  **Bottleneck Identification:** Kodning qaysi qismi eng ko'p resurs yeyayotganini top.
3.  **Alternative Approaches:** Kamida 2 xil optimizatsiya usulini (masalan, Caching yoki Vectorization) xayolan solishtir.
4.  **Implementation:** Eng yaxshi usulni tanla va kodni yoz.

# OUTPUT
Faqat yakuniy kodni va qisqa tushuntirishni (docstring) qaytar.
```

---

## 5. Xulosa

*   **Chain-of-Thought (CoT)** — bu modelga "ichingda o'yla" deb buyruq berish emas, balki "qanday o'ylash kerakligini" chizib berishdir.
*   **Sequence (Ketma-ketlik):** Har doim modeldan avval reja tuzishni, keyin tahlil qilishni, va oxirida kod/javob yozishni so'rang (Plan $\rightarrow$ Execute $\rightarrow$ Review).
*   **Self-Correction:** Modelga o'z javobini o'zi tanqid qilish imkoniyatini bering (bu haqda keyingi darslarda chuqurroq gaplashamiz).

