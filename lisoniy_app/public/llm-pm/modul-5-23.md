**5.23-mavzu: Dynamic Resource Optimization (Resurslarni Dinamik Optimallashtirish)** bo‘yicha amaliy dars. Bu loyiha menejerlarining eng og'riqli nuqtasi — "kim nima ish qilyapti va kim bo‘sh?" degan savolga AI orqali yechim topishdir.

***

# 5.23. Dynamic Resource Optimization: Jamoa Yuklamasini Balanslash

An'anaviy resurs boshqaruvi statik jadvallarga (Excel, Gantt) asoslanadi. Agentic AI bu jarayonni **real vaqt rejimiga** o‘tkazadi. AI agentlar shunchaki vazifa bermaydi, balki jamoa a'zolarining ko‘nikmalari, hozirgi yuklamasi va o‘tmishdagi ishlash tezligini tahlil qilib, vazifalarni **eng optimal** tarzda taqsimlaydi,.

Quyida agentlar yordamida resurslarni boshqarishning 3 ta asosiy mexanizmi keltirilgan:

### 1. Intelligent Task Assignment (Aqlli Vazifa Taqsimoti)
AI agentlar vazifani shunchaki "bo‘sh turgan" odamga emas, balki uni **eng yaxshi bajara oladigan** odamga beradi.
*   **Skill Matching:** Tizim xodimlarning ko‘nikmalarini (skills matrix) va oldingi loyihalardagi natijalarini tahlil qiladi. Masalan, "Doston o‘tgan safar API integratsiyasini 2 kunda tugatdi, bu vazifa unga mos" deb xulosa qiladi.
*   **Effort Estimation:** AI vazifaning qiyinligini baholaydi va jamoa a'zosining "bandlik darajasi"ni foizlarda hisoblab chiqadi.

### 2. Predictive Workload Balancing (Yuklamani Bashorat Qilish)
Agentlar "kuyib qolish" (burnout) yoki "bekorchi vaqt"ni oldindan ko‘ra oladi.
*   **Overload Prevention:** Agar agent bir xodimga haddan tashqari ko‘p vazifa yuklanganini sezsa (masalan, keyingi hafta 50 soatlik ish), u avtomatik ravishda vazifalarni boshqa a'zoga o‘tkazishni yoki muddatlarni surishni taklif qiladi.
*   **Idle Time Utilization:** Bo‘sh turgan soatlarni aniqlab, ularni faol loyihalarga yo‘naltiradi. Tadqiqotlarga ko‘ra, bu usul resurslardan foydalanish samaradorligini 6% ga va yillik daromadni sezilarli oshirishi mumkin.

### 3. Automated Rescheduling (Avtomatik Qayta Rejalashtirish)
Rejalar o‘zgarganda (masalan, kimdir kasal bo‘lib qolsa yoki yetkazib berish kechiksa), inson menejer soatlab jadvalni qayta tuzadi. AI buni daqiqalarda bajaradi.
*   **Dynamic Adaptation:** Agar jamoa a'zosi ta'tilga chiqsa yoki loyiha kechiksa, agent zudlik bilan jadvalni yangilaydi va vazifalarni mavjud resurslar o‘rtasida qayta taqsimlaydi.
*   **Wrike & ClickUp AI:** Bu platformalardagi agentlar loyiha xatarlarini bashorat qilib, resurs yetishmovchiligi haqida erta ogohlantirish beradi,.

---

### Amaliy Misol: Monday.com va Wrike
*   **Monday.com Sidekick:** Loyiha ma'lumotlarini tahlil qilib, "Bu vazifa uchun eng mos odam — Malika, chunki u shunga o‘xshash vazifani o‘tgan oyda muvaffaqiyatli yopgan" degan tavsiyani beradi,.
*   **Wrike:** Resurslarni real vaqtda kuzatib, loyiha menejeriga "Frontend jamoasi kelasi hafta 120% yuklama bilan ishlaydi, 2 ta vazifani Backend jamoasiga yoki keyingi sprintga o‘tkazing" deb maslahat beradi.

***

**Xulosa:** AI orqali resurslarni boshqarish — bu mikromenejment emas, balki jamoani "kuyib qolishdan" saqlash va loyihani o‘z vaqtida topshirish garovidir.
