# 🔗 Yordamchi va Alohida Olingan So‘z Turkumlari

Agar Mustaqil so‘zlar (Ot, Fe’l) tilning **g‘ishtlari** bo‘lsa, Yordamchi so‘zlar — bu g‘ishtlarni ushlab turuvchi **sement** va devorga rang beruvchi **bo‘yoqlardir**.

Kompyuter lingvistikasida bu so‘zlar ko‘pincha "Stopwords" (To‘xta so‘zlar) deb atalib, tahlildan chiqarib tashlanadi. Lekin chuqur ma’no (Deep Semantics) va Sentiment tahlil uchun ular **oltindan qimmat**.

---

Tilshunoslikda so‘zlar faqat nomlash (ot) yoki harakat (fe’l) bilan cheklanmaydi. Gapning grammatik shakllanishi va hissiy bo‘yog‘i uchun maxsus vositalar xizmat qiladi.

Biz ularni ikki katta guruhga ajratamiz:
1.  **Yordamchi so‘zlar:** Grammatik aloqani ta’minlaydi (Sement).
2.  **Alohida olingan so‘zlar:** Hissiyot va munosabatni bildiradi (Bo‘yoq).

---

## 1-QISM. Yordamchi So‘zlar (Grammatik Vositalar) 🛠️

Bular mustaqil lug‘aviy ma’noga ega emas. Ular so‘roqqa javob bo‘lmaydi, gap bo‘lagi bo‘lib kelmaydi, lekin gap tuzishda **hal qiluvchi** rol o‘ynaydi.

### I. Ko‘makchi (Postpositions) — "Keyin keluvchi"
O‘zbek tilida *Preposition* (Old ko‘makchi - *in, on, at*) yo‘q, bizda **Postposition** (So‘zdan keyin keluvchi) bor. Ular Otning kelishik shakllariga o‘xshab xizmat qiladi.

*   **Vazifasi:** Otni fe’lga bog‘lash.
*   **Asl ko‘makchilar:** *bilan, uchun, kabi, sari, singari*.
    *   *Misol:* "Dadam **bilan** gaplashdim." (Birgalik).
*   **Ot-ko‘makchilar:** Otlashgan so‘zlar.
    *   *Misol:* "Stol **ustida**", "Uy **ichida**". (NLP da bularni ko‘makchi deb emas, Izofa (Genitive construction) deb qarash to‘g‘riroq).

> **NLP Tag:** `ADP` (Adposition).

### II. Bog‘lovchi (Conjunctions) — "Ko‘prik"
So‘zlarni yoki gaplarni bir-biriga bog‘laydi.

*   **Teng bog‘lovchilar (Coordinating):** Teng huquqli qismlarni bog‘laydi.
    *   *va, ham, lekin, ammo, biroq, yoki*.
    *   *Mantiq:* `AND`, `OR`, `BUT`.
*   **Ergashtiruvchi bog‘lovchilar (Subordinating):** Bosh gap va ergash gapni bog‘laydi.
    *   *chunki, ki, shuning uchun, agar*.
    *   *Mantiq:* `IF`, `BECAUSE`.

> **NLP Tag:** `CCONJ` (Teng), `SCONJ` (Ergashtiruvchi).

### III. Yuklama (Particles) — "Tuz va Ziravor"
So‘zga yoki gapga qo‘shimcha ma’no (so‘roq, ta’kid, ayirish, chegaralash) yuklaydi. Ular ma’noni **keskin o‘zgartirishi** mumkin.

*   **So‘roq yuklamalari:** *-mi, -chi, -a*.
    *   "Keldi" (Fact) -> "Keldi**mi**?" (Question).
*   **Kuchaytiruv yuklamalari:** *-ku, -da, axir, hatto*.
    *   "Bilaman" -> "Bilaman-**ku**!" (Emotional emphasis).
*   **Ayirish-chegaralash:** *faqat, gina*.
    *   "Men keldim" -> "**Faqat** men keldim".

> **NLP Tag:** `PART`.

---

### 🆚 Kichik Jang: Farqlari nimada?

Ko‘pchilik dasturchilar (va modellar) *bilan* so‘zini qachon ko‘makchi, qachon bog‘lovchi ekanligini adashtiradi.

| Holat | So‘z turkumi | Misol | Tahlil |
| :--- | :--- | :--- | :--- |
| **Bilan** | **Ko‘makchi** | "Pichoq **bilan** kesdi." | Qurol-vosita (Instrumental). Olib tashlasa ma'no buziladi. |
| **Bilan** | **Bog‘lovchi** | "Ali **bilan** Vali keldi." | Teng bog‘lovchi (`va` ga almashtirsa bo‘ladi). |

