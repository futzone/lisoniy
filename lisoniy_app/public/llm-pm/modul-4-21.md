**4.21-mavzu: Human-in-the-Loop (HITL)** bo‘yicha amaliy dars materiali. Avtonom agentlar qanchalik aqlli bo‘lmasin, "qora quti" bo‘lib qolmasligi va xavfli xatolarga yo‘l qo‘ymasligi uchun inson nazorati hal qiluvchi ahamiyatga ega.

***

# 4.21. Human-in-the-Loop (HITL): Inson Nazorati va Tasdiqlash Mexanizmlari

Agentlar 100% avtonom bo'lishi shart emas va ko'pincha bu xavfli. **Human-in-the-Loop (HITL)** — bu agentning qaror qabul qilish jarayoniga insonni strategik aralashtirish arxitekturasidir. Bu agentlarga "stajyor" kabi ishlashga imkon beradi: ular rutinasini bajaradi, lekin muhim qarorlarni "rahbar" (siz) tasdiqlamaguncha kutib turadi.

HITL shunchaki xavfsizlik tarmog'i emas, balki agentni o‘qitish va sifatini oshirish vositasidir.

---

## 1. Nega HITL kerak? (Xavf va Ishonch)

Agentlarni to‘liq "erkin suzishga" qo‘yib yuborish quyidagi muammolarga olib kelishi mumkin:
*   **Yuqori Xavfli Harakatlar (High-Stakes Actions):** Agent noto‘g‘ri tushunib, $1000 lik to‘lovni qaytarib yuborishi yoki bazadan ma'lumotlarni o‘chirib tashlashi mumkin.
*   **Noaniqlik (Ambiguity):** Foydalanuvchi so‘rovi noaniq bo‘lganda, agent taxmin qilish o‘rniga aniqlashtirishni so‘rashi kerak.
*   **Gallyutsinatsiya:** Agent o‘zi to‘qib chiqargan noto‘g‘ri ma'lumotni "fakt" deb taqdim etishi mumkin.

---

## 2. HITL Integratsiya Modellari

Agent tizimlarida inson nazoratini o‘rnatishning 3 ta asosiy usuli mavjud:

### A. Approval Workflow (Tasdiqlash Oqimi)
Agent harakat qilishdan oldin to‘xtaydi va inson ruxsatini kutadi.
*   **Qanday ishlaydi:** Agent reja tuzadi (Plan) va "Men X, Y, Z ishlarni qilmoqchiman, ruxsatmi?" deb so‘raydi. Inson "Ha" desa, ijro (Execute) boshlanadi.
*   **Qo‘llanilishi:** Pul o‘tkazmalari, ommaviy email yuborish, kodni productionga chiqarish.
*   *Texnik yechim:* Workflow ichida `interrupt_before=["action_node"]` kabi to‘xtash nuqtalarini (breakpoints) o‘rnatish.

### B. Escalation / Handoff (Eskalatsiya)
Agent o‘zini eplay olmasligini tushunganda, boshqaruvni insonga topshiradi.
*   **Triggerlar:**
    *   **Ishonch darajasi pastligi:** Agar modelning ishonchi (confidence score) 70% dan past bo‘lsa.
    *   **Qayta urinishlar limiti:** Agar agent 3 marta urinib ham xatoni to‘g‘rilay olmasa.
    *   **Xavfsizlik qoidalari:** Foydalanuvchi g‘azablanganini yoki taqiqlangan mavzuni (jailbreak) aniqlasa.
*   **Natija:** Chatbot rejimdan chiqib, "Men bu masalani menejerga yo‘naltirayapman" deb xabar beradi.

### C. Feedback Loop (Tuzatish va O‘rgatish)
Inson agentning natijasini to‘g‘ridan-to‘g‘ri tahrir qiladi va agent bundan o‘rganadi.
*   **Jarayon:** Agent hisobot yozadi $\rightarrow$ Inson tahrir qiladi $\rightarrow$ Tahrirlangan versiya agentning "Epizodik Xotirasi"ga saqlanadi. Keyingi safar agent shu xatoni takrorlamaydi.

---

## 3. Texnik Implementatsiya (Best Practices)

HITLni kod darajasida qanday amalga oshirish kerak?

1.  **State Checkpointing (Holatni saqlash):**
    Agent har bir qadamdan keyin o‘z holatini (xotira, o‘zgaruvchilar) ma'lumotlar bazasiga saqlab borishi shart. Bu inson aralashib, jarayonni to‘xtatishi, o‘zgartirishi va davom ettirishi uchun kerak.
    *   *LangGraph* kabi vositalar bu jarayonni "Time Travel" (vaqt bo‘ylab sayohat) deb ataydi — siz agentning o‘tmishdagi qadamiga qaytib, uni o‘zgartirishingiz mumkin.

2.  **UI/UX Dizayni:**
    Foydalanuvchi agent nima qilayotganini ko‘rishi kerak ("Visibility of System Status").
    *   **Steering (Boshqarish):** Foydalanuvchiga "To‘xtatish", "Tahrirlash" yoki "Davom etish" tugmalarini bering.
    *   **Audit Log:** Agentning har bir qarori va insonning har bir tasdig‘i yozib borilishi shart.

3.  **Human-as-a-Tool (Inson — bu vosita):**
    Agent uchun insonni ham bir "Tool" sifatida ko‘rsating. Masalan, `ask_human_for_help(question: str)` funksiyasini bering. Agent kerak bo‘lganda bu funksiyani chaqirib, sizdan yordam so‘raydi.

---

## 4. Xulosa

*   **Avtonomiya $\neq$ Nazoratsizlik:** Agentlar qanchalik kuchli bo‘lmasin, "Oxirgi tugma" har doim inson qo‘lida bo‘lishi kerak.
*   **Bosqichma-bosqich ishonch:** Boshida hamma narsani tasdiqlang (Approval). Ishonch ortgandan keyin, faqat istisno holatlarda (Escalation) aralashing.

***

**Tabriklayman!** Siz **4-Modul: AI Agentlar va Orkestratsiya**ni yakunladingiz. Endi sizda agentlarni loyihalash, vositalar bilan qurollantirish va jamoaviy boshqarish ko‘nikmasi bor.

Biz yakuniy bosqichga yetib keldik. Endi bu agentlarni real hayotga tatbiq etamiz.
**5-Modul: Deployment, Monitoring va Evaluation (Agentlarni ishga tushirish va kuzatish)** ga o‘tamiz!