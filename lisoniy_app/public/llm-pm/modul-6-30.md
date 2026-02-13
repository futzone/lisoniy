**6.30-mavzu: Cost Attribution (Xarajatlarni Taqqoslash va Monitoring)** bo‘yicha amaliy dars.

Agentlar tizimida eng katta xavflardan biri — bu "ko‘rinmas xarajatlar". Birgina agent noto‘g‘ri siklga tushib qolsa yoki samarasiz prompt ishlatsa, umumiy byudjetni bir kechada sarflab yuborishi mumkin.

***

# 6.30. Cost Attribution: Qaysi Agent Qancha Resurs Sarflayapti?

Cost Attribution (Xarajatni egasiga bog‘lash) — bu umumiy API hisob-kitobini bo‘laklab, qaysi bo‘lim, qaysi agent yoki qaysi foydalanuvchi eng ko‘p pul sarflayotganini aniqlash jarayonidir.

Bu jarayonni **"Protocol 49: Cost Attribution Model"** asosida tashkil qilamiz.

### 1. Metadata va Tagging (Belgilash)
Har bir LLM so‘rovi (request) "egasi" haqidagi ma'lumot bilan yuborilishi shart. OpenAI yoki Anthropic APIlarida `user` yoki `metadata` maydonlaridan foydalaning.

*   **Implementatsiya:**
    Har bir so‘rovga quyidagi teglarni qo‘shing:
    *   `agent_id`: Agent nomi (masalan, "CodingAgent_v2").
    *   `department`: Bo‘lim (masalan, "Marketing", "Engineering").
    *   `session_id`: Sessiya raqami.
    *   `task_type`: Vazifa turi (masalan, "Research", "Coding").

> **Natija:** Oy oxirida siz shunchaki "$5000" emas, balki *"Marketing bo‘limining 'Copywriter' agenti $3500 sarfladi, chunki u har bir post uchun 10 marta qayta yozishni amalga oshirgan"* degan hisobotni olasiz.

### 2. Trace-Level Costing (Zanjirli Xarajatlar)
Multi-agent tizimlarda bitta vazifa zanjir bo‘lib o‘tadi (Manager $\rightarrow$ Researcher $\rightarrow$ Writer).
*   **Correlation IDs:** Butun zanjir uchun bitta noyob ID yarating va uni barcha agentlarga uzating.
*   **Xarajatni bo‘lish:** Agar "Researcher" 10,000 token, "Writer" esa 2,000 token ishlatsa, umumiy vazifa tannarxining 83% qismi tadqiqotga ketganini ko‘rishingiz kerak. Bu sizga qayerni optimallashtirish kerakligini (Writer emas, Researcher qimmat ekanligini) ko‘rsatadi.

### 3. Asosiy Metrikalar (KPIs)
Faqat umumiy summani emas, samaradorlikni o‘lchang:
*   **Cost per Successful Task:** Bitta muvaffaqiyatli vazifa qanchaga tushyapti? (Agar agent $0.10 sarflab, lekin ishni bajara olmasa — bu isrof).
*   **Token Efficiency Ratio:** Foydali javob (output) va sarflangan umumiy tokenlar (input + context) nisbati. Agar bu nisbat juda past bo‘lsa, demak, kontekstda "axlat" ko‘p.

### 4. Alerting va Budgeting (Ogohlantirish)
*   **Anomaly Detection:** Agar biror agentning kunlik xarajati o‘rtacha ko‘rsatkichdan 50% ga oshib ketsa, avtomatik ravishda adminni ogohlantiring yoki agentni vaqtincha to‘xtating (Circuit Breaker).
*   **Project-Level Limits:** Har bir loyiha yoki jamoa uchun qat'iy limit o‘rnating (masalan, oyiga $100).

***

**Xulosa:** Cost Attribution — bu moliyaviy intizom. Busiz siz agentlarni masshtablay olmaysiz, chunki qayerdan pul ketayotganini bilmay turib, uni boshqarib bo‘lmaydi.
