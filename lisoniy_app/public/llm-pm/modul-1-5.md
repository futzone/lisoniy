**1.5-mavzu: Iterative Refinement Loops** (Bosqichma-bosqich takomillashtirish) uchun to'liq dars materiali. Bu mavzu "bir urinishda" (zero-shot) mukammal natija olish illyuziyasidan voz kechib, muhandislik yondashuvi — iteratsiyaga o'tishni o'rgatadi.

***

# 1.5. Iterative Refinement Loops: Natijani Bosqichma-bosqich Yaxshilash

AI bilan ishlashda eng katta xatolardan biri — bu modeldan birinchi urinishdayoq mukammal natija kutishdir. LLMlar (Katta Til Modellari) ko'pincha birinchi javobda "o'rtacha" va umumiy ma'lumot beradi yoki nozik xatolarga yo'l qo'yadi.

**Iterative Refinement (Takroriy Sayqallash)** — bu javob sifatini oshirish uchun **"Generate $\rightarrow$ Critique $\rightarrow$ Refine"** (Yaratish $\rightarrow$ Tanqid $\rightarrow$ Tuzatish) siklidan foydalanish texnologiyasidir. Bu yondashuv murakkab vazifalarda (kod yozish, tahlil, strategiya) aniqlikni keskin oshiradi.

---

## 1. "Draft-Critique-Refine" Sikli

Bu usul insonning yozish jarayoniga o'xshaydi: hech kim darhol "toza nusxa" yozmaydi. Biz modelni ham shu jarayonga majburlaymiz.

### 1-Bosqich: Draft (Qoralama)
Modelga vazifani bering va birinchi versiyani yaratishni so'rang. Bu versiya mukammal bo'lishi shart emas.

### 2-Bosqich: Critique (Tanqid va Tahlil)
Eng muhim bosqich. Modelga **yangi javob yozishni taqiqlang**. Buning o'rniga, unga o'zining (yoki boshqa modelning) qoralamasini shafqatsizlarcha tanqid qilishni buyuring.

> **Prompt (Critique):**
> "Yuqoridagi javobni quyidagi mezonlar asosida tanqidiy tahlil qil:
> 1.  Mantiqiy xatolar bormi?
> 2.  Barcha cheklovlar (masalan, so'z soni, format) bajarilganmi?
> 3.  O'ta umumiy gaplar (fluff) bormi?
> **Hozircha tuzatilgan versiyani yozma, faqat xatolarni ro'yxat qil.**"

### 3-Bosqich: Refine (Tuzatish va Yakunlash)
Endi modelga tanqidiy tahlilni inobatga olgan holda yakuniy, toza versiyani yozishni buyuring.

---

## 2. Asosiy Protokollar va Texnikalar

### A. Protocol 10: Iterative Improvement (Iterativ Yaxshilash)
Ba'zan "yaxshiroq yoz" deyish yetarli emas. Nimani o'zgartirish kerakligini aniq iteratsiyalarda ko'rsating.

> **Prompt:**
> "Mening mahsulotim uchun reklama matnini 3 ta iteratsiyada yoz:
> *   **Iteratsiya 1:** Barcha texnik xususiyatlarni qamrab oluvchi batafsil qoralama.
> *   **Iteratsiya 2:** Matnni 50% ga qisqartir va faqat foydalanuvchiga tegadigan foydani qoldir.
> *   **Iteratsiya 3 (Final):** Matnni yanada jozibali (punchy) qil va harakatga undovchi (CTA) qo'sh."

### B. Evaluator-Optimizer (Baholovchi-Optimallashtiruvchi)
Bu "Agentic Workflow"larning asosiy binosidir. Bitta sessiyada model ikki xil rolni o'ynaydi:
1.  **Generator (Ijrochi):** Vazifani bajaradi.
2.  **Evaluator (Tekshiruvchi):** Ijrochi ishini baholaydi va qayta ishlashga yuboradi.

**Kod yozishda qo'llanilishi:**
1.  AI kod yozadi.
2.  Keyingi promptda: *"Tasavvur qil, sen Senior Code Reviewersan. Bu kodda xavfsizlik zaifliklari yoki samarasiz (O(n^2)) joylar borligini tekshir."*
3.  So'nggi prompt: *"Review asosida kodni refactoring qil."*.

### C. Protocol 33: Critique Mode (Xatoni Qidirish)
Model o'z javobidagi xatoni topishga qiynalishi mumkin. Shuning uchun unga maxsus "Critique Mode"ni yoqish buyuriladi.

> **Prompt:**
> "Menga yechim taklif qil. Keyin, o'z yechimingni 'Advocatus Diaboli' (Shayton advokati) sifatida tahlil qil: bu yechim qayerda ishlamay qolishi mumkin? Qaysi ekstremal holatlarni (edge cases) hisobga olmading?"

---

## 3. Reflection (Refleksiya) Texnikasi

Refleksiya — bu modelning o'z xatolaridan saboq chiqarish jarayoni. Agar model birinchi urinishda xato qilsa (masalan, noto'g'ri kod yozsa), unga xato logini ko'rsatib, *"Nima xato ketdi va keyingi urinishda nimani o'zgartirasiz?"* deb so'rash kerak.

**Jarayon:**
1.  **Harakat:** Kod yozish / Matn yozish.
2.  **Kuzatuv:** Xato chiqdi / Matn zerikarli.
3.  **Refleksiya:** *"Men kutubxonaning eski versiyasini ishlatibman. Yangi versiyada bu funksiya o'zgargan."*.
4.  **Tuzatish:** Yangi bilim bilan qayta urinish.

---

## 4. Amaliy Shablon: Sifatni Arttirish (Quality Booster)

Har qanday muhim matn yoki kod uchun ushbu shablondan foydalaning:

```markdown
# TASK
[Vazifani yozing, masalan: Loyiha rejasini tuz]

# DRAFTING STEP
Avval mavzu bo'yicha birinchi qoralamani tayyorla.

# CRITIQUE STEP (INTERNAL MONOLOGUE)
Endi bu qoralamani qattiq tanqid qil. Quyidagilarni tekshir:
- Aniq faktlar o'rniga umumiy gaplar ishlatilmaganmi?
- Mantiqiy ketma-ketlik buzilmaganmi?
- Ohang (Tone) auditoriyaga mosmi?
O'zgartirish kerak bo'lgan 3 ta asosiy nuqtani aniqla.

# FINAL POLISH
Tanqidlarni inobatga olib, yakuniy, yuqori sifatli versiyani taqdim et.
```

---

## 5. Xulosa

*   **Iteratsiya = Sifat:** LLMlar birinchi urinishda ko'pincha "dangasa" bo'ladi. Ularni qayta ishlashga majburlash sifatni keskin oshiradi.
*   **Tanqidni ajrating:** Tuzatishdan oldin alohida qadamda tanqid qilishni so'rash, modelga o'z xatolarini "ko'rish" imkonini beradi.
*   **Rol o'zgarishi:** O'z ishini o'zi tekshirganda modelga boshqa rol (masalan, Auditor yoki Muharrir) berish samaraliroq.

***

**Keyingi qadam:** 1-Modul (Prompt Engineering) yakunlandi. Endi biz modelga tashqi bilim va xotirani qanday ulashni o'rganish uchun **2-Modul: Context Engineering (Tizim Arxitekturasi)** ga o'tamiz. 