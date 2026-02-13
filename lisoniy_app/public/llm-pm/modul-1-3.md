# 1.3. Role & Persona Simulation: Rol va Shaxs Simulyatsiyasi

Ushbu mavzuda biz AIni shunchaki savol-javob vositasi emas, balki aniq kasb egalari, foydalanuvchilar yoki opponentlar (qarshi tomon) sifatida simulyatsiya qilish texnologiyalarini ko'rib chiqamiz. Bu usullar AIdan olinadigan javobning chuqurligi, aniqligi va foydaliligini keskin oshiradi.

## 1. Role-Based Prompting (Rol Belgilash Protokoli)

Oddiy so'rovlarda model "o'rtacha" umumiy javob berishga harakat qiladi. Rol belgilash orqali siz modelning "latent bilimlar fazosi"dan aynan kerakli ekspertlik qismini faollashtirasiz,.

### Asosiy qoida: Aniq unvon va tajriba
Shunchaki "Dasturchi kabi javob ber" deyish yetarli emas. Rol qanchalik aniq bo'lsa, natija shunchalik sifatli bo'ladi.

**❌ Yomon Prompt:**
> "Menga ushbu loyiha uchun marketing rejasi tuzib ber."

**✅ Yaxshi Prompt (Rol bilan):**
> **ROLE:** Sen 15 yillik tajribaga ega **B2B SaaS Product Marketing Manager** sifatida ishlayapsan. Sen avval Salesforce va HubSpot kompaniyalarida ishlagansan.
>
> **TASK:** Bizning yangi CRM tizimimiz uchun "Go-to-Market" strategiyasini ishlab chiq.
>
> **TONE:** Professional, raqamlarga asoslangan va strategik.

### Nega bu ishlaydi?
AI o'z ma'lumotlar bazasidan aynan "Senior Product Marketing Manager"ga xos so'z boyligi, metodologiyalar (masalan, SWOT, 4P) va fikrlash strukturasini chaqirib oladi.

---

## 2. Persona Simulation (Foydalanuvchi Portretini Simulyatsiya Qilish)

Loyiha menejmentida mahsulot yoki xizmatni turli toifadagi odamlar qanday qabul qilishini test qilish uchun ushbu texnikadan foydalaniladi. Bu "User Acceptance Testing" (UAT) jarayonining dastlabki bosqichi bo'lishi mumkin.

### Ssenariy: "Qaysar Mijoz" (The Difficult Client)
Siz yozgan email yoki taklifingizga eng yomon reaksiyani oldindan ko'rish uchun AIni "qaysar mijoz" rejimiga o'tkazing.

**Prompt namunasi:**
```markdown
# PERSONA
Sen texnologiyaga ishonmaydigan, har bir tiyinni tejashga urinadigan va o'ta talabchan "Qaysar Mijoz"san (Conservative CFO). Sen hech qanday "buzzword"larga (AI, Blockchain, Synergy) ishonmaysan.

# TASK
Mening quyidagi loyiha taklifimni o'qib chiq va uni rad etish uchun 5 ta eng kuchli, mantiqiy va achchiq e'tirozni bildir. Mening zaif nuqtalarimni shafqatsizlarcha ochib tashla.

# INPUT
[Loyiha taklifi matni...]
```

### Ssenariy: "Non-Technical User" (Texnik bo'lmagan foydalanuvchi)
UI/UX yoki hujjatlarni tekshirish uchun.

**Prompt namunasi:**
> "Sen 65 yoshli, texnologiyadan uzoq bo'lgan buxgaltersan. Bizning yangi interfeysimizdagi 'Hisobot yuklash' jarayonini qadamma-qadam tahlil qil va senga tushunarsiz yoki qiyin tuyulgan joylarni aytib ber."

---

## 3. The "Steel-man" Technique (Qarshi Fikrni Kuchaytirish)

