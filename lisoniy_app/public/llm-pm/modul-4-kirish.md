**4-Modul: AI Agentlar va Orkestratsiya** bo‘yicha kirish darsi. Bu modulda biz bitta aqlli yordamchidan butun bir **"raqamli ishchi kuchi" (digital workforce)** yaratishga o'tamiz.

***

# 4-Modul: AI Agentlar va Orkestratsiya (Kirish)

Oldingi modullarda biz bitta modelga prompt yozishni va unga vositalar (Skills) berishni o‘rgandik. Lekin haqiqiy dunyodagi murakkab muammolarni (masalan, dastur yaratish yoki bozorni tahlil qilish) bitta agent hal qila olmaydi. Uning "xotirasi" (context window) to‘lib qoladi va diqqati sochilib ketadi.

**Yechim:** Vazifani kichik bo‘laklarga bo‘lib, tor ixtisoslashgan agentlar jamoasiga (Multi-Agent System) topshirish.

## 1. Nega Jamoaviy Agentlar (Multi-Agent Systems)?

Yakka agent (Single Agent) xuddi "Shveysariya pichog'i"ga o'xshaydi — hamma narsani qila oladi, lekin hech birini mukammal bajarmasligi mumkin. Jamoaviy tizim esa "Jarrohlar brigadasi"ga o'xshaydi:
*   **Context Window Limit:** Har bir agent faqat o'ziga kerakli ma'lumotni saqlaydi, bu esa "Lost in the Middle" muammosini kamaytiradi.
*   **Specialization (Ixtisoslashuv):** Bitta "Super Agent" o'rniga, sizda alohida "Tadqiqotchi", "Yozuvchi" va "Tekshiruvchi" agentlar bo'ladi. Bu xatolarni keskin kamaytiradi.
*   **Resilience (Bardoshlilik):** Agar bitta agent xato qilsa yoki tiqilib qolsa, boshqasi uni tuzatishi yoki ishni davom ettirishi mumkin.

## 2. Orkestratsiya Nima?

Agentlarni shunchaki yaratish yetarli emas, ularni boshqarish kerak. **Orkestratsiya** — bu agentlar o‘rtasida ma’lumot almashish, navbatni boshqarish va nizolarni hal qilish jarayonidir.

Asosiy orkestratsiya arxitekturalari:
1.  **Supervisor (Boshqaruvchi):** Bitta "Manager" agent vazifani rejalashtiradi va boshqa agentlarga bo'lib beradi.
2.  **Sequential (Ketma-ket):** Konveyer usuli. Agent A natijani Agent B ga uzatadi.
3.  **Network (Peer-to-Peer):** Agentlar o'zaro teng huquqli bo'lib, markaziy boshqaruvsiz gaplashadilar.

---

**Xulosa:** 4-modulda biz agentlarni qanday qilib bir jamoa sifatida ishlashga, bir-birini tekshirishga va murakkab loyihalarni "avtopilot"da bajarishga o'rgatamiz.

