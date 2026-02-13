**5.24-mavzu: Risk Prediction & Analysis (Loyiha Xatarlarini Bashorat Qilish va "Pre-mortem" Tahlil)** bo‘yicha amaliy dars materiali.

AI agentlari loyiha boshqaruvidagi eng katta muammo — "optimistlik xatosi"ni (optimism bias) yo‘q qilishga yordam beradi. Insonlar "hamma narsa yaxshi bo‘ladi" deb umid qilsa, AI sovuqqonlik bilan "bu loyiha muvaffaqiyatsiz bo‘lish ehtimoli 75%" deb aytishi mumkin.

***

# 5.24. Risk Prediction & Analysis: "Pre-Mortem" Tahlil

An'anaviy boshqaruvda biz loyiha tugagach "Post-mortem" (o'limdan keyingi tahlil) o'tkazamiz va nima xato ketganini o'rganamiz. AI agentlari bilan biz **"Pre-mortem"** (o'limdan oldingi tahlil) o'tkazishimiz mumkin: biz loyiha hali boshlanmasdanoq, u muvaffaqiyatsiz tugagan deb faraz qilamiz va agentdan buning sabablarini topishni so'raymiz.

## 1. "Pre-Mortem" Tahlil (Protocol 62)

Bu strategiyada siz agentga loyiha rejasini berasiz va uni "Falokat ssenariysi"ni tuzishga majburlaysiz.

*   **Prompt Strategiyasi:**
    > *"Tasavvur qil, hozir loyiha tugash sanasidan 6 oy o‘tdi va loyiha butunlay **muvaffaqiyatsiz** yakunlandi. Muvaffaqiyatsizlikning asosiy sabablarini (root causes) tahlil qiluvchi 'Post-mortem' hisobotini yoz. Qaysi xatarlar e’tibordan chetda qolgan edi? Nimani noto‘g‘ri rejalashtirdik?"*
*   **Foydasi:** Bu usul ko‘rinmas xatarlarni (blind spots) va o‘ta optimistik rejalarni fosh qiladi. Agentlar hissiyotga berilmagani uchun, insonlar aytishga qo‘rqadigan "achchiq haqiqat"ni (masalan, "Jamoada malaka yetishmaydi") ochiq ayta oladi.

## 2. Predictive Risk Modeling (Bashoratli Modellashtirish)

AI agentlar shunchaki taxmin qilmaydi, ular ma'lumotlarga asoslanadi.

*   **Pattern Recognition (Shablonlarni aniqlash):** Agentlar minglab o‘tgan loyihalar tarixini, byudjet jadvallarini va o‘zgarishlar (change orders) tarixini tahlil qiladi. Ular *"Sizning oldingi loyihalaringizda dizayn tasdiqlash bosqichi har doim o‘rtacha 3 haftaga kechikkan. Bu rejadagi 1 haftalik muddat real emas"* degan ogohlantirishni beradi,.
*   **Sentiment Analysis (Kayfiyat tahlili):** "Sentinel" (Kuzatuvchi) agentlar Slack yozishmalari, RFI (Request for Information) va email xabarlarini kuzatib boradi. Agar jamoa a'zolarining ohangi o‘zgarsa yoki "muammo", "kechikish" so‘zlari ko‘payib ketsa, agent buni **erta xatar signali** sifatida rahbarga yetkazadi.

## 3. Real-Vaqt Rejimida Xatarlarni Boshqarish

Loyihani rejalashtirish bosqichidan keyin ham agentlar "Radar" kabi ishlab turadi.

*   **Dynamic Adaptation (Dinamik Moslashuv):** IoT sensorlari (qurilishda) yoki Jira ticketlari (IT da) orqali ma'lumotlar oqimini kuzatadi. Agar biror vazifa kritik yo‘l (critical path)da kechiksa, agent avtomatik ravishda butun jadvalga ta'sirini hisoblab chiqadi va "Yetkazib beruvchi kechikdi, zaxira rejasiga o‘tish kerakmi?" deb so‘raydi,.
*   **Risk-Weighted Planning (Xatarli Rejalashtirish):** Agentlar har bir vazifaga xatar ehtimolini (Probability) va ta'sir kuchini (Impact) belgilaydi. Natijada sizga oddiy jadval emas, balki **"P90 Forecast"** (90% ehtimol bilan tugash sanasi) taqdim etiladi,.

---

### Amaliy Tavsiya: Xatarlar Jadvali (Protocol 87)

Agentdan shunchaki xatarlarni sanashni emas, balki aniq **Mitigation Table** (Yechimlar Jadvali) tuzishni so'rang:

| Xatar (Risk) | Ehtimollik | Ta'sir | Yechim (Mitigation) | Mas'ul | Narxi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| API kechikishi | Yuqori | Yuqori | Mock server yaratish va parallel ishlash | Backend Lead | $500 |

Bu usul xatarlarni mavhum qo‘rquvdan aniq, boshqariladigan vazifalarga aylantiradi.

***

**Xulosa:** AI bilan xatarlarni boshqarish — bu folbinlik emas, balki ma'lumotlarga asoslangan **matematik hisob-kitobdir**. U sizni kutilmagan "yong'inlar"dan qutqaradi.
