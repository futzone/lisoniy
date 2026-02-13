# 4.19. Orchestration Patterns: Agentlarni Boshqarish Usullari

Agentlar jamoasini (Crew) tuzganingizda, ular o‘zaro qanday hamkorlik qilishini belgilashingiz kerak. Bu **Orchestration Pattern** (Boshqaruv Shabloni) deb ataladi. Noto‘g‘ri shablon tanlash agentlarning "tortishib qolishiga" yoki vazifani bajara olmasligiga olib keladi.

Sanoatda eng ko‘p qo‘llaniladigan 3 ta asosiy shablon: **Sequential**, **Hierarchical** va **Router**.

---

## 1. Sequential Pattern (Ketma-ket / Konveyer)
Bu eng oddiy va barqaror shablon. Agentlar xuddi zavod konveyeridagi ishchilar kabi bir chiziqda joylashadi. Birinchi agentning natijasi (output) ikkinchi agentga kirish ma'lumoti (input) bo‘lib xizmat qiladi.

*   **Ishlash tamoyili:** `Input -> Agent A -> Agent B -> Agent C -> Output`.
*   **Qachon ishlatiladi:** Vazifa aniq bosqichlardan iborat bo‘lganda va rejalashtirish talab qilinmaganda.
    *   *Misol:* Hujjatni ishlash (Document Processing Pipeline): `OCR Agent` (matnni o‘qiydi) $\rightarrow$ `Cleaner Agent` (xatolarni tuzatadi) $\rightarrow$ `Summary Agent` (xulosa qiladi),.
*   **Afzalligi:** Oson tuziladi (predictable) va xatoni topish oson.
*   **Kamchiligi:** Agar zanjirdagi bitta agent xato qilsa, butun jarayon buziladi (brittle).

## 2. Hierarchical Pattern (Boshliq-Xodim / Supervisor)
Bu shablon an'anaviy korporativ tuzilmaga o‘xshaydi. Tizimda bitta **"Orchestrator"** (yoki Supervisor) agent bo‘ladi. U ishni bajarmaydi, faqat rejalashtiradi va vazifalarni **"Worker"** (Ishchi) agentlarga bo‘lib beradi.

*   **Ishlash tamoyili:**
    1.  **Orchestrator:** Vazifani tahlil qiladi va reja tuzadi (Decomposition).
    2.  **Delegation:** Rejaning har bir qismini tegishli mutaxassis agentga (Sub-agent) topshiradi.
    3.  **Synthesis:** Ishchi agentlardan kelgan javoblarni yig‘ib, yakuniy natijani tayyorlaydi,.
*   **Qachon ishlatiladi:** Murakkab va noaniq vazifalarda.
    *   *Misol:* Dastur yaratish. `PM Agent` (Boshliq) vazifani `Coder Agent` (yozuvchi) va `QA Agent` (tekshiruvchi) o‘rtasida taqsimlaydi va boshqaradi,.
*   **Afzalligi:** Moslashuvchan. Boshliq agent kutilmagan muammolarda rejani o‘zgartira oladi.

## 3. Router Pattern (Yo‘naltiruvchi)
Bu "Mijozlarni qo‘llab-quvvatlash markazi" (Call Center) usulidir. Router agentning vazifasi foydalanuvchi niyatini (intent) aniqlash va uni to‘g‘ri "bo‘limga" (Agentga) yo‘naltirishdir. Routerdan keyin agentlar o‘zaro bog‘lanmasligi mumkin.

*   **Ishlash tamoyili:** `Input -> Router (Classifier) -> Specific Agent`.
*   **Qachon ishlatiladi:** Foydalanuvchi so‘rovi turli mavzularda bo‘lishi mumkin bo‘lganda.
    *   *Misol:* Mijoz servisi.
        *   "To‘lov o‘tmadi" $\rightarrow$ `Billing Agent`.
        *   "Parolni unutdim" $\rightarrow$ `Tech Support Agent`.
        *   "Narxlar qanaqa?" $\rightarrow$ `Sales Agent`.
*   **Afzalligi:** Har bir agent faqat o‘z sohasiga ixtisoslashadi, bu esa kontekstni toza saqlaydi va aniqlikni oshiradi,.

---

### Qiyosiy Xulosa

| Shablon | Rol | Mental Model | Eng yaxshi qo'llanilishi |
| :--- | :--- | :--- | :--- |
| **Sequential** | Konveyer | "Relay Race" (Estafeta) | Hujjatlarni tahlil qilish, Maqola yozish (Draft $\rightarrow$ Edit). |
| **Hierarchical** | Boshqaruv | "Project Manager" | Kod yozish, Tadqiqot (Research), Murakkab loyihalar. |
| **Router** | Saralash | "Traffic Controller" | Chatbotlar, Customer Support, Turli xil vositalarni tanlash. |

