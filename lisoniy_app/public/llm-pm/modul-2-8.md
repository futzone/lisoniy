**2.8-mavzu: Chunking Strategies** (Hujjatlarni bo'laklash strategiyalari) bo'yicha to'liq dars materiali. RAG tizimining sifati ko'pincha modelga emas, balki ma'lumot qanday bo'laklanganiga bog'liq. Agar siz noto'g'ri kesilgan matnni qidirsangiz, eng aqlli model ham to'g'ri javob berolmaydi.

***

# 2.8. Chunking Strategies: Hujjatlarni Bo'laklash Usullari

Chunking — bu katta hujjatlarni LLM qabul qila oladigan va qidiruv tizimi (Retriever) oson topa oladigan kichik bo'laklarga (chunks) ajratish jarayonidir. Asosiy maqsad: **Semantik butunlikni saqlagan holda eng kichik ma'noli birlikni yaratish**.

Biz eng asosiy 3 ta strategiya va 2025-yilning yangi "Late Chunking" usulini ko'rib chiqamiz.

---

## 1. Fixed-Size Chunking (Sabit O'lchamli Bo'laklash)
Bu eng oddiy va arzon usul. Matnni belgilangan token yoki belgilar soniga (masalan, 512 token) qarab "mexanik" ravishda bo'ladi.

*   **Qanday ishlaydi:** Matnni har 500 so'zda kesadi. Matn kesilib qolmasligi uchun **Overlap** (ustma-ust tushish, masalan, 50 token) qo'shiladi.
*   **Afzalligi:** Juda tez va oddiy.
*   **Kamchiligi:** Semantikani hisobga olmaydi. Bir jumla yoki fikrning yarmi birinchi bo'lakda, yarmi ikkinchisida qolib ketishi mumkin, bu esa qidiruv aniqligini tushiradi.

## 2. Recursive Chunking (Rekursiv Bo'laklash)
Bu ko'pchilik RAG tizimlari uchun "oltin o'rtalik" (default) hisoblanadi. U matnning tabiiy tuzilishini (paragraf, jumla) saqlashga harakat qiladi.

*   **Qanday ishlaydi:** Tizim avval matnni katta ajratuvchilar (masalan, `\n\n` - yangi paragraf) bo'yicha bo'lishga urinadi. Agar bo'lak hali ham katta bo'lsa, keyingi darajaga o'tadi (`\n` - yangi qator, keyin `.` - nuqta/jumla).
*   **Natija:** Bir-biriga bog'liq jumlalar bitta bo'lakda qoladi.

## 3. Semantic Chunking (Semantik Bo'laklash)
Bu usul matnning ma'nosiga qarab bo'laklaydi. Agar matnda mavzu o'zgarsa, yangi chunk boshlanadi.

*   **Qanday ishlaydi:** Har bir jumla vektorga aylantiriladi (embedding). Tizim yonma-yon turgan jumlalarning o'xshashligini o'lchaydi. Agar o'xshashlik keskin tushib ketsa (mavzu o'zgarsa), o'sha joydan "kesadi".
*   **Afzalligi:** Qidiruv uchun eng aniq usul, chunki har bir bo'lak bitta tugallangan fikrni ifodalaydi.
*   **Kamchiligi:** Hisoblash uchun qimmat (GPU talab qiladi) va sekinroq.

## 4. Late Chunking (Kechikuvchi Bo'laklash — Advanced)
Bu 2024-2025 yillarda paydo bo'lgan yangi yondashuv (Jina AI tomonidan ommalashtirilgan). An'anaviy (Naive) chunkingdagi "kontekst yo'qolishi" muammosini hal qiladi.

*   **Muammo:** Oddiy chunkingda "U shaharni tark etdi" degan jumla alohida bo'lakka tushsa, "U" kimligi (masalan, Napoleon) oldingi bo'lakda qolib ketadi va qidiruv tizimi buni topolmaydi.
*   **Late Chunking yechimi:** Model avval **butun hujjatni** o'qiydi va har bir so'zning vektorini kontekst asosida yaratadi (contextualized embeddings). Shundan **keyingina** vektorlarni bo'laklarga ajratadi. Natijada, "U" so'zining vektori o'z ichida "Napoleon" ma'nosini tasiydi.

---

## 5. Qidiruv Aniqligiga Ta'siri (Trade-offs)

Chunk o'lchami va strategiyasi qidiruv natijasiga bevosita ta'sir qiladi:

| O'lcham / Strategiya | Qidiruv (Retrieval) | Javob Sifati (Generation) | Muammo |
| :--- | :--- | :--- | :--- |
| **Kichik Chunk** (128 token) | **Yuqori aniqlik.** Aniq faktni topish oson. | Past. Modelga kontekst yetishmaydi. | Javob quruq yoki tushunarsiz bo'lishi mumkin. |
| **Katta Chunk** (1024+ token) | Pastroq. Ko'p ortiqcha ma'lumot (shovqin) kirib qoladi. | **Yaxshi.** Modelda to'liq kontekst bor. | "Lost in the Middle" fenomeni; qimmatroq. |
| **Semantic / Late** | **Balanslashgan.** Ma'no va kontekst saqlanadi. | Yuqori. | Implementatsiya qilish qiyinroq. |

**Xulosa:**
*   Oddiy loyihalar uchun: **Recursive Chunking** (512 token, 50 overlap).
*   Murakkab, semantik bog'liqlik muhim bo'lgan loyihalar uchun: **Late Chunking** yoki **Semantic Chunking**.

