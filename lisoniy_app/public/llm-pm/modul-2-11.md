**2.11-mavzu: "Lost in the Middle" Fenomeni va "Gold Context"** bo‘yicha batafsil dars materiali. Bu mavzu katta kontekstlar bilan ishlashda ma'lumot yo'qolishining oldini olish uchun juda muhimdir.

***

# 2.11. "Lost in the Middle" va "Gold Context" Strategiyasi

LLMlar (Katta Til Modellari) 100k+ yoki 1M+ tokenli kontekst oynalariga ega bo'lsa-da, tadqiqotlar shuni ko'rsatadiki, model kontekst ichidagi barcha ma'lumotlarga bir xil e'tibor bermaydi. Bu **"Lost in the Middle" (O'rtada Yo'qolish)** fenomeni deb ataladi.

## 1. "Lost in the Middle" Fenomeni Nima?

Modellarning ma'lumotni eslab qolish qobiliyati **U-shaklidagi egri chiziqqa** (U-shaped curve) o'xshaydi:
*   **Primacy Bias (Boshlanish):** Kontekstning eng boshida turgan ma'lumotlarni model juda yaxshi eslab qoladi,.
*   **Recency Bias (Oxiri):** Kontekstning eng oxirida (savolga yaqin joyda) turgan ma'lumotlar ham yaxshi tahlil qilinadi.
*   **The "Middle" (O'rta):** Kontekstning o'rta qismidagi ma'lumotlar ko'pincha e'tibordan chetda qoladi yoki "unutiladi". Aniqlik bu zonada keskin pasayadi,.

Bu shuni anglatadiki, agar siz RAG tizimida eng muhim hujjatni 50 ta hujjat orasiga (o'rtasiga) joylashtirsangiz, model uni topa olmasligi mumkin.

---

## 2. "Gold Context" Hajmining Ahamiyati (Yangi Tadqiqotlar)

2025-2026 yillardagi tadqiqotlar (xususan, *Hidden in the Haystack*) shuni ko'rsatdiki, muammo faqat joylashuvda emas, balki **"Gold Context"** (javobni o'z ichiga olgan kerakli matn bo'lagi)ning **hajmida** hamdir.

### Kichik vs. Katta "Gold Context"
*   **Kichik Gold Context (Ignani topish):** Agar kerakli ma'lumot juda qisqa bo'lsa (masalan, bitta jumla yoki fakt), model uni o'rta qismdan topishda juda qiynaladi. Positional bias (joylashuvga bog'liqlik) kuchayadi,.
*   **Katta Gold Context (Temir bo'lagini topish):** Agar kerakli ma'lumot atrofidagi qo'shimcha kontekst (masalan, butun paragraf yoki sahifa) bilan berilsa, model uni kontekstning qaysi qismida joylashganidan qat'i nazar, ancha yaxshi topadi,.

**Xulosa:** Kichik "igna"larni o'rtada yo'qotish oson, lekin katta "bo'lak"larni model osonroq payqaydi.

---

## 3. Muhandislik Yechimlari (Mitigation Strategies)

Ushbu muammoni hal qilish uchun Context Engineeringda quyidagi strategiyalar qo'llaniladi:

### A. Reranking va Reordering (Qayta Tartiblash)
RAG tizimida topilgan hujjatlarni shunchaki o'xshashlik bo'yicha saralamang. **Reranker** modelidan foydalanib, eng muhim hujjatlarni aniqlang va ularni kontekstning **boshiga va oxiriga** joylashtiring.
*   *Strategiya:* Eng muhim 5 ta hujjatni oling. 1-chisini eng oxiriga (savol oldiga), 2-chisini eng boshiga, qolganlarini o'rtaga qo'ying.

### B. Gold Context Expansion (Kontekstni Kengaytirish)
Faqatgina javobni o'z ichiga olgan kichik jumlani (chunk) bermang. Uni "Padding" qiling, ya'ni atrofidagi oldingi va keyingi jumlalarni ham qo'shib, "Gold Context" hajmini sun'iy ravishda oshiring. Bu modelning "diqqatini tortish" ehtimolini oshiradi,.

### C. Context Compression & Filtering (Filtrlash)
Kontekst qancha uzun bo'lsa, "shovqin" (distractors) shunchalik ko'payadi.
*   **Adaptive Retrieval:** Modelga kerak bo'lmagan hujjatlarni yuklamang. Agar savol oddiy bo'lsa, umuman retrieval qilmang (No-Retrieval).
*   **Distractor Removal:** Mavzuga aloqador lekin javobni o'z ichiga olmaydigan "chalg'ituvchi" hujjatlar modelni adashtiradi. Ularni Reranker yordamida kesib tashlang,.

---

## 4. Amaliy Tavsiya

**Prompt tuzilmasida "Lost in the Middle"ni hisobga olish:**

```markdown
# SYSTEM INSTRUCTIONS (Primacy Bias - Muhim qoidalar shu yerda)
Siz moliyaviy tahlilchisiz. Faqat quyidagi kontekstga asoslaning.

# CONTEXT DOCUMENTS
[Hujjat 2 - O'rtacha muhim]
...
[Hujjat 3 - Kamroq muhim]
...
[Hujjat 1 - ENG MUHIM "GOLD" HUJJAT] <--- Recency Bias (Savolga eng yaqin)

# USER QUESTION
Q 2024 hisobotida sof foyda qancha bo'ldi?
```

***

**Keyingi qadam:** Endi biz kontekst va promptni qanday boshqarishni bilamiz. Navbat modelni tashqi dunyo bilan bog‘lashga.
