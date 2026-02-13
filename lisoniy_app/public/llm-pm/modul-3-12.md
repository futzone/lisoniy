**3.12-mavzu: Defining Skills (Skillni aniqlash va qadoqlash)** bo‘yicha amaliy dars materiali.

Skill (yoki Tool) — bu AI agentining "qo‘llari". Busiz model faqat matn generatori bo‘lib qoladi. Skill orqali agent tashqi dunyodagi ma'lumotlarni o‘qishi, API chaqirishi va kod bajarishi mumkin.

***

# 3.12. Defining Skills: Skill Nima va Uni Qanday Qadoqlash Kerak?

Agar Prompt Engineering — bu AIning "miyasi" bilan ishlash bo'lsa, Skill Definition — bu unga "qo'l-oyoq" o'rnatishdir. 2025-yilgi standartlarda Skill shunchaki kod parchasi emas, balki **"Tavsif + Kod + Schema"** kombinatsiyasidir.

## 1. Skill Arxitekturasi (Anatomy of a Tool)

Har qanday Skill model tushunadigan aniq interfeysga ega bo'lishi kerak. Samarali Skill quyidagi 4 elementdan iborat bo'ladi,:

1.  **Name (Nom):** Qisqa va aniq bo'lishi shart (masalan, `getQuarterlyRevenue`).
2.  **Description (Tavsif):** Bu eng muhim qism. Model vositani qachon ishlatishni aynan shu yerdan bilib oladi.
    *   *Yomon:* "Ma'lumot oladi."
    *   *Yaxshi:* "Mintaqa (EMEA/APAC) va chorak (2024-Q3) bo'yicha daromad hisobotini JSON formatida yuklaydi.".
3.  **Parameters (Schema):** Funksiya qabul qiladigan argumentlar (JSON Schema formatida). Masalan, `region: string`, `year: integer`.
4.  **Error Handling (Xatolar):** Agar API ishlamasa, agentga qanday xabar qaytishi kerakligi.

---

## 2. Skill Turlari va Qadoqlash

Agentlar uchun Skillarni 3 xil usulda "qadoqlash" mumkin:

### A. Python/Code Function Skills
Oddiy dasturlash funksiyalarini agentga ulash.
*   **Qanday ishlaydi:** Siz Python funksiyasini yozasiz va uni `@tool` dekoratori bilan belgilaysiz. Agent funksiya nomini va argumentlarini JSON formatida qaytaradi, tizim esa uni bajarib, natijani matn sifatida agentga qaytaradi.
*   **Misol:**
    ```python
    @tool
    def calculate_growth(current: float, previous: float):
        """Daromadning o'sish foizini hisoblaydi. Kirish raqamlarda bo'lishi kerak."""
        return ((current - previous) / previous) * 100
    ```

### B. API Skills (OpenAPI / Swagger)
Tashqi servislarni (Jira, Stripe, GitHub) ulash.
*   **Usul:** Agentga to'g'ridan-to'g'ri API hujjatini (OpenAPI Spec) berasiz. Agent bu hujjatni o'qib, qaysi endpointga qanday so'rov yuborishni o'zi hal qiladi.
*   **Muhim:** Xavfsizlik uchun faqat `read-only` (faqat o'qish) huquqini berish yoki har bir muhim amal (masalan, pul o'tkazish) oldidan inson tasdig'ini so'rash (Human-in-the-Loop) kerak.

### C. Knowledge Skills (Hujjatlar Skill sifatida)
RAG tizimini ham "Skill" sifatida qadoqlash mumkin.
*   **Ssenariy:** Agent hamma narsani bilishi shart emas. Unga "HR Siyosati bo'yicha Qidiruv" degan skill bering.
*   **Logika:** Agar foydalanuvchi "Ta'til qanday olinadi?" deb so'rasa, agent o'z xotirasidan javob qidirib o'tirmaydi, balki `search_hr_policy(query="vacation")` vositasini chaqiradi.

---

## 3. Tool Documentation: Eng Katta Xato

Ko'p muhandislar kodni zo'r yozadi, lekin uning tavsifini (docstring) e'tiborsiz qoldiradi. **AI uchun kodning o'zi emas, uning tavsifi muhimroqdir.**

Anthropic tadqiqotlariga ko'ra, tavsifdagi noaniqlik agentning noto'g'ri vositani tanlashiga yoki argumentlarni "to'qib chiqarishiga" (hallucination) olib keladi.

**Oltin Qoida:** Tavsifni xuddi yosh stajyorga ish tushuntirayotgandek yozing:
*   Vositani **qachon** ishlatish kerak?
*   Qachon **ishlatmaslik** kerak?
*   Kutilayotgan format qanaqa?.

---

## 4. Model Context Protocol (MCP) — Yangi Standart

Hozirda har bir platforma (OpenAI, Anthropic, LangChain) o'ziga xos skill ulash usuliga ega. **Model Context Protocol (MCP)** bu muammoni yechish uchun ishlab chiqilgan yagona standartdir.
*   MCP serverlari orqali siz bir marta yozilgan Skillni (masalan, Google Drive ulanishi) istalgan agent platformasida qayta ishlatishingiz mumkin,.

---

**Xulosa:** Skill — bu agentning atrof-muhitga ta'sir o'tkazish interfeysi. Uni yaratishda "Python kodi"dan ko'ra "Aniq Tavsif (Prompt Engineering for Tools)" muhimroq rol o'ynaydi.

