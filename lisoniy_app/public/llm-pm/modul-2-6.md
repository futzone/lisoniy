**2.6-mavzu: Context Construction (Kontekstni Qurish)** bo‘yicha to‘liq va amaliy dars materiali. Bu mavzu kontekstni shunchaki ma’lumotlar ombori emas, balki "muhandislik obyekti" sifatida ko‘rishni o‘rgatadi.

***

# 2.6. Context Construction: Yozish, Tanlash va Siqish Strategiyalari

Kontekst oynasi (Context Window) — bu AIning "Tezkor Xotirasi" (RAM). Agar unga hamma narsani yuklasangiz, model sekinlashadi, qimmatga tushadi va "aqldan ozadi" (hallucination). **Context Construction** — bu cheklangan xotiraga eng muhim ma'lumotlarni joylash san'atidir.

Biz 3 ta asosiy strategiyadan foydalanamiz: **Write (Yozish), Select (Tanlash), Compress (Siqish)**.

---

## 1. Write (Yozish): Xotirani Tashqariga Chiqarish

Modelning kontekst oynasini band qilmaslik uchun ma'lumotlarni tashqi manbalarga yozib qo'yish kerak. Model kerak bo'lganda ularni o'sha yerdan o'qiydi.

### A. Scratchpads (Qoralama daftarlar)
Insonlar murakkab masalani yechishda qog'ozga yozib olganidek, agentlarga ham oraliq hisob-kitoblarni saqlash uchun joy kerak.
*   **Usul:** Agentga "Write to File" (Faylga yozish) vositasini bering. Masalan, kodni tahlil qilayotganda, topilgan xatolarni darhol kontekstda saqlash o'rniga, `bugs.txt` fayliga yozib boradi.
*   **Foydasi:** Kontekst oynasi tozalanadi, lekin ma'lumot yo'qolmaydi.

### B. Persistent State (Doimiy Holat)
Uzoq muddatli suhbatlarda foydalanuvchi afzalliklari (masalan, "Menga Python kodini ber") har safar qaytarilmasligi kerak.
*   **Yechim:** Bu ma'lumotlarni **Key-Value Store** (Redis) yoki **User Profile** faylida saqlang va faqat sessiya boshida tizim promptiga inyeksiya qiling.

---

## 2. Select (Tanlash): Just-in-Time Retrieval

Hamma hujjatni birdaniga yuklash xatodir. Ma'lumotni faqat u kerak bo'lgan paytda yuklash (**Just-in-Time**) eng samarali usuldir.

### A. Dynamic Tool Selection (Dinamik Vosita Tanlash)
Agar sizda 100 ta vosita (tool) bo'lsa, ularning hammasini ta'rifini promptga tiqish juda ko'p joy oladi.
*   **Strategiya:** Agentga faqat vositalar *kategoriyasini* ko'rsating yoki joriy vazifaga aloqador vositalarni qidirib topish (retrieval over tools) imkonini bering.
*   **Misol:** Foydalanuvchi "LinkedIn post yoz" desa, faqat `LinkedIn_API` va `Text_Editor` vositalarini kontekstga yuklang, `Database_Query` vositasi kerak emas.

### B. Intelligent File Reading (Aqlli Fayl O'qish)
Kodni tahlil qilishda butun repozitoriyani yuklamang.
*   **Jarayon:** Agent avval fayl tuzilmasini (`ls -R`) ko'rsin, keyin kerakli fayllarni `grep` qilsin va faqat shundan so'ng aniq faylni (`read_file`) o'qisin. Bu "progressive disclosure" (bosqichma-bosqich ochish) deb ataladi.

---

## 3. Compress (Siqish): Ma'lumotni Zichlash

Agar ma'lumot juda muhim bo'lsa-yu, lekin juda katta bo'lsa, uni siqish kerak.

### A. Summarization (Xulosa qilish)
Suhbat tarixi (chat history) to'lib ketganda, eski xabarlarni o'chirib yuborish o'rniga, ularni umumlashtiring.
*   **Summarization Middleware:** Har 10 ta xabardan keyin, modeldan o'tgan suhbatni 3-4 jumla bilan xulosa qilishni so'rang va eski xabarlar o'rniga shu xulosani qo'ying.
*   **Compaction (Zichlash):** Model arxitektura qarorlari yoki topilgan buglar kabi muhim detallarni saqlab qoladi, lekin "Salom, qalaysiz" kabi keraksiz gaplarni olib tashlaydi.

### B. Pruning (Kesib tashlash)
Ba'zi ma'lumotlar faqat bir marta kerak bo'ladi.
*   **Tool Outputs:** Agent `ls -la` buyrug'ini berib 100 ta fayl nomini oldi. U kerakli faylni tanlagandan so'ng, bu 100 ta fayl ro'yxati kontekstda "shovqin"ga aylanadi.
*   **Strategiya:** Vazifa bajarilgandan so'ng, oraliq vosita javoblarini (tool outputs) kontekstdan o'chirib tashlang. Anthropic tadqiqotlariga ko'ra, bu usul uzoq vazifalarda token sarfini 84% ga kamaytiradi.

---

## 4. Amaliyot: Kontekstni Optimallashtirish

Keling, real ssenariyni optimallashtiramiz.

**❌ Yomon Kontekst (Bloated):**
```text
System: Sen yordamchisan.
User: Server ishlamayapti.
Agent: (Logs tool) -> [5000 qatorlik loglar...]
Agent: Tushunarli, 489-qatorda xato bor ekan.
User: Uni qanday tuzataman?
Context hajmi: 6500 token (shundan 5000 tasi endi kerak emas).
```

**✅ Yaxshi Kontekst (Engineered):**
1.  **Select:** Agent faqat oxirgi 50 qator logni o'qiydi.
2.  **Compress:** Xatoni topgach, loglarni o'chirib, o'rniga qisqa xulosa yozadi: *"Loglarda `ConnectionRefused` xatosi topildi (Line 489)."*
3.  **Write:** Agar xato murakkab bo'lsa, to'liq logni `error_log.txt` fayliga saqlab qo'yadi.

```text
System: Sen DevOps yordamchisisan.
Context Summary: Serverda ConnectionRefused xatosi aniqlandi. To'liq loglar 'error_log.txt' faylida.
User: Uni qanday tuzataman?
Context hajmi: 400 token.
```

---

## 5. Xulosa

*   **Context Construction** — bu AIning "diqqatini" boshqarishdir.
*   **Write:** Xotirani tashqi fayllarga yuklang.
*   **Select:** Faqat hozir kerak bo'lganini oling.
*   **Compress:** Tarixni qisqartiring, eski "axlat"ni tozalang.

