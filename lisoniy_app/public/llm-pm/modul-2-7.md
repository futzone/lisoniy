**2.7-mavzu: RAG Arxitekturalari** bo'yicha amaliy va qiyosiy dars. Bu mavzu "Context Engineering"ning yuragi hisoblanadi, chunki noto'g'ri RAG arxitekturasi eng aqlli modelni ham samarasiz qilib qo'yadi.

***

# 2.7. RAG Arxitekturalari: Standard, Agentic va GraphRAG

RAG (Retrieval-Augmented Generation) — bu LLMga tashqi bilimlarni (kompaniya hujjatlari, ma'lumotlar bazasi) ulab berish texnologiyasidir. Maqsad — modelni qayta o'qitmasdan turib, uning javoblarini aniq faktlarga asoslashdir,.

Hozirda RAGning uchta asosiy evolyutsion bosqichi mavjud:

---

## 1. Standard RAG (Naive RAG)
Bu eng oddiy va keng tarqalgan yondashuv. U chiziqli (linear) jarayon bo'lib, har bir so'rov uchun bir martalik qidiruvni amalga oshiradi.

### Ishlash Tamoyili:
1.  **Retrieve (Qidirish):** Foydalanuvchi savoli vektorga aylantiriladi va ma'lumotlar bazasidan eng o'xshash matn bo'laklari (chunks) topiladi.
2.  **Augment (Boyitish):** Topilgan matnlar promptga "Context" sifatida qo'shiladi.
3.  **Generate (Yaratish):** LLM ushbu kontekst asosida javob beradi.

**Afzalligi:** Tez, arzon va oddiy savollar ("Bizning ofis qayerda?") uchun juda samarali.
**Kamchiligi:** Murakkab, ko'p qadamli savollarda ("2023 va 2024 yillardagi sotuvlarni solishtirib, sababini tushuntir") ojiz qoladi, chunki u faqat so'zlarning o'xshashligiga qaraydi.

---

## 2. Agentic RAG (Agentli RAG)
Bu 2025-yilgi standart. Agentic RAGda qidiruv jarayoni modelning "fikrlash" (reasoning) qobiliyati bilan boshqariladi. Bu shunchaki qidiruv emas, balki **"tadqiqotchi agent"** ishidir.

### Ishlash Tamoyili:
1.  **Rejalashtirish:** Agent savolni tahlil qiladi va qanday ma'lumot kerakligini hal qiladi (masalan, "Avval 2023 hisobotini, keyin 2024 hisobotini qidirishim kerak").
2.  **Tool Use (Vositalar):** Agent o'z ixtiyoridagi vositalardan (SQL, Vektorli qidiruv, Internet) foydalanib ma'lumot yig'adi.
3.  **Multi-Step Reasoning:** Agar birinchi qidiruv natijasi yetarli bo'lmasa, agent savolni o'zgartirib qayta qidiradi (iterativ jarayon).
4.  **Sintez:** Turli manbalardan olingan ma'lumotlarni birlashtirib, yakuniy xulosa yasaydi.

**Farqi:** Standard RAG "bir marta o'qiydi", Agentic RAG esa javob topguncha "qidiradi va o'ylaydi".

---

## 3. GraphRAG (Bilimlar Grafiga asoslangan RAG)
Vektorli qidiruv (Vector Search) so'zlar o'xshashligini yaxshi topadi, lekin **aloqalar va mantiqiy bog'liqlikni** (relationships) ko'ra olmaydi. GraphRAG esa ma'lumotlarni **Bilimlar Grafi (Knowledge Graph)** ko'rinishida saqlaydi,.

### Ishlash Tamoyili:
*   Matnlar shunchaki parcha emas, balki **Entitilar** (Odamlar, Kompaniyalar, Joylar) va ular o'rtasidagi **Aloqalar** (ishlaydi, joylashgan, egalik qiladi) sifatida saqlanadi.
*   **Misol:** "Ilon Mask qaysi kompaniyalarga aloqador?" degan savolda vektorli qidiruv faqat "Ilon Mask" so'zi bor hujjatlarni topadi. GraphRAG esa `Elon Musk -> CEO of -> Tesla` va `Elon Musk -> Founder of -> SpaceX` bog'liqliklarini graf orqali darhol topadi,.

**Eng kuchli tomoni:** "Global" savollar (masalan, "Butun hujjatlar to'plamida qanday asosiy mavzular bor?") va yashirin aloqalarni topishda tengsizdir.

---

## Qiyosiy Jadval

| Xususiyat | Standard RAG | Agentic RAG | GraphRAG |
| :--- | :--- | :--- | :--- |
| **Asosiy mexanizm** | Vektorli o'xshashlik (Semantic Search) | Mantiqiy fikrlash va Asboblar (Tools) | Grafli bog'liqliklar (Relationships) |
| **Jarayon** | Chiziqli (Retrieve-Read) | Iterativ (Plan-Act-Observe) | Strukturalashgan (Graph Traversal) |
| **Eng yaxshi holat** | Oddiy faktlarni qidirish. | Murakkab, ko'p qadamli tahlil. | Aloqalar va umumiy xulosalar. |
| **Narxi/Tezligi** | Arzon / Tez (ms) | Qimmatroq / Sekinroq (sekundlar) | O'rtacha / O'qitish qimmat |

---

## Xulosa

*   **Boshlanishiga:** Standard RAG yetarli.
*   **Murakkablik oshganda:** Agentic RAG ga o'ting (ayniqsa kod yozish yoki tahlil uchun).
*   **Ma'lumotlar bog'liq bo'lsa:** GraphRAG (yoki gibrid yondashuv) ishlatish kerak.

