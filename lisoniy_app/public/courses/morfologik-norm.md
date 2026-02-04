# Morfologik Norm va Uslubiyat: Qoida va San’at

Til — bu shunchaki matematik formulalar yig‘indisi emas, u jonli organizm. So‘zlar qo‘shimcha olganda shaklini o‘zgartiradi (Imlo), turli vaziyatda esa har xil "kiyim" kiyadi (Uslub).

Bu qo‘llanma **Imlo qoidalari** (Majburiyat) va **Uslubiyat** (Tanlov) o‘rtasidagi farqni ochib beradi.

---

Kompyuterga o‘zbek tilini o‘rgatishda ikki katta to‘siq bor:
1.  **Imlo (Orthography):** So‘zlar qo‘shimcha olganda nima uchun "Shahar" -> "Shahrim" ga aylanib qoladi?
2.  **Uslub (Stylistics):** Nima uchun robot "Sizni ko‘rgani keldim" deyishi kerak-u, "Sani ko‘rgani keldim" desa qo‘pol bo‘ladi?

Ushbu bo‘limda biz so‘z shakllarining **to‘g‘riligi** va **o‘rinliligi** masalasini ko‘rib chiqamiz.

---

## 1-QISM. Morfologik Norm va Imlo (Qonun) 📜

O‘zbek tili agglyutinativ (qo‘shimchalar ulanadigan) til bo‘lsa-da, bu jarayon har doim ham silliq kechmaydi. O‘zak va qo‘shimcha to‘qnashganda **fonetik o‘zgarishlar** yuz beradi.

NLP modellari (Lemmatizer) uchun bu eng katta bosh og‘rig‘idir. Agar model bu qoidalarni bilmasa, u "Shahrim" so‘zining o‘zagi "Shahr" deb xato o‘ylaydi.

### A. Tovush Tushishi (Elision) 🔻
Qo‘shimcha qo‘shilganda o‘zakdagi unli harfning tushib qolishi. Bu asosan talaffuzni o‘nglash (tejamkorlik) uchun sodir bo‘ladi.

*   **Qoida:** Ikki bo‘g‘inli so‘zlarga egalik qo‘shimchasi qo‘shilganda, ikkinchi bo‘g‘indagi unli tushib qoladi.
*   **Misollar:**
    *   `Shahar` + `-im` = **Shahrim** (Emas: *Shaharim*).
    *   `O‘rin` + `-im` = **O‘rnim**.
    *   `Qorin` + `-i` = **Qorni**.
    *   `Ogil` + `-i` = **O‘g‘li**.

> **NLP da yechim:** Lemmatizer shuni bilishi kerakki, agar so‘z *r, l, n* bilan tugab, oldida unli yo‘q bo‘lsa, lemmatizatsiya paytida unli (a, o‘, i) qo‘shib ko‘rish kerak.

### B. Tovush Almashishi (Alternation) 🔄
Qo‘shimcha ta’sirida o‘zak oxiridagi undoshning o‘zgarishi.

*   **K-G Almashinuvi:** `k` bilan tugagan so‘zga unli bilan boshlanuvchi qo‘shimcha qo‘shilsa, `k` -> `g` ga aylanadi.
    *   `Tilak` + `-im` = **Tilagim**.
    *   `Yurak` + `-i` = **Yuragi**.
*   **Q-G‘ Almashinuvi:** Xuddi shu holat `q` harfi bilan.
    *   `Qishloq` + `-im` = **Qishlog‘im**.
    *   `Taroq` + `-i` = **Tarog‘i**.

### C. Tovush Ortishi (Insertion) ➕
Ba’zan o‘zak va qo‘shimcha orasiga "bufer" tovush kirib qoladi. Bu asosan chet (fors-arab) tillaridan kirgan so‘zlarda uchraydi.

*   **Misollar:**
    *   `Parvo` + `-im` = **Parvoyim** (`y` tovushi ortdi).
    *   `Mavzu` + `-i` = **Mavzusi** (`s` tovushi ortdi, aslida *mavzuyi* bo‘lishi kerak edi, lekin *mavzusi* normaga aylangan).

---

## 2-QISM. Uslubiy Morfologiya (San’at) 🎨

Grammatik jihatdan to‘g‘ri bo‘lish yetarli emas. So‘z shakli **matn turiga (janriga)** mos bo‘lishi kerak.