---

## 2-QISM. Alohida Olingan So‘zlar (Hissiy Vositalar) 🎭

Bu so‘zlar gap bo‘laklari bilan grammatik aloqaga kirishmaydi. Ular "gap ichidagi gap" kabi alohida turadi.

### I. Modal So‘zlar (Modal Words) — Munosabat
So‘zlovchining voqea-hodisaga ishonchi, gumoni yoki fikrini bildiradi. **Sentiment tahlil** uchun eng muhim qatlam.

*   **Ishonch:** *Albatta, shubhasiz, haqiqatan*. (Confidence Score: High).
*   **Gumon:** *Balki, ehtimol, shekilli*. (Confidence Score: Low).
*   **Fikr manbai:** *Meningcha, aytishlaricha*.
*   **Tartib:** *Avvalo, birinchidan*.

> **NLP da ahamiyati:** Chatbot javob berayotganda "Bu aniq shunday" (Hallucination xavfi) deyishdan ko‘ra, "**Ehtimol**, shundaydir" (Modal so‘z) ishlatishi xavfsizroq.

### II. Undovlar (Interjections) — Hissiyot 😫
Hissiyot (quvonch, g‘azab, qo‘rquv) yoki buyruq-xitobni bildiradi.

*   **Hissiy undovlar:** *Oh, eh, voy, uf, bay-bay*.
    *   *Voy* — qo‘rquv yoki hayrat.
    *   *Uf* — charchoq yoki norozilik.
*   **Buyruq-xitob:** *Hoy, pisht, qani*.

> **NLP Tag:** `INTJ`.

### III. Taqlid So‘zlar (Ideophones/Onomatopoeia) — Tasvir 📸
Bu o‘zbek tilining (va umuman turkiy tillarning) **eng noyob** xususiyati. Boshqa tillarda taqlid so‘zlar kam, bizda esa minglab!

Ular ikki xil bo‘ladi:
1.  **Tovushga taqlid (Sound):** *Qars-qurs, taq-tuq, g‘iyq-g‘iyq, miyov*. (Audio Recognition uchun muhim).
2.  **Holatga taqlid (Visual/Motion):** *Yarq-yurq* (oyna), *lup-lup* (yurak), *hil-hil* (pishgan meva), *milt-milt* (chiroq).

> **Tarjima muammosi:** "Milt-milt yonayotgan chiroq" ni ingliz tiliga "flickering light" deb tarjima qilish mumkin, lekin "Yuzi **lov-lov** yonardi" ni tarjima qilish juda qiyin.

---

## 3. Kompyuter Ko‘zi Bilan Tahlil (JSON Structure) 💻

"Lisoniy" platformasi matnni tahlil qilganda, ushbu so‘zlarni quyidagicha ko‘rishi kerak:

*Gap:* **"Eh, ehtimol, Ali bilan Vali ertaga kelishmas-a?"**

```json
{
  "sentence_analysis": {
    "tokens": [
      { "word": "Eh", "pos": "INTJ", "role": "Emotion", "sentiment": "Neutral/Sad" },
      { "word": "ehtimol", "pos": "ADV/MODAL", "role": "Uncertainty", "confidence": 0.4 },
      { "word": "Ali", "pos": "PROPN", "role": "Subject_1" },
      { "word": "bilan", "pos": "CCONJ", "role": "Connector", "meaning": "AND" },
      { "word": "Vali", "pos": "PROPN", "role": "Subject_2" },
      { "word": "ertaga", "pos": "ADV", "role": "Time" },
      { "word": "kelishmas", "pos": "VERB", "form": "Negative" },
      { "word": "-a", "pos": "PART", "role": "Question/Confirmation", "intent": "Verify" }
    ]
  }
}
```

## Xulosa

Yordamchi va alohida olingan so‘zlar — bu tilning **jonidir**.
*   **Ko‘makchi va Bog‘lovchilar** gapni qulatib yubormaslik uchun ushlab turadi.
*   **Modal, Undov va Taqlid so‘zlar** esa matnga insoniy ruh bag‘ishlaydi.

AI inson kabi gapirishi uchun, u nafaqat "nima" deyishni, balki "qanday" (ishonch bilanmi, ikkilanibmi, hayrat bilanmi) deyishni ham shu so‘zlar orqali o‘rganadi.