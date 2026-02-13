**6.32-mavzu: Testing & Evaluation (Sifatni O'lchash va A/B Test)** bo‘yicha amaliy dars.

Agentlar noaniq (non-deterministic) ishlaydi — bir xil savolga har doim har xil javob berishi mumkin. Shuning uchun an'anaviy dasturlashdagi "Unit Test"lar yetarli emas. Bizga **"Evals" (Baholash tizimi)** kerak.

***

# 6.32. Testing & Evaluation: Agentlar Sifatini O'lchash

Agentni productionga chiqarishdan oldin uning "aqli joyidami" ekanligini tekshirish uchun 3 bosqichli tizimdan foydalanamiz: **Golden Dataset**, **LLM-as-a-Judge** va **A/B Testing**.

### 1. Nimalarni o'lchash kerak? (Core Metrics)
Faqat "javob to'g'rimi?" degan savol yetarli emas. Quyidagi aniq metriklarni kuzatib boring:

*   **Tool Selection Accuracy:** Agent vazifa uchun to'g'ri vositani tanladimi? (Masalan, ob-havo uchun `calculator` emas, `get_weather` vositasini chaqirdimi?).
*   **Parameter Extraction:** Vosita uchun argumentlarni to'g'ri ajratib oldimi? (Masalan, "Keyingi hafta Parijga bilet" so'rovidan sanani to'g'ri formatda `2026-05-20` deb oldimi?).
*   **Response Quality:** Javob foydali va xavfsizmi? (Gallyutsinatsiya yo'qmi?).
*   **Refusal Accuracy:** Agent javob bera olmaydigan (yoki ruxsat berilmagan) savollarni to'g'ri rad etdimi?.

### 2. LLM-as-a-Judge (Hakam Modellar)
Har bir javobni inson o'qib chiqishi juda qimmat va sekin. Buning o'rniga, kuchli modelni (masalan, GPT-4o) "Hakam" sifatida ishlating.

*   **Jarayon:**
    1.  Kichik agent (masalan, GPT-4o-mini) javob beradi.
    2.  Hakam agent (GPT-4o) javobni va "Ground Truth" (ideal javob)ni solishtiradi.
    3.  Hakam baho qo'yadi (1 dan 5 gacha) va sababini yozadi.
*   **Afzalligi:** Bu usul orqali minglab testlarni avtomatik o'tkazish mumkin.

### 3. Golden Dataset (Oltin To'plam)
Agentni sinash uchun sizda **"Ground Truth Dataset"** bo'lishi shart. Bu ideal savol-javoblar va kutilgan vosita chaqiruvlari ro'yxatidir.
*   **Tarkibi:** Oddiy savollar, murakkab mantiqiy savollar va *edge cases* (agentni chalg'ituvchi savollar).
*   **Regression Testing:** Agent kodiga o'zgartirish kiritganingizda, ushbu to'plamni qayta ishga tushiring. Agar oldin to'g'ri ishlagan 92% holat endi 84% ga tushib qolsa, demak yangilanish sifatni buzgan.

### 4. A/B Testing va Canary Deployments
Production muhitida o'zgarishlarni ehtiyotkorlik bilan sinash:
*   **A/B Test:** Foydalanuvchilarning 10% qismiga yangi agent versiyasini (Version B), qolganlariga eskisini (Version A) ko'rsating.
*   **Monitoring:** Ikki guruhdagi metrikalarni (foydalanuvchi qoniqishi, xatoliklar, tezlik) solishtiring. Agar yangi versiya yaxshiroq bo'lsa, uni hamma uchun yoqing.

---

### Amaliy Tavsiya: Ishni nimadan boshlash kerak?
1.  **Start Small:** Dastlab eng muhim 50 ta savol-javobdan iborat "Golden Dataset" tuzing.
2.  **Tool:** **Deepchecks**, **Evidently AI** yoki **LangSmith** kabi tayyor platformalardan foydalaning. Ular "LLM-as-a-Judge" va monitoringni avtomatlashtiradi,.
3.  **Feedback Loop:** Foydalanuvchilarning "Like/Dislike" bosishlarini yig'ing va ularni keyingi test to'plamiga qo'shing.

***

**Tabriklayman!** Siz **6-Modul: Limitlar, Xavfsizlik va Samaradorlik**ni to'liq yakunladingiz. Endi sizning agentlaringiz nafaqat aqlli, balki xavfsiz, o'lchanadigan va boshqariladigan tizimga aylandi.