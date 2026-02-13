**6.28-mavzu: Hallucination Guardrails (Gallyutsinatsiya va Yolg‘onni Aniqlash)** bo‘yicha amaliy dars.

Agentlar shunchaki "noto‘g‘ri gapirishi" emas, balki "noto‘g‘ri harakat qilishi" ham mumkin (masalan, yo‘q API’ni chaqirish yoki noto‘g‘ri hisob-kitob qilish). Guardrails (To‘siqlar) — bu agentlarni haqiqat doirasida ushlab turuvchi xavfsizlik kamaridir.

***

# 6.28. Hallucination Guardrails: AI Yolg‘onini Aniqlash va Oldini Olish

Agent tizimlarida gallyutsinatsiya 5 xil ko‘rinishda bo‘ladi: **Mantiqiy** (noto‘g‘ri reja), **Ijro** (yo‘q vositani chaqirish), **Xotira** (eski ma’lumotni ishlatish), **Qabul qilish** (noto‘g‘ri o‘qish) va **Muloqot** (agentlar o‘rtasida noto‘g‘ri ma’lumot uzatish),.

Bularni to‘xtatish uchun biz **"3-Qavatli Himoya" (Defense-in-Depth)** strategiyasini qo‘llaymiz.

### 1. Grounding Layer (Asoslash Qatlami)
Agentni o‘z "xotirasiga" (training data) emas, balki aniq, tashqi manbalarga tayanishga majbur qiling.
*   **RAG (Retrieval-Augmented Generation):** Agent javob berishdan oldin kompaniya hujjatlarini qidirishi va javobni *faqat* shu hujjatlarga asoslashi shart,.
*   **Citation Requirement (Manba ko‘rsatish):** Agentga shunday buyruq bering: *"Har bir da’vong uchun aniq manba (fayl nomi va sahifasi) keltir. Agar manba bo‘lmasa, 'Bilmayman' deb javob ber."* Tadqiqotlar shuni ko‘rsatadiki, manba talab qilish gallyutsinatsiyani sezilarli kamaytiradi.

### 2. Validation Layer (Tekshirish Qatlami)
Agent o‘z ishini o‘zi yoki boshqa agent yordamida tekshiradi.
*   **Self-Correction Loop:** Agentga javobni darhol chiqarishga ruxsat bermang. Uni quyidagi siklga qo‘ying:
    1.  *Draft:* Javob yozish.
    2.  *Critique:* "Bu javob berilgan kontekstga mosmi? Raqamlar to‘g‘rimi?" deb o‘zini tekshirish.
    3.  *Final:* Tuzatilgan javobni chiqarish,.
*   **Validator Agent (Auditor):** Alohida, juda qattiqqo‘l agent yarating. Uning vazifasi — asosiy agentning ishidagi xatolarni topish. Agar Validator "Tasdiqlandi" demasa, javob foydalanuvchiga ko‘rsatilmaydi.

### 3. Technical Guardrails (Texnik To‘siqlar)
Kod darajasida o‘rnatiladigan qat'iy cheklovlar.
*   **Input/Output Validation:** Pydantic yoki JSON Schema orqali agentning chiqishini tekshiring. Agar agent raqam o‘rniga matn qaytarsa yoki schema buzilsa, tizim avtomatik ravishda xato beradi va agentdan qayta ishlashni so‘raydi,.
*   **Regex & Blacklists:** Agar agent javobida taqiqlangan so‘zlar yoki shubhali patternlar (masalan, soxta URLlar) aniqlansa, javob bloklanadi.

---

### Amaliy Tavsiya: "Ishonch"ni O‘lchash (Confidence Scoring)
Agentdan shunchaki javobni emas, balki **"Ishonch Darajasi" (Confidence Score)**ni ham so‘rang.
*   **Prompt:** *"Javobingni 0 dan 10 gacha bahola. Agar ishonching 7 dan past bo‘lsa, qo‘shimcha ma’lumot so‘ra."*
*   Bu usul agentni noaniq vaziyatlarda tavakkal qilishdan qaytaradi.

***

**Xulosa:** Gallyutsinatsiyani 100% yo‘qotib bo‘lmaydi, lekin Guardrails orqali uning ta’sirini minimallashtirish va "khalokatli" xatolarning oldini olish mumkin.
