Bu mavzu prompt yozishni "san'at"dan "muhandislik" intizomiga o'tkazuvchi asosiy poydevordir.

***

# 1.1. Protocol-Based Prompting: TCC Framework va Raqamli Talablar

Ushbu darsda biz AI modellari (LLM) bilan ishlashda eng barqaror va samarali natija beradigan **"Task $\rightarrow$ Context $\rightarrow$ Constraints" (TCC)** arxitekturasini ko'rib chiqamiz. 2025-yilgi muhandislik protokollariga ko'ra, prompt shunchaki matn emas, balki model uchun aniq bajariladigan algoritm bo'lishi kerak.

## 1. TCC Framework (Vazifa-Kontekst-Cheklov)

Ko'plab muhandislar katta kontekst va savolni aralashtirib yuborishadi, bu esa modelning "diqqatini" sochib yuboradi. TCC strukturasi promptni mantiqiy bloklarga ajratadi.

### A. TASK (Vazifa) - Nima qilish kerak?
Bu qismda model bajarishi kerak bo'lgan asosiy harakat **aniq fe'l** bilan boshlanishi shart.
*   **Maqsad:** Modelning "niyatni aniqlash" (intent recognition) resursini tejash.
*   **Yomon:** "Menga bu loglarni ko'rib chiqishga yordam ber." (Noaniq).
*   **Yaxshi (Protocol):** "**TASK:** Quyidagi server loglarini tahlil qil va 502 errorlarning asosiy sababini (root cause) aniqla".

### B. CONTEXT (Kontekst) - Muhit qanday?
Model vazifani bajarishi uchun kerak bo'lgan barcha "fon" ma'lumotlar shu yerda beriladi.
*   **Nimalar kiradi:** Loglar, kod parchalari, ma'lumotlar bazasi sxemasi, foydalanuvchi portreti.
*   **Muhim:** Kontekstni `###` yoki `"""` kabi **ajratuvchilar (delimiters)** ichiga olish shart. Bu modelga ko'rsatma qayerda tugab, ma'lumot qayerda boshlanganini bildiradi.
*   **Misol:**
    ```markdown
    CONTEXT:
    - Server: Nginx 1.18
    - Database: PostgreSQL 13
    - Logs: """ [loglar shu yerga qo'yiladi] """
    ```

### C. CONSTRAINTS (Cheklovlar) - Nima qilmaslik kerak?
Cheklovlar — bu modelni "gallyutsinatsiya"dan saqlash va natijani standartlashtirish uchun eng muhim vositadir.
*   **Format:** Javob uzunligi, format (JSON/Markdown), til uslubi.
*   **Manfiy buyruqlar (Negative Constraints):** Nima qilmaslik kerakligini aniq ayting (masalan, "Hech qanday kirish so'zlarisiz faqat kodni yoz").

---

## 2. Raqamli Talablar (Numbered Requirements)

Modellar ko'pincha murakkab, ko'p qismli vazifalarni bajarishda ularni birlashtirib yuboradi yoki ba'zilarini tashlab ketadi. Buni oldini olish uchun **Raqamli Talablar Protokoli** ishlatiladi.

### Nega raqamlash kerak?
Agar siz "Menga g'oyalar ber va ularni bahola" desangiz, model buni umumiy matn sifatida chiqaradi. Agar har bir qadamni raqamlasangiz, model har bir punktni alohida "sub-task" (quyi vazifa) sifatida qabul qiladi.

**❌ Yomon Prompt:**
> "Bizning to'lov tizimimiz uchun takliflar ber, xatarlarni ayt va qancha vaqt ketishini chamala."

**✅ Protocol-Based Prompt (Raqamli):**
> "To'lov tizimini tahlil qil va quyidagi vazifalarni ketma-ket bajar:
> 1.  **5 ta aniq taklif** ro'yxatini tuz.
> 2.  Har bir taklif uchun **2-3 jumlalik foyda** tushuntirmasini yoz.
> 3.  Har bir taklif uchun **2 ta potensial xatarni** (risk) aniqla.
> 4.  Har birini amalga oshirish vaqtini **dasturchi-kun (dev-days)** hisobida bahola.
> 5.  Takliflarni **ROI (Foyda/Xarajat)** bo'yicha saralab chiq.".

---

## 3. Amaliy Shablon (Copy-Paste uchun)

Quyidagi shablonni har qanday muhandislik vazifasi uchun ishlatishingiz mumkin:

```markdown
# ROLE
Sen [Role Name, masalan: Senior DevOps Engineer] sifatida ishlayapsan.

# TASK
[Vazifani aniq fe'l bilan yozing. Masalan: Quyidagi Python skriptni refactoring qil.]

# CONTEXT
Mavzu bo'yicha kerakli ma'lumotlar:
- Tech Stack: [Python 3.9, AWS Lambda]
- Muammo: [Xotira yetishmovchiligi xatosi]
- Kod:
"""
[Kodni shu yerga qo'ying]
"""

# CONSTRAINTS & REQUIREMENTS
Javobni quyidagi qat'iy qoidalar asosida shakllantir:
1. Faqat o'zgartirilgan kod qismini emas, to'liq faylni taqdim et.
2. Kodga docstring va commentlar qo'sh.
3. Hech qanday "Buni qilishning yana bir yo'li" degan ortiqcha maslahatlarni yozma.
4. Javobni Markdown formatida qaytar.
```

---

## 4. Xulosa

*   **TCC (Task-Context-Constraints)** — bu promptni "tartibsiz so'rov"dan "strukturalashgan buyruq"qa aylantiradi.
*   **Raqamli talablar** — modelga vazifani qismlarga bo'lib, har birini to'liq bajarishga majbur qiladi.
*   **Negative Constraints** — modelning "aqllilik qilishi"ni va keraksiz matn yozishini cheklaydi.

**Keyingi qadam:** Ushbu shablonni olib, o'z ishingizdagi biror muammo (masalan, kodni optimizatsiya qilish yoki email yozish) uchun to'ldirib ko'ring.