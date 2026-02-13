**2.9-mavzu: Hybrid Search & Reranking** bo‘yicha to‘liq va amaliy dars materiali. Bu mavzu RAG tizimlarining "miyasi" hisoblanadi, chunki eng yaxshi javobni olish uchun avval eng to'g'ri hujjatni topish kerak.

***

# 2.9. Hybrid Search & Reranking: Qidiruv Aniqligini Maksimal Darajaga Ko'tarish

RAG tizimlarida ko'pincha "vektorli qidiruv" (Semantic Search) yetarli deb o'ylashadi. Lekin amaliyotda vektorli qidiruv aniq kalit so'zlarni (masalan, mahsulot ID raqamlari, unikal nomlar) topishda oqsashi mumkin. **Hybrid Search** va **Reranking** — bu muammoni hal qiluvchi "oltin standart" yechimdir.

---

## 1. Hybrid Search (Gibrid Qidiruv)

Hybrid Search — bu ikki xil qidiruv texnologiyasining kuchli tomonlarini birlashtirishdir:

1.  **Keyword Search (BM25 / Sparse):**
    *   **Qanday ishlaydi:** Aniq so'zlarni qidiradi (Ctrl+F kabi).
    *   **Kuchli tomoni:** Aniq atamalar, ismlar, ID raqamlar, qisqartmalarni (akronimlar) topishda tengsiz.
    *   **Kamchiligi:** Sinonimlarni yoki matn ma'nosini tushunmaydi.
2.  **Vector Search (Dense):**
    *   **Qanday ishlaydi:** Matn ma'nosini vektorlarga aylantiradi.
    *   **Kuchli tomoni:** "Olma" deb qidirsangiz, "Meva" haqidagi hujjatni topib beradi (semantik aloqa).
    *   **Kamchiligi:** Ba'zan o'xshash mavzudagi, lekin noto'g'ri hujjatlarni topib berishi mumkin.

### Birlashtirish: Reciprocal Rank Fusion (RRF)
Hybrid Search bu ikki natijani birlashtirish uchun **RRF** yoki **Weighted Sum** algoritmlaridan foydalanadi. Natijada, siz ham ma'no jihatdan yaqin, ham aniq kalit so'zlari bor hujjatlarni olasiz,.

---

## 2. Reranking (Qayta Saralash): "Snayper" Aniqligi

Dastlabki qidiruv (Retriever) tez bo'lishi kerak, shuning uchun u biroz "qo'pol" ishlaydi va 50-100 ta hujjatni qaytaradi. Ularning hammasi ham foydali emas. **Reranker** — bu ikkinchi bosqich bo'lib, u topilgan nomzodlarni chuqur tahlil qiladi va eng zo'rlarini tepaga chiqaradi.

### Bi-Encoder vs. Cross-Encoder
*   **Retriever (Bi-Encoder):** So'rov va Hujjatni alohida vektorga aylantiradi va solishtiradi. Tez, lekin ma'no yo'qotilishi mumkin.
*   **Reranker (Cross-Encoder):** So'rov va Hujjatni **birgalikda** o'qiydi. U xuddi inson kabi "Bu hujjat shu savolga javob beradimi?" deb tahlil qiladi. Sekinroq, lekin o'ta aniq,.

> **Mental Model:**
> *   **Retriever:** Kutubxonachi sizga mavzuga oid 50 ta kitobni olib kelib berdi (Tezkor).
> *   **Reranker:** Siz har bir kitobning mundarijasini o'qib, kerakli 3 tasini tanlab oldingiz (Aniq).

---

## 3. Top Reranker Modellari (2025-2026)

Manbalarga asoslanib, hozirgi kunda eng samarali Rerankerlar quyidagilardir:

| Model | Turi | Tavsif | Tavsiya |
| :--- | :--- | :--- | :--- |
| **Cohere Rerank** | API (Yopiq) | Eng mashhur va kuchli model. 100+ tilni qo'llab-quvvatlaydi. "Nimble" versiyasi juda tez ishlaydi. | Enterprise loyihalar uchun eng yaxshisi. |
| **BGE-Reranker** | Open Source | Xitoy (BAAI) tomonidan yaratilgan. Ochiq manbali modellar orasida yetakchi. O'z serveringizda ishlatishingiz mumkin. | Arzon va xavfsiz yechim kerak bo'lsa. |
| **ColBERT** | Late Interaction | Gibrid yondashuv. U ham tez, ham aniq. Uzun hujjatlar bilan ishlashda juda samarali (Jina-ColBERT varianti mavjud),. | Katta hajmdagi ma'lumotlar uchun. |
| **FlashRank** | Lightweight | Juda yengil va tez (CPUda ishlaydi). Aniqligi biroz pastroq, lekin tezlik muhim bo'lsa ideal. | Mobil ilovalar yoki resurs cheklangan joyda. |

---

## 4. Tavsiya Etilgan Arxitektura (Workflow)

Yuqori sifatli RAG tizimi qurish uchun **Two-Stage Retrieval (Ikki Bosqichli Qidiruv)** arxitekturasini qo'llang:

1.  **Stage 1: Retrieval (Keng qamrov)**
    *   Hybrid Search (Vector + Keyword) orqali ma'lumotlar bazasidan **top-50** yoki **top-100** hujjatni qidirib toping.
    *   *Maqsad:* To'g'ri javobni o'tkazib yubormaslik (High Recall).

2.  **Stage 2: Reranking (Aniq saralash)**
    *   Topilgan 50 ta hujjatni Reranker modeliga (masalan, Cohere yoki BGE) bering.
    *   Reranker ularni qayta baholab, ball qo'yib beradi.
    *   Eng yuqori ball olgan **top-3** yoki **top-5** hujjatni LLMga yuboring.
    *   *Maqsad:* LLMni chalg'itmaslik va "Context Window"ni tejash (High Precision),.

---

## Xulosa

*   **Hybrid Search** so'rovdagi aniq atamalarni yo'qotmaslik uchun kerak.
*   **Reranker** qidiruv natijalarini "tozalash" va eng muhimlarini tanlash uchun zarur.
*   Reranker ishlatish LLM gallyutsinatsiyasini sezilarli darajada kamaytiradi, chunki modelga faqat eng sifatli kontekst beriladi.

