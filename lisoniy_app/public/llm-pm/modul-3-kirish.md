**3-Modul: Skills & Tool Use** bo‘yicha kirish darsi. Bu modulda biz AIni shunchaki matn yozuvchi "kotib"dan, real ishlarni bajaruvchi "ijrochi"ga aylantiramiz.

***

# 3-Modul: Skills & Tool Use (AI "Qo'llari" va Vositalari)

## 3.1. Kirish: Generative AI dan Agentic AI ga o'tish

Oldingi modullarda (Prompt va Context) biz AIning "miyasi" va "xotirasi" bilan ishladik. Endi esa unga **"qo'l"** beramiz.

**Asosiy farq:**
*   **Generative AI (Chatbot):** Siz: "Marketing rejasi tuz." $\rightarrow$ AI: Matn yozib beradi. (Ishni baribir o'zingiz qilasiz).
*   **Agentic AI (Agent):** Siz: "Marketing kampaniyasini ishga tushir." $\rightarrow$ AI: Reja tuzadi, e-mail yuboradi, reklamani joylaydi va natijani tahlil qiladi.

Agentic AI — bu tashqi muhitni idrok eta oladigan, qaror qabul qiladigan va belgilangan maqsadga erishish uchun vositalardan (Tools) foydalanadigan tizimdir.

---

## 3.2. Skill va Tool Nima?

Texnik tilda **"Skill"** yoki **"Tool"** — bu AI chaqira oladigan funksiya, API yoki skriptdir. AI bu vositalardan foydalanib, o'zining "xom" bilimlaridan tashqaridagi ishlarni bajaradi.

Asosiy vosita turlari:
1.  **Data Tools (O'qish):** Ma'lumot olish uchun. (Masalan: `Google Search`, `SQL Query`, `Read File`).
2.  **Action Tools (Bajarish):** Tizimda o'zgarish qilish uchun. (Masalan: `Send Email`, `Update CRM`, `Git Commit`).
3.  **Compute Tools (Hisoblash):** AIning zaif tomonlarini yopish uchun. (Masalan: `Calculator`, `Python Interpreter`).

> **Misol:** Oddiy LLM 4923 * 2932 ni xato hisoblashi mumkin. Lekin unga "Kalkulyator" vositasi berilsa, u matematikani o'zi qilmaydi, balki `Calculator.multiply(4923, 2932)` funksiyasini chaqiradi va aniq javob oladi.

---

## 3.3. Tooling Strategy: Muvaffaqiyat Kaliti

Agentlar samarali ishlashi uchun shunchaki kod yozish yetarli emas. Siz vositani AIga qanday **ta'riflashingiz** (Definition) hal qiluvchi ahamiyatga ega.

Agar vosita tavsifi noaniq bo'lsa, agent uni noto'g'ri ishlatadi yoki umuman ishlatmaydi.
*   **Yomon tavsif:** "Ma'lumot oladi."
*   **Yaxshi tavsif:** "Foydalanuvchi ID raqami asosida oxirgi 3 oylik to'lovlar tarixini CRM tizimidan yuklab oladi. Kirish parametri: `user_id` (string)".

Ko'p hollarda, agentning "aqlli" ishlashi uning modeliga emas, balki **"Context Engineering" orqali vositalarning qanchalik aniq yozilganiga** bog'liq.

---

## 3.4. Xulosa

Ushbu modulda biz agentlarga quyidagilarni o'rgatamiz:
1.  Tashqi API va tizimlar bilan gaplashish.
2.  Minglab vositalar orasidan keraklisini **dinamik tanlash** (Routing).
3.  Xatolarni tushunish va qayta urinish (Self-correction).