Ko'pchilik o'z g'oyasini tasdiqlash uchun AIdan foydalanadi (Confirmation Bias). "Steel-manning" texnikasi esa buning aksi — qarshi fikrni eng kuchli shaklda himoya qilishdir. Bu qaror qabul qilishda "ko'r nuqtalar"ni (blind spots) yo'qotishga yordam beradi.

**Farqi:**
*   **Straw-man (Somon odam):** Qarshi fikrni zaiflashtirib ko'rsatish va oson yengish.
*   **Steel-man (Po'lat odam):** Qarshi fikrni sizdan ham yaxshiroq himoya qilish.

**Qo'llash Protokoli (Protocol 59):**

```markdown
# CONTEXT
Biz loyihamizda "Monolit arxitektura"dan "Mikroservislar"ga o'tishni rejalashtiryapmiz. Menimcha, bu to'g'ri qaror.

# TASK (STEEL-MAN ARGUMENT)
Mening fikrimga qo'shilish o'rniga, **Mikroservislarga o'tmaslik** (Monolitda qolish) pozitsiyasini "Steel-man" qil.
Ya'ni, mikroservislarga o'tishning barcha xatarlari, yashirin xarajatlari va muammolarini eng kuchli va asosli dalillar bilan himoya qil.
Meni mikroservislar xato ekanligiga ishontirishga harakat qil.

# OUTPUT FORMAT
1. Operatsion murakkablik (DevOps yuki).
2. Tarmoq kechikishlari (Network Latency).
3. Ma'lumotlar yaxlitligi muammolari (Distributed Transactions).
4. Xulosa: Nega hozirgi bosqichda Monolit afzal?
```

Bu texnika loyiha menejerlariga risklarni oldindan ko'rish va "Pre-mortem" (loyiha o'lishidan oldin uni tahlil qilish) o'tkazishda juda qo'l keladi.

---

## 4. Multi-Perspective Reasoning (Ko'p Qirrali Tahlil)

Murakkab qarorlar qabul qilishda bitta rol yetarli bo'lmasligi mumkin. Bunda siz AIdan bir vaqtning o'zida bir nechta "Virtual Kengash A'zolari" nomidan gapirishni so'raysiz.

**Prompt Arxitekturasi:**

> **TASK:** Bizning yangi masofaviy ishlash siyosatimizni (Remote Work Policy) tahlil qil.
>
> **PERSPECTIVES:** Javobni 3 xil ekspert nuqtai nazaridan yoz:
> 1.  **HR Direktori:** Xodimlarning ruhiy holati va madaniyat haqida qayg'uradi.
> 2.  **Moliya Direktori (CFO):** Ofis xarajatlari va samaradorlikni (ROI) o'ylaydi.
> 3.  **Xavfsizlik Ofitseri (CISO):** Ma'lumotlar sizib chiqishi va kiberxavfsizlikdan xavotirda.
>
> **SYNTHESIS:** Yakunda ushbu 3 ta fikrni birlashtirib, muvozanatli qaror taklif qil.

---

## Xulosa va Amaliyot

| Texnika | Maqsad | Qachon ishlatiladi? |
| :--- | :--- | :--- |
| **Role Prompting** | Ekspert darajasidagi javob olish | Kod yozish, strategiya tuzish, tahlil. |
| **Persona Simulation** | Empatiya va test qilish | Mahsulot dizayni, marketing, mijozlar bilan ishlash. |
| **Steel-man** | Tanqidiy fikrlash va risklarni aniqlash | Katta qarorlar qabul qilishdan oldin, arxitekturani tanlashda. |
| **Multi-Perspective** | Muvozanatli qaror chiqarish | Murakkab, ko'p tarmoqli muammolarni yechishda. |

**Vazifa:** Hozirgi loyihangizdagi eng munozarali qarorni oling va AIdan ushbu qarorga qarshi "Steel-man" argumentini yozib berishni so'rang.