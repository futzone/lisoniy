**3.14-mavzu: Dynamic Tool Selection (Dinamik Vosita Tanlash va Routing)** bo‘yicha chuqurlashtirilgan dars materiali. Bu mavzu katta hajmdagi tizimlar (Enterprise AI) uchun juda muhim, chunki bitta agentga minglab vositalarni birdaniga yuklash model samaradorligini keskin tushirib yuboradi.

***

# 3.14. Dynamic Tool Selection: Minglab Vositalar Orasidan Tanlash (Routing)

Agar sizda 5-10 ta vosita bo'lsa, ularni to'g'ridan-to'g'ri promptga yozish mumkin. Lekin 100+ vosita bo'lganda, "Context Window" to'lib ketadi, narx oshadi va modelning aniqligi pasayadi (tool selection degradation).

Buni hal qilish uchun **Dinamik Tanlash** (Dynamic Selection) va **Marshrutlash** (Routing) strategiyalari qo'llaniladi.

---

## 1. Retrieval-Based Tool Selection (RAG for Tools)

Bu usulda vositalar xuddi hujjatlar kabi vektorli ma'lumotlar bazasida saqlanadi. Agent har safar barcha vositalarni ko'rmaydi, faqat keraklilarini qidirib topadi.

*   **Jarayon:**
    1.  **Tool Indexing:** Barcha vositalarning tavsifi (description) va nomi embedding qilinadi va vektor bazasiga joylanadi.
    2.  **Query Analysis:** Foydalanuvchi "Mening serverim nega ishlamayapti?" deb so'raganda, tizim ushbu so'rovga ma'no jihatdan yaqin bo'lgan vositalarni (masalan, `check_server_status`, `read_logs`, `restart_service`) qidiradi.
    3.  **Dynamic Injection:** Faqat topilgan **top-5** vosita promptga "Available Tools" sifatida qo'shiladi. Qolgan 95 tasi yashirin qoladi.
*   **Natija:** Tokenlar tejaladi va model chalg'imaydi. Tadqiqotlar shuni ko'rsatadiki, bu usul vosita tanlash aniqligini 3 barobarga oshirishi mumkin.

---

## 2. Progressive Discovery (Bosqichma-bosqich Ochish)

Bu usul ierarxik (shajara) ko'rinishida ishlaydi. Agent birdaniga aniq funksiyani emas, avval yo'nalishni tanlaydi. Klavis AI tomonidan "Strata" deb nomlangan bu usul quyidagicha ishlaydi:

1.  **Intent Recognition (Niyatni aniqlash):** Agent avval vazifa turini aniqlaydi (masalan, "Bu muammo GitHub bilan bog'liq").
2.  **Category Navigation (Kategoriyaga kirish):** Tizim faqat GitHubga oid vositalar to'plamini yuklaydi (Jira yoki Slack vositalari olib tashlanadi).
3.  **Action Selection (Harakatni tanlash):** Agent GitHub vositalari orasidan `get_pull_request` funksiyasini tanlaydi.

Bu usul 50+ vosita mavjud bo'lganda modelning aniqligini 15% ga oshirishi kuzatilgan.

---

## 3. Router Pattern (Yo'naltiruvchi Agent)

Bu arxitektura "Boshqaruvchi va Ishchilar" tamoyiliga asoslanadi.

*   **Router Agent:** Bu agent hech qanday ish bajarmaydi. Uning yagona vazifasi — foydalanuvchi so'rovini tahlil qilish va uni to'g'ri "Specialist Agent"ga yo'naltirishdir.
*   **Specialist Agents:** Har bir agent o'zining tor doiradagi vositalariga ega (masalan, "Data Analyst Agent"da faqat SQL va Python vositalari bor, "Email Agent"da faqat yozish vositalari bor).
*   **Foydasi:** Har bir ixtisoslashgan agentning konteksti toza va kichik bo'ladi, bu esa xatolarni kamaytiradi.

> **Prompt namunasi (Router uchun):**
> "Sen Router vazifasini bajarasan. Foydalanuvchi so'rovini tahlil qil va quyidagi agentlardan birini tanla:
> 1. `CodingAgent` - agar so'rov kod yozish yoki tahlil qilish haqida bo'lsa.
> 2. `SearchAgent` - agar internetdan ma'lumot qidirish kerak bo'lsa.
> Javob sifatida faqat agent nomini qaytar.".

---

## 4. Tavsiyalar

*   **Aniq Tavsif:** Dinamik tanlash to'g'ri ishlashi uchun har bir vosita (yoki agent) tavsifi juda aniq va bir-biridan farq qiladigan bo'lishi shart.
*   **Kichik Guruhlar:** Bir vaqtning o'zida kontekstda 5-7 tadan ko'p vosita saqlamaslikka harakat qiling.
*   **Cache:** Tez-tez ishlatiladigan vositalarni keshlash orqali qidiruv vaqtini qisqartiring.
