**3.13-mavzu: Model Context Protocol (MCP) va Dynamic Tool Selection** bo‘yicha dars materiali. Bu mavzu agentlarni "o‘ta yuklanishdan" (overload) saqlash va ularni minglab vositalar bilan ishlashga o‘rgatish haqida.

***

# 3.13. Model Context Protocol (MCP) va Dynamic Tool Selection

Agentga 5-10 ta skill (vosita) berish oson. Lekin Enterprise darajasidagi tizimlarda yuzlab, hatto minglab vositalar (Jira, GitHub, CRM, SQL) bo'lishi mumkin. Agar hammasini birdaniga promptga joylasangiz, **"Context Window"** to'lib ketadi va model adashishni boshlaydi.

Bu muammoni yechish uchun **MCP (Standartlashtirish)** va **Dynamic Selection (Aqlli tanlash)** ishlatiladi.

---

## 1. Model Context Protocol (MCP) Nima?

Hozirda har bir AI integratsiyasi (Google Drive, Slack va h.k.) alohida kod yozishni talab qiladi. **MCP** — bu AI modellari va tashqi vositalar o'rtasidagi **universal ochiq standartdir**.

*   **Muammo:** Har bir yangi ma'lumot manbasi (Data Source) uchun alohida "adapter" yozish kerak.
*   **MCP Yechimi:** "Bir marta yoz, hamma joyda ishlat." MCP serveri ma'lumotlarni (masalan, fayllar, loglar) yoki vositalarni (API chaqiruvlar) standart formatda taqdim etadi. Agentlar bu standart orqali istalgan tizimga ulanadi.

**Amaliy foydasi:** Siz "GitHub MCP Server"ini ishga tushirasiz va u avtomatik ravishda agentga repozitoriylarni o'qish, "commit" qilish va "issue" ochish qobiliyatlarini (skills) taqdim etadi.

---

## 2. Dynamic Tool Selection (Dinamik Vosita Tanlash)

Agar sizda 100 ta vosita bo'lsa, ularni hammasini kontekstga tiqmang. Modelga faqat **ayni shu on uchun** keraklilarini bering. Bu jarayon **"Just-in-Time Tool Loading"** deb ataladi.

### A. Retrieval-Based Selection (Qidiruv orqali tanlash)
Bu usulda vositalar ta'rifi (description) vektor bazasida saqlanadi.
1.  **Foydalanuvchi:** "O'tgan oygi savdo hisobotini ko'rsat."
2.  **Tizim (Retriever):** Savolga aloqador vositalarni qidiradi (masalan, `get_sales_report`, `list_invoices`).
3.  **Context:** Modelga faqat topilgan 2-3 ta vosita taqdim etiladi. Qolgan 97 tasi yashirin qoladi.
*   **Natija:** Tokenlar tejaladi va modelning aniqligi oshadi.

### B. Hierarchical Discovery (Ierarxik Aniqlash)
Katta tizimlar uchun **"Progressive Discovery"** (Bosqichma-bosqich ochish) usuli qo'llaniladi. Agentni "Menyular bo'ylab yurishga" o'rgatasiz.
1.  **1-qadam (Kategoriya):** Agent avval kategoriyani tanlaydi (masalan, "Jira", "GitHub" yoki "Notion").
2.  **2-qadam (Xizmat):** "GitHub" tanlangach, faqat unga tegishli "Pull Request" yoki "Issue" bo'limlari ochiladi.
3.  **3-qadam (Harakat):** Faqat `get_pull_request` vositasi yuklanadi.
*   Ushbu usul GPT-5.2 kabi modellarda aniqlikni **15% gacha oshirishi** kuzatilgan.

---

## 3. Strategik Tavsiyalar

1.  **Tavsif (Description) — Kalit:** Dinamik tanlash to'g'ri ishlashi uchun har bir skillning ta'rifi aniq va qidiruvbop (searchable) bo'lishi kerak.
2.  **Kichik Guruhlar:** Agentga bir vaqtning o'zida **5 tadan ko'p** vosita bermaslikka harakat qiling.
3.  **Human-in-the-Loop:** Agar agent "Delete Database" kabi xavfli vositani tanlasa, avtomatik ravishda inson tasdig'ini so'rash mexanizmini qo'shing.
