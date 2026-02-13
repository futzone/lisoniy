# 4.17. Single vs Multi-Agent Systems: Tanlov Strategiyasi

AI agentlarini loyihalashda eng birinchi va muhim qaror — bitta kuchli "Super Agent" ishlatish kerakmi yoki vazifalarni "Agentlar Jamoasi" (Crew) o‘rtasida taqsimlash kerakmi?

Quyida ushbu ikki yondashuvning farqlari va qaysi holatda qay birini tanlash kerakligi bo‘yicha qo‘llanma:

## 1. Single Agent (Yakka Agent)
Bu yondashuvda bitta LLM barcha vositalarga (Tools) ega bo‘ladi va vazifani boshidan oxirigacha o‘zi bajarishga harakat qiladi.

*   **Mental Model:** "Shveysariya pichog'i" (Hamma narsani qila oladi, lekin mukammal emas).
*   **Qachon ishlatish kerak?**
    *   Vazifa **chiziqli** bo‘lganda (Input $\rightarrow$ Process $\rightarrow$ Output).
    *   **Tezlik (Latency)** muhim bo‘lganda (agentlar o‘rtasida gaplashish vaqti yo‘qolmaydi).
    *   Vazifa bitta **Context Window** hajmiga bemalol sig‘ganda.
*   **Cheklovlari:**
    *   **Cognitive Overload:** Agar agentga 50 ta vosita va 10 sahifalik yo‘riqnoma bersangiz, uning mantiqiy fikrlash qobiliyati pasayadi va "unutishni" boshlaydi.
    *   **Single Point of Failure:** Agar u adashsa, uni tuzatadigan hech kim yo‘q.

## 2. Multi-Agent Systems (Jamoaviy Agentlar)
Bu yerda vazifa kichik bo‘laklarga bo‘linadi va har bir bo‘lak uchun **maxsus ixtisoslashgan** agent (Specialist Agent) javob beradi.

*   **Mental Model:** "Jarrohlar brigadasi" (Anesteziolog, Jarroh va Hamshira — har biri o‘z ishini qiladi).
*   **Qachon ishlatish kerak?**
    *   **Vazifa murakkab bo‘lganda:** Masalan, dastur yaratish (Plan $\rightarrow$ Code $\rightarrow$ Test $\rightarrow$ Review).
    *   **Turli rollar talab qilinganda:** Agar jarayonda ham "Yuridik maslahatchi", ham "Python dasturchi" kerak bo‘lsa, bitta modelni ikkala rolga o‘tkazgandan ko‘ra, ikkita alohida agent qilgan afzal.
    *   **Context Engineering uchun:** Har bir agent faqat o‘ziga tegishli qisqa kontekstni ko‘radi, bu esa "Lost in the Middle" muammosini hal qiladi,.

## 3. Tanlov Matriksasi

| Mezon | Single Agent | Multi-Agent (Crew) |
| :--- | :--- | :--- |
| **Vazifa turi** | Oddiy, aniq qadamli | Murakkab, noaniq, ijodiy |
| **Kontekst** | Kichik va o‘rta | Juda katta (hujjatlar, kod bazasi) |
| **Tezlik** | Yuqori (Real-time) | Pastroq (Agentlar o‘zaro gaplashadi) |
| **Ishonchlilik** | O‘rtacha | Yuqori (Bir-birini tekshiradi - Self-correction) |
| **Misol** | "Emailga javob yozib ber" | "Raqobatchilarni tahlil qilib, hisobot yoz" |

**Xulosa:** Loyihani har doim **Single Agent** bilan boshlang. Qachonki prompt juda murakkablashib, agent xato qilishni boshlasa yoki kontekst to‘lib ketsa — ana o‘shanda **Multi-Agent** tizimiga o‘ting.