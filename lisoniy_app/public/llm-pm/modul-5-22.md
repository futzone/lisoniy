**5.22-mavzu: Automating Routine Tasks (Rutina vazifalarni avtomatlashtirish)** bo‘yicha amaliy dars. Bu loyiha boshqaruvidagi "past qiymatli, lekin ko‘p vaqt oladigan" ishlarni agentlarga topshirishning eng tezkor usulidir.

***

# 5.22. Automating Routine Tasks: Standuplar, Hisobotlar va Bayonnomalar

Loyiha menejerlari vaqtimizning taxminan 40-50 foizini ma'lumot qidirish, status yangilash va yig'ilish bayonnomalarini yozishga sarflaymiz. Agentic AI bu jarayonni **"Active Creation"** (yozish) dan **"Active Review"** (tasdiqlash) ga o‘zgartiradi.

Quyida 3 ta asosiy yo‘nalish bo‘yicha agentlarni qanday qo‘llash mumkinligi keltirilgan:

### 1. Smart Standups (Aqlli Standuplar)
An'anaviy "Zoom orqali har kuni 15 daqiqa" usuli o‘rniga, agentlar **asinxron** standuplarni boshqaradi.

*   **Workflow:**
    1.  **Collection:** Jamoa a'zolari o‘z ishlarini Slack yoki Loom (video) orqali yozib qoldiradilar.
    2.  **Processing:** **Loom AI** videolardan "filler words" (mmm, aaa) larni olib tashlaydi, sarlavha qo‘yadi va qisqacha mazmunini yozadi,.
    3.  **Synthesis:** Agent barcha yangilanishlarni yig‘ib, "Daily Digest" (Kunlik Xulosa) tayyorlaydi va rahbarlarga: *"Bugun 3 ta to‘siq (blocker) bor, Frontend jamoasi orqada qolmoqda,"* deb xabar beradi.
*   **Foydasi:** Uchrashuv vaqti tejaladi va muammolar real vaqtda aniqlanadi.

### 2. Meeting Notes & Action Items (Uchrashuv Bayonnomalari)
Oddiy transkripsiya (so‘zma-so‘z yozish) yetarli emas. Bizga **ijrochi agent** kerak.

*   **Transkripsiya emas, Harakat:** Microsoft Copilot yoki **Atlassian Rovo** uchrashuvni tinglaydi va shunchaki matn yozmaydi, balki:
    *   **Qarorlarni ajratadi:** "Dizayn V2 tasdiqlandi."
    *   **Vazifa yaratadi:** *"Doston, ertagacha API hujjatini yangilang"* gapini eshitib, Jira yoki Asana-da avtomatik **ticket** yaratadi va Dostonga assign qiladi,.
*   **Contextual Summaries:** Agar siz uchrashuvga kechiksangiz, agentdan *"Oxirgi 10 daqiqada mening ismim tilga olindimi?"* yoki *"Qanday qarorlar qabul qilindi?"* deb so‘rashingiz mumkin.

### 3. Automated Reporting (Avtomatlashtirilgan Hisobotlar)
Hisobot yozish — eng zerikarli ish. Agentlar buni **ma'lumotlar bazasiga to‘g‘ridan-to‘g‘ri ulanish** orqali hal qiladi.

*   **Data-Driven Agents:** Masalan, **Monday.com** yoki **Wrike** dagi agentlar loyiha statusini o‘zlari yangilaydi. Ular "Risk Detection" (Xatarni aniqlash) qobiliyatiga ega bo‘lib, *"Loyiha byudjeti 85% ga yetdi, lekin ishning faqat 60% bajarildi"* degan ogohlantiruvchi hisobotlarni avtomatik generatsiya qiladi,.
*   **Protocol 29 (Stakeholder-Specific Views):** Bitta hisobot hamma uchun to‘g‘ri kelmaydi. Agentga quyidagicha buyruq bering:
    *   *"Ushbu ma'lumotlardan foydalanib, 3 xil hisobot tayyorla:
        1. **Muhandislar uchun:** Texnik detallar va kod sifati haqida.
        2. **Rahbariyat uchun:** Biznes natijalari va ROI haqida qisqacha (100 so‘z).
        3. **Mijoz uchun:** Yutuqlar va keyingi qadamlar."*.

---

### Amaliy Tavsiya: Qayerdan boshlash kerak?

1.  **Jira/Confluence:** **Atlassian Rovo** ni yoqing. U ticketlardagi yuzlab kommentariylarni bitta paragrafga qisqartirib beradi va tabiiy tildagi so‘rovlarni (masalan, "Mening ochiq vazifalarimni ko‘rsat") JQL kodiga aylantiradi,.
2.  **Video Xabarlar:** **Loom AI** dan foydalanib, videolarni avtomatik hujjatga aylantiring (video to text workflow).
3.  **Custom Workflow:** Agar sizda maxsus jarayon bo‘lsa, **n8n** yoki **Zapier Central** orqali oddiy "Slack $\rightarrow$ Summarizer Agent $\rightarrow$ Email Report" zanjirini quring,.