NLP va Chatbotlar uchun bu **"Tone of Voice"** (Ovoz ohangi) deyiladi.

### I. Rasmiy-Idoraviy Uslub (Official Style) 🏛️
Hujjatlar, qonunlar va arizalar tili.

*   **Xususiyati:** Hissiy bo‘yoq yo‘q, aniqlik va standart qoliplar (klishe).
*   **Morfologik belgisi:**
    *   **Majhul nisbat (Passive Voice):** Shaxsni ko‘rsatmaslik uchun ko‘p ishlatiladi.
        *   *Misol:* "Ish haqida ma’lumot **so‘raldi**" (Kim so‘ragani muhim emas).
    *   **Harakat nomi:** `-ish`, `-lik` qo‘shimchalari.
        *   *Misol:* "Chora ko‘rish **ta’minlansin**".
    *   **Ko‘makchili qurilmalar:** *tomonidan, yuzasidan, bo‘yicha*.
        *   *Misol:* "Vazirlik **tomonidan** tasdiqlandi".

### II. Ilmiy Uslub (Scientific Style) 🔬
Darsliklar, maqolalar va dissertatsiyalar tili.

*   **Xususiyati:** Mantiqiylik, obyektivlik.
*   **Morfologik belgisi:**
    *   **Hozirgi-kelasi zamon:** Ilmiy haqiqatlar doimiy bo‘lgani uchun.
        *   *Misol:* "Suv 100 darajada **qaynaydi**" (Qaynadi emas).
    *   **Bizlash (1-shaxs ko‘plik):** Kamtarlik yuzasidan olimlar "Men aniqladim" demaydi.
        *   *Misol:* "Shuni aytishimiz **mumkinki**..."

### III. Badiiy Uslub (Artistic Style) 🎭
Romanlar, she’rlar va adabiyot.

*   **Xususiyati:** Hissiyot, obrazlilik va boy til.
*   **Morfologik belgisi:**
    *   **Shakl yasovchilar:** Erkalash, kichraytirish qo‘shimchalari (`-jon`, `-xon`, `-gina`, `-aloq`).
        *   *Misol:* "Qizginam", "Toychog‘im".
    *   **Tarixiy shakllar (Arxaizm):**
        *   *Misol:* "Aytur", "Bo‘lg‘ay" (Hozirgi kunda faqat badiiy matnda ishlatiladi).

### IV. So‘zlashuv Uslubi (Colloquial) 🗣️
Og‘zaki nutq va ijtimoiy tarmoqlar (Chat).

*   **Xususiyati:** Tejamkorlik, qisqartirish.
*   **Morfologik buzilishlar (Normalization kerak):**
    *   **Zamon qisqarishi:**
        *   *Adabiy:* "Ketayapman" -> *So‘zlashuv:* "Ketyapman" / "Kevomman" (Toshkent shevasi).
    *   **Kelishik tushishi:**
        *   *Adabiy:* "Maktab**ga** boryapman" -> *So‘zlashuv:* "Maktab boryapman".

---

## 3. "Lisoniy" uchun Amaliy Masalalar 💻

Platformani yaratishda ushbu bilimlarni qanday qo‘llaymiz?

### 1. Imlo Tekshirgich (Spellchecker) uchun:
Agar foydalanuvchi "Shaharim" deb yozsa, algoritm buni xato deb belgilashi va "Shahrim" variantini taklif qilishi kerak (`Rule: Vowel Drop`).

### 2. Matn Normalizatsiyasi (Normalization) uchun:
Ijtimoiy tarmoqlardan olingan ma’lumotlarni (Corpus) tahlil qilishdan oldin, ularni **Adabiy morfologiyaga** o‘girish kerak.
*   Input: "Man uyga ketvoman."
*   Process: `Man` -> `Men`; `ketvoman` -> `ketayapman`.
*   Output: "Men uyga ketayapman."

### 3. Style Transfer (Uslubni o‘zgartirish) AI:
Foydalanuvchi yozgan oddiy gapni "Rasmiy" ko‘rinishga o‘tkazib beruvchi vosita.
*   *User:* "Ertaga ishga kelmayman, kasalman."
*   *Lisoniy AI (Rasmiy):* "Sog‘lig‘im yomonlashgani sababli, ertaga ish joyida bo‘la olmasligimni ma’lum qilaman."

---

## Xulosa

Morfologik norma — bu tilning **skeleti**, uslubiyat esa uning **libosidir**.
