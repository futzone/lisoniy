# 4.20. Self-Reflection & Critique: Agentlarning o'z xatosini o'zi to'g'irlash mexanizmlari

Agentlarning eng muhim qobiliyatlaridan biri — bu "birinchi urinishda mukammallik" kutish emas, balki o'z xatolarini aniqlash va tuzatishdir. **Self-Reflection (O'z-o'zini tahlil qilish)** agentga o'z harakatlarini tanqidiy baholash va keyingi qadamni yaxshilash imkonini beradi.

Ushbu mexanizm asosan 3 xil usulda amalga oshiriladi:

### 1. The Reflection Loop (Refleksiya Sikli)
Bu jarayon insonning o'z ishini qayta tekshirishiga o'xshaydi. Agent vazifani bajargach, darhol javob qaytarmaydi, balki quyidagi siklga kiradi:
1.  **Attempt (Urinish):** Vazifani bajarish (masalan, kod yozish yoki matn tuzish).
2.  **Reflect (Tahlil):** "Nima xato ketdi?", "Barcha talablar bajarildimi?" degan savollarga javob beradi.
3.  **Refine (Tuzatish):** Topilgan xatolarni inobatga olib, natijani yangilaydi.

> **Misol:** Agar agent noto'g'ri kod yozsa, "Error Reflection" orqali sintaksis xatoni aniqlaydi va "Qavsni yopish esdan chiqibdi" deb o'zini tuzatadi.

### 2. Evaluator-Optimizer (Baholovchi va Optimallashtiruvchi)
Bu usulda vazifa ikki xil rolga bo'linadi:
*   **Generator (Ijrochi):** Yechimni taklif qiladi.
*   **Evaluator (Tanqidchi):** Yechimni qattiq tekshiradi va baho beradi.
Tanqidchi agent javobni qabul qilmaguncha, Ijrochi uni qayta ishlashga majbur bo'ladi. Bu usul tarjima qilish yoki murakkab qidiruv vazifalarida samarali ishlaydi.

### 3. Types of Reflection (Refleksiya Turlari)
Agentlar nimalarni tahlil qilishi kerak?
*   **Error Reflection:** Xatolik sababini tushunish (masalan, Python kodi nima uchun `RuntimeError` berdi?).
*   **Strategy Reflection:** Yondashuv samarasiz bo'lsa, uni o'zgartirish (masalan, "Kalit so'z bilan qidirish natija bermadi, endi semantik qidiruvni sinab ko'raman").
*   **Constraint Reflection:** Cheklovlarni tekshirish (masalan, "Javob 50 so'zdan oshib ketdi, uni qisqartirishim kerak").

**Xulosa:** Self-Reflection agentlarni "to'g'ri javob beradigan" mashinadan, "o'rganadigan va moslashadigan" tizimga aylantiradi. Bu gallyutsinatsiyalarni kamaytirish va sifatni oshirishning eng samarali yo'lidir.

***

**Keyingi qadam:** Agentlar o'zini tuzatishi mumkin, lekin ba'zida inson aralashuvi shart.
Keyingi mavzu: **21. Human-in-the-Loop (HITL): Inson nazorati va tasdiqlash mexanizmlari.**

