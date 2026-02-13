**3.15-mavzu: Function Calling & JSON Mode** bo‘yicha to‘liq va amaliy dars materiali. Bu mavzu agentning "aqliy qarori"ni "amaliy harakat"ga aylantiruvchi ko'prikdir.

***

# 3.15. Function Calling & JSON Mode: Modelni Dasturiy Kod Qaytarishga Sozlash

AI agentlari o'z-o'zidan internetga ulanmaydi yoki ma'lumotlar bazasini o'zgartirmaydi. LLMlar (Katta Til Modellari) faqat matn (token) ishlab chiqaradi. Agent tizimlarida bu matnni **bajariladigan buyruqqa** aylantirish uchun **Function Calling** texnologiyasidan foydalaniladi.

Bu darsda biz modelni shunchaki "gapiradigan" emas, balki aniq strukturalashgan **JSON** va **Funksiya chaqiruvlarini** amalga oshiradigan "muhandis"ga aylantirishni o'rganamiz.

---

## 1. Function Calling Nima?

Function Calling (Funksiya chaqirish) — bu modelga tashqi funksiyalarni (tools) ta'riflab berish va modeldan ushbu funksiyalarni ishlatish uchun kerakli argumentlarni **JSON formatida** olish jarayonidir.

### Ishlash Tamoyili (The Loop):
Bu jarayon 4 bosqichdan iborat:
1.  **Definition (Ta'rif):** Siz modelga funksiyalar ro'yxatini berasiz (masalan, `calculate_sum(a, b)` yoki `send_email(to, body)`).
2.  **Reasoning (Fikrlash):** Model foydalanuvchi so'rovini tahlil qiladi va qaysi funksiyani ishlatish kerakligini hal qiladi.
3.  **Structured Output (JSON):** Model funksiyani o'zi bajarmaydi! U shunchaki funksiya nomi va argumentlarini JSON formatida qaytaradi:
    ```json
    { "tool_call": "send_email", "args": { "to": "manager@company.com", "body": "Hisobot tayyor." } }
    ```
4.  **Execution (Ijro):** Sizning tizimingiz (Python/JS kodi) bu JSONni oladi, haqiqiy `send_email` funksiyasini ishga tushiradi va natijani ("Email yuborildi") yana modelga qaytaradi.

---

## 2. Deterministic Code vs. AI Reasoning

Eng katta xatolardan biri — hisob-kitob yoki mantiqiy tekshiruvlarni LLMga ishonib topshirishdir. LLMlar "hisoblay olmaydi", ular keyingi so'zni bashorat qiladi.

**Oltin Qoida:** Mantiqiy noaniqlik talab qilinganda AIdan, aniq hisob-kitob uchun esa **Dasturiy Koddan** foydalaning.

*   **❌ Yomon (AI):** "Bugungi sanadan 45 kun keyingi sanani hisoblab ber." (AI ko'pincha xato qiladi).
*   **✅ Yaxshi (Function Calling):** Agent `get_future_date(days=45)` funksiyasini chaqiradi. Python esa `datetime.now() + timedelta(days=45)` orqali aniq javobni qaytaradi.

---

## 3. JSON Mode va Structured Output

Function Callingdan tashqari, ba'zan bizga shunchaki ma'lumotlarni tartibli olish kerak bo'ladi (masalan, rezyumeni tahlil qilib, ma'lumotlarni ajratib olish). Buning uchun **JSON Mode** yoki **Pydantic** modellaridan foydalaniladi.

### Qanday sozlanadi?
Zamonaviy frameworklar (LangChain, LlamaIndex) va modellar (GPT-4o, Claude 3.5) **Structured Output**ni qo'llab-quvvatlaydi. Siz modelga kutilayotgan formatning **Schema**sini (qolipini) berasiz.

**Pydantic Misoli (Python):**
```python
class UserProfile(BaseModel):
    name: str = Field(description="Foydalanuvchining to'liq ismi")
    age: int = Field(description="Yoshi")
    skills: list[str] = Field(description="Texnik ko'nikmalari")

# Model javobi avtomatik ravishda ushbu klassga tekshiriladi va o'giriladi
agent_response = model.with_structured_output(UserProfile).invoke(query)
```
Bu usul modelning "erkin ijod" qilishini cheklaydi va tizimingiz buzilmasligini (Type Safety) ta'minlaydi.

---

## 4. Eng Keng Tarqalgan Muammolar va Yechimlar

### A. Argument Hallucination (To'qima Argumentlar)
Model funksiya talab qilmagan argumentlarni o'ylab topishi mumkin.
*   **Yechim:** Funksiya ta'rifida (docstring) argumentlarni juda aniq yozing va *Enum*lardan (aniq ro'yxat) foydalaning. Masalan, `status` faqat `["open", "closed"]` bo'lishi mumkinligini Schema ichida belgilang.

### B. "Suhbatdosh" bo'lib qolish
Agent funksiya chaqirish o'rniga, foydalanuvchiga "Xo'p, men buni bajaraman" deb matn yozib qo'yishi mumkin.
*   **Yechim:** Tizim promptida (System Prompt) aniq buyruq bering: *"Agar kerakli ma'lumot bo'lmasa, savol berma, mavjud vositalardan (tools) foydalan."* Yoki `tool_choice="required"` parametrini majburiy qilib qo'ying.

### C. Zanjirli Xatolar (Cascading Failures)
Agar model noto'g'ri JSON qaytarsa, dastur "qulab tushadi".
*   **Yechim (Self-Correction):** Kod bajarilayotganda xatolik (Exception) yuz bersa, bu xatoni (Traceback) modelga qaytarib yuboring. Model: *"Uzr, men sintaksisda xato qilibman, mana to'g'irlangan versiya,"* deb qayta JSON hosil qiladi.

---

## 5. Amaliy Maslahat: "Poka-yoke" (Xatodan himoyalash)

Yapon ishlab chiqarish tizimidan olingan bu usulni AI vositalariga qo'llang. Vositalaringizni shunday loyihalashtiringki, model ularni noto'g'ri ishlatishi qiyin bo'lsin.
*   Argumentlarni majburiy emas (optional) qiling va standart qiymatlar (default values) bering.
*   Modelga murakkab sanalar bilan ishlashni emas, balki oddiy `ISO 8601` formatini kiritishni o'rgating.

***

**Xulosa:** Function Calling — bu agentning "qo'li". JSON Mode — bu agentning "toza husnixati". Bu ikkisi bo'lmasa, agentlar shunchaki chatbot bo'lib qoladi.

