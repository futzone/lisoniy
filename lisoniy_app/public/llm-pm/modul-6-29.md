**6.29-mavzu: Identity & Governance (Identifikatsiya va Boshqaruv)** bo‘yicha dars materiali.

Agentlar shunchaki dastur emas, ular "raqamli xodimlar"dir. Agar siz ularni nazorat qilmasangiz, kompaniyangizda **"Agent Sprawl"** (Agentlar betartibligi) yuzaga keladi — bu xuddi minglab stajyorlarni ishga olib, ularga cheksiz ruxsat berib, keyin ularni unutib qo‘yishga o‘xshaydi.

***

# 6.29. Identity & Governance: "Agent Sprawl" va Huquqlarni Boshqarish

Tashkilotlarning 82 foizi yaqin kelajakda AI agentlarini integratsiya qilishni rejalashtirmoqda, ammo IT jamoalari ko‘pincha qanday agentlar ishlayotganini va ular qanday ma’lumotlarga kirayotganini bilmaydilar,. Bu **"Shadow AI"** muammosini keltirib chiqaradi.

Ushbu darsda biz agentlarni "Non-Human Identities" (Inson bo‘lmagan shaxslar) sifatida boshqarishni o‘rganamiz.

---

## 1. "Agent Sprawl" (Agentlar Betartibligi) Nima?

Agent Sprawl — bu tashkilotda agentlar soni boshqaruv imkoniyatidan oshib ketishi holatidir. Oqibatlari:
*   **Xavfsizlik bo‘shliqlari:** "Zombi agentlar" (keraksiz bo‘lib qolgan, lekin o‘chirilmagan agentlar) tizimda qolib ketadi va hakerlar uchun ochiq eshik vazifasini o‘taydi.
*   **Resurs isrofi:** Bir xil vazifani bajaruvchi bir nechta agentlar yaratiladi, bu esa token va infratuzilma xarajatlarini oshiradi.
*   **Konfliktlar:** Turli agentlar bir vaqtning o'zida bir xil ma'lumotlar bazasini o'zgartirishga urinishi mumkin.

---

## 2. Agent Identity (Agent Identifikatsiyasi)

An'anaviy tizimlar insonlar uchun yaratilgan (OAuth, SAML), ammo agentlar boshqacha ishlaydi: ular tezkor (ephemeral), avtonom va dinamikdir.

### Asosiy Tamoyillar:
1.  **Unique Identity (Noyob ID):** Har bir agentga xuddi xodim kabi alohida ID va sertifikat bering. Hech qachon umumiy "Admin" API kalitidan foydalanmang.
2.  **Short-Lived Credentials (Qisqa muddatli ruxsatlar):** Agentlar 24/7 ishlaydi, shuning uchun ularning kalitlari (tokens) doimiy bo‘lmasligi kerak. Kalitlar avtomatik ravishda aylanishi (rotation) va tezda eskirishi lozim.
3.  **Context-Aware Access:** Agentga ruxsat faqat uning **kimligi**ga emas, balki **holati**ga qarab beriladi. Masalan, "Faqat ish vaqtida va faqat ofis tarmog'idan kelgan so'rovni qabul qil".

---

## 3. Huquqlarni Boshqarish: JIT va Least Privilege

Agentlarga "hamma narsaga ruxsat" (superadmin) berish eng katta xatodir. Buning o'rniga quyidagi modellarni qo'llang:

### Just-in-Time (JIT) Provisioning
Agentga ruxsatni oldindan emas, faqat kerak bo'lgan paytda bering.
*   **Ssenariy:** Agent ma'lumotlar bazasidan hisobot olishi kerak.
*   **Jarayon:** Agent ruxsat so'raydi $\rightarrow$ Tizim unga 15 daqiqalik vaqtinchalik token beradi $\rightarrow$ Vazifa tugagach, token avtomatik kuyadi,.

### Lifecycle Management (Hayot Sikli Boshqaruvi)
Har bir agent uchun **JML (Joiner-Mover-Leaver)** jarayonini joriy qiling:
1.  **Registration (Tug'ilish):** Agentni markaziy reyestrga (Catalog) kiritish va egasini tayinlash.
2.  **Provisioning (Ishlash):** Vazifasiga mos minimal huquqlar (Least Privilege) berish.
3.  **Teardown (O'lim):** Vazifa tugagach yoki loyiha yopilgach, agentni va uning barcha ruxsatlarini darhol o'chirish. Bu "Zombi agentlar" ko'payishini oldini oladi.

---

## 4. Amaliy Yechim: Markaziy Boshqaruv (Control Plane)

Agentlarni boshqarish uchun markaziy "Boshqaruv minorasi" (Control Tower) kerak.
*   **Central Registry:** Barcha agentlarning ro'yxati, ularning versiyalari va egalari bir joyda turishi kerak,.
*   **Policy Enforcement:** "Hech qaysi agent PII (shaxsiy ma'lumot)ni tashqi serverga yubora olmaydi" kabi qoidalarni kod darajasida o'rnating.

***

**Xulosa:** Agentlarni boshqarishda **"Zero Trust"** (Hech kimga ishonma) tamoyiliga amal qiling. Agentga ruxsatni faqat kerakli vaqtda, kerakli miqdorda bering va ishi bitgach, darhol tortib oling.