**2-Modul: Context Engineering** bo‘yicha kirish darsi. Bu modul AIni shunchaki "gapiradigan bot"dan "xotiraga ega aqlli tizim"ga aylantirishning fundamental asosidir.

***

# 2-Modul: Context Engineering (AI Xotirasi va Bilim Bazasi)

## 2.1. Kirish: Context Engineering nima va u nega muhim?

Prompt Engineering — bu modelga **"qanday"** savol berish san'ati bo'lsa, Context Engineering — bu model **"nimalarni bilishi kerakligini"** boshqarish muhandisligidir.

Zamonaviy AI tizimlarida (masalan, Agentlar yoki RAG) muvaffaqiyatning 90% i modelning qanchalik kuchli ekanligiga emas, balki uning **Context Window (Kontekst Oynasi)** qanchalik to'g'ri to'ldirilganiga bog'liq.

### 🧠 Mental Model: CPU va RAM
Andrej Karpathy (OpenAI asoschilaridan biri) aytganidek:
*   **LLM (Model):** Bu **Markaziy Protsessor (CPU)**. U hisoblaydi, mantiqiy fikrlaydi, lekin o'zida doimiy xotira saqlamaydi.
*   **Context Window:** Bu **Tezkor Xotira (RAM)**. Model faqat shu oynadagi ma'lumotlarni "ko'ra oladi".
*   **Context Engineering:** Bu operatsion tizim bo'lib, cheklangan RAMga aynan kerakli fayllarni yuklash va keraksizlarini o'chirishni boshqaradi.

---

## 2.2. "Context Window" Muammolari

Nega biz shunchaki barcha hujjatlarni modelga tashlab qo'ya qolmaymiz?

1.  **Context Rot (Kontekstning Chirishi):** Modelga qancha ko'p ma'lumot bersangiz, uning "diqqati" shunchalik sochilib ketadi.
2.  **"Lost in the Middle" Fenomeni:** LLMlar kontekstning boshi va oxiridagi ma'lumotni yaxshi eslab qoladi, lekin o'rtadagi ma'lumotlarni ko'pincha "unutib qo'yadi" yoki e'tiborsiz qoldiradi.
3.  **Xarajat va Latency:** Har bir token pul turadi va javobni sekinlashtiradi. 50,000 tokenlik kontekstni qayta ishlash bir necha soniya olishi va qimmatga tushishi mumkin.
4.  **Context Poisoning (Zaharlanish):** Noto'g'ri yoki eski ma'lumotlarning kontekstga kirib qolishi modelni gallyutsinatsiya qilishga majbur qiladi.

---

## 2.3. Context Engineeringning 4 Ustuni (The 4 Pillars)

Samarali tizim qurish uchun quyidagi 4 ta strategiyadan foydalaniladi:

### 1. Write (Yozish va Saqlash)
Ma'lumotlarni kontekst oynasidan tashqariga chiqarib, doimiy xotiraga yozish.
*   **Long-term Memory:** Vektorli ma'lumotlar bazasi (Vector DB) yoki fayllar.
*   **Episodic Memory:** O'tgan suhbatlar va tajribalarni saqlash.

### 2. Select / Read (Tanlash va Yuklash)
Aynan kerakli paytda kerakli ma'lumotni "RAM"ga yuklash (Retrieval).
*   **RAG (Retrieval-Augmented Generation):** Savolga aloqador hujjatlarni qidirib topish.
*   **Filtering:** Modelni chalg'itmaslik uchun keraksiz "shovqin"ni olib tashlash.

### 3. Compress (Siqish va Umumlashtirish)
Katta hajmdagi ma'lumotni ma'nosini yo'qotmagan holda kichraytirish.
*   **Summarization:** 50 ta xabarni bitta qisqa xulosaga aylantirish.
*   **Pruning:** Eskirgan yoki ahamiyatsiz tokenlarni "qirqib tashlash".

### 4. Isolate (Izolyatsiya qilish)
Kontekstni bo'laklarga ajratish.
*   **Multi-Agent:** Har bir agent faqat o'ziga kerakli kontekstni ko'radi (masalan, "Kod yozuvchi" agentga marketing hujjatlari kerak emas).

---

## 2.4. Xotira Turlari (Cognitive Architecture)

Context Engineeringda biz inson xotirasi modellaridan nusxa olamiz:

| Xotira Turi | Vazifasi | Texnik Yechim |
| :--- | :--- | :--- |
| **Short-term Memory** | Hozirgi suhbat oqimini ushlab turish. | Context Window (RAM). |
| **Episodic Memory** | O'tmishdagi voqealar va xatolardan saboq olish. | Logs, Vector Store. |
| **Semantic Memory** | Faktlar va bilimlar (masalan, kompaniya siyosati). | Knowledge Graph, Documents. |
| **Procedural Memory** | Vazifani qanday bajarish bo'yicha ko'rsatmalar. | System Prompts, Tools. |

---

## 2.5. Xulosa

Context Engineering — bu **"Kamroq narsa — bu ko'proq narsa" (Less is More)** tamoyiliga asoslanadi. Sizning maqsadingiz modelni ma'lumotga ko'mib tashlash emas, balki unga **"oltin kontekst" (gold context)** — ya'ni vazifani hal qilish uchun yetarli bo'lgan eng minimal va eng aniq ma'lumotni yetkazib berishdir.