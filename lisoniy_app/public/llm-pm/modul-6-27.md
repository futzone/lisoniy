**6.27-mavzu: Token Optimization (Token va Xarajatlarni Optimallashtirish)** bo‘yicha amaliy dars.

Agentlar tizimida har bir so‘z (token) pul turadi. Katta hajmdagi loyihalarda "Context Window"ni to‘ldirish nafaqat qimmatga tushadi, balki modelning ishlash tezligini (latency) pasaytiradi va aniqligini (accuracy) buzishi mumkin (Lost in the Middle phenomena).

Quyida tokenlarni tejash va xarajatlarni 90% gacha kamaytirishning 4 ta asosiy strategiyasi keltirilgan.

***

# 6.27. Token Optimization: Xarajatlarni Kamaytirish Strategiyalari

### 1. Context Compression (Kontekstni Siqish)
Eng oddiy va samarali usul — eski ma'lumotlarni "siqish".
*   **Summarization (Xulosalash):** Uzun suhbat tarixini saqlash o‘rniga, agent vaqti-vaqti bilan o‘tgan suhbatni qisqa xulosaga aylantiradi va faqat shu xulosani xotirada saqlaydi.
*   **Pruning (Kesib tashlash):** Agent vositalarni (tools) ishlatganda chiqadigan katta hajmdagi texnik loglarni (masalan, 5000 qatorli SQL natijasi) to‘liq kontekstga kiritmang. Uni "Natija: 847 ta xato topildi" degan qisqa jumla bilan almashtiring va asl logni o‘chirib tashlang.

### 2. Filtering & Reranking (Saralash)
RAG tizimlarida eng ko‘p uchraydigan xato — "Top-K" ni juda katta olish (masalan, 20 ta hujjatni promptga tiqish).
*   **Reranking (Qayta saralash):** Dastlabki qidiruvdan so‘ng (Retriever), natijalarni **Cross-Encoder (Reranker)** orqali qayta tekshiring va faqat eng yuqori ball olgan 3 ta eng muhim hujjatni modelga bering. Bu aniqlikni oshiradi va tokenlarni tejaydi.
*   **Relevant Tools Only:** Agar sizda 50 ta vosita bo‘lsa, hammasini tavsifini promptga yozmang. Faqat hozirgi vazifaga aloqador 3-4 tasini dinamik yuklang.

### 3. Caching (Keshlash)
Bir xil so‘rovlar uchun modelga qayta-qayta pul to‘lamang.
*   **Prompt Caching:** Ko‘p ishlatiladigan katta "System Prompt"lar yoki hujjatlarni keshda saqlang. Masalan, Anthropic va OpenAI kabi platformalar takroriy promptlar uchun 90% gacha chegirma beradi.
*   **Semantic Caching:** Agar foydalanuvchi "Mening balansim qancha?" deb so‘rasa va 1 daqiqadan keyin "Hisobimda qancha pul bor?" desa, modelni chaqirmasdan, keshdan oldingi javobni qaytaring.

### 4. Model Routing (Modelni Yo'naltirish)
Hamma ish uchun eng aqlli (va qimmat) model shart emas.
*   **Strategiya:** Tizimingizga "Router" o‘rnating.
    *   Oddiy savollar (salomlashish, ma'lumot chiqarish) $\rightarrow$ **Arzon model** (GPT-4o-mini, Haiku).
    *   Murakkab tahlil (kod yozish, strategiya) $\rightarrow$ **Kuchli model** (GPT-4o, Claude 3.5 Sonnet).
*   Bu usul xarajatlarni keskin kamaytiradi va tizim tezligini oshiradi.

***

**Xulosa:** Token optimizatsiyasi — bu shunchaki pul tejash emas, balki agentni tezroq va aniqroq ishlashga majburlashdir.