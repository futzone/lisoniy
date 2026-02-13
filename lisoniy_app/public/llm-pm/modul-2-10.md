**2.10-mavzu: Information Isolation (Axborotni Izolyatsiya Qilish)** bo‘yicha amaliy va xavfsizlikka yo‘naltirilgan dars materiali. Bu mavzu Enterprise darajasidagi AI tizimlari uchun eng kritik qismlardan biridir.

***

# 2.10. Information Isolation: Maxfiy va Umumiy Kontekstlarni Ajratish

Context Engineering nafaqat modelga ma'lumot berish, balki undan **nimalarni yashirish** kerakligini ham boshqarishdir. Agar bitta "Super Agent"ga hamma narsani (HR ma'lumotlari, kodlar bazasi, moliyaviy hisobotlar) yuklasangiz, bu xavfsizlik va aniqlik bo'yicha halokatga olib keladi.

**Information Isolation (Axborot Izolyatsiyasi)** — bu turli xil maxfiylik darajasiga ega ma'lumotlarni alohida "kontekst konteynerlari"da saqlash va ular o'rtasida qat'iy chegaralar o'rnatish amaliyotidir.

---

## 1. Nega Izolyatsiya Kerak? (Security & Performance)

1.  **Xavfsizlik (Data Leakage):** Agar foydalanuvchi A "Mening maoshim qancha?" deb so'rasa, agent noto'g'ri izolyatsiya tufayli foydalanuvchi B ning maoshini ko'rsatib yuborishi mumkin.
2.  **Context Pollution (Kontekstning ifloslanishi):** Keraksiz maxfiy ma'lumotlar modelni chalg'itadi. Masalan, kod yozuvchi agentga marketing strategiyasini berish foydasiz va xavfli.
3.  **Prompt Injection himoyasi:** Agar tajovuzkor agentni "buzsa" (jailbreak), izolyatsiya qilingan tizimda u faqat o'sha agentga tegishli tor doiradagi ma'lumotni o'g'irlay oladi, butun tizimni emas.

---

## 2. Izolyatsiya Strategiyalari (Architecture Patterns)

Biz 3 ta asosiy izolyatsiya darajasidan foydalanamiz:

### A. User-Level Isolation (Foydalanuvchi darajasida)
Har bir foydalanuvchi sessiyasi mutlaqo ajratilgan bo'lishi shart.
*   **Session Namespacing:** Har bir xotira (Memory) va RAG qidiruvi `user_id` yoki `tenant_id` bilan filtrlanishi kerak. Agent ma'lumotlar bazasidan `SELECT * FROM docs` emas, `SELECT * FROM docs WHERE user_id = '123'` deb so'rashi shart.
*   **Ephemeral State:** Sessiya tugashi bilan, vaqtinchalik "short-term memory" (RAM) tozalanib ketishi kerak, hech qanday holat (state) boshqa foydalanuvchiga o'tmasligi lozim.

### B. Agent-Level Isolation (Multi-Agent Partitioning)
Bitta katta model o'rniga, vazifalarni tor ixtisoslashgan kichik agentlarga bo'lib tashlang va har biriga faqat o'ziga kerakli kontekstni bering.

*   **Misol:**
    *   **Billing Agent:** Faqat to'lovlar tarixini ko'radi. (Kodlarni ko'ra olmaydi).
    *   **Coder Agent:** Faqat GitHub repozitoriysini ko'radi. (Foydalanuvchi billing ma'lumotini ko'ra olmaydi).
    *   **Router (Boshqaruvchi):** Foydalanuvchi savolini tahlil qiladi va tegishli agentga yo'naltiradi, lekin o'zi hech qanday maxfiy ma'lumotni ushlab turmaydi.

### C. Environment Isolation (Muhit darajasida)
Kod bajarish (Code Execution) yoki xavfli vositalarni ishlatish uchun "Sandbox"lardan foydalanish.
*   **Sandboxing:** Agar agent Python kodini ishlatishi kerak bo'lsa (masalan, ma'lumotlarni tahlil qilish uchun), bu kod asosiy serverda emas, balki izolyatsiya qilingan Docker konteynerda yoki `E2B` kabi xavfsiz muhitda bajarilishi kerak. Natija (output) qaytib keladi, lekin kod asosiy fayl tizimiga kira olmaydi,.

---

## 3. Least Privilege Principle (Eng Kam Huquq Tamoyili)

Bu 2026-yilgi "Identity Governance" standartidir. Agentlarga doimiy "Admin" huquqini bermang,.

*   **Just-in-Time (JIT) Access:** Agentga ma'lumotlar bazasiga kirish huquqini faqat kerakli paytda va qisqa muddatga (masalan, 5 daqiqaga) bering. Vazifa tugagach, huquq bekor qilinadi.
*   **Scope-Limited Tokens:** Agentga berilgan API kalit faqat `read-only` (faqat o'qish) bo'lishi yoki faqat ma'lum jadvallarga ruxsat berishi kerak.

---

## 4. Amaliy Arxitektura: Secure RAG

Maxfiy hujjatlar bilan ishlashda "Information Isolation"ni qanday qo'llash mumkin?

1.  **Access Control List (ACL) Filter:** RAG tizimi hujjatlarni qidirishdan oldin, foydalanuvchining huquqlarini tekshiradi.
    *   *Query:* "CEO maoshi qancha?"
    *   *Filter:* `role == 'intern'`.
    *   *Retriever:* Bu so'rov uchun "Executive Docs" papkasidan qidirishni bloklaydi.
2.  **PII Redaction (Shaxsiy ma'lumotlarni tozalash):** Modelga kontekst yuborishdan oldin, undagi shaxsiy ma'lumotlar (telefon, email, ism) "Pre-processing" bosqichida niqoblanadi (masking),.

---

## Xulosa

*   **Hamma narsani yuklamang:** Izolyatsiya — bu kontekstni toza va xavfsiz saqlash garovidir.
*   **Bo'lib tashlang va boshqaring:** Multi-agent tizimlar nafaqat sifat, balki xavfsizlik uchun ham zarur.
*   **Kontekst — bu imtiyoz:** Har bir token modelga berilishidan oldin "Bu agent buni bilishi shartmi?" degan savoldan o'tishi kerak.

