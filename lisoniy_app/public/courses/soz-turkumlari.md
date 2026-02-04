# 🧠 Mustaqil So‘z Turkumlari: Semantik va Morfologik Tahlil
Bu qo‘llanma nafaqat tilshunoslik qoidalarini, balki ularning kompyuter modellaridagi aksini ham tushuntirishga qaratilgan.

---

Tilshunoslikda so‘zlar **Mustaqil** va **Yordamchi** turkumlarga bo‘linadi. Mustaqil so‘zlar (Content Words) lug‘aviy ma’noga ega bo‘lib, ular gapning "skeleti"ni tashkil qiladi. Kompyuter lingvistikasida aynan shu so‘zlar asosiy axborot tashuvchilar hisoblanadi.

Biz quyidagi 6 ta asosiy turkumni "jarrohlik stoli"ga yotqizamiz: **Ot, Sifat, Son, Olmosh, Ravish va Fe’l.**

---

## 1. OT (NOUN) — Predmet Nomi 📦

Otlar kim?, nima?, qayer? so‘roqlariga javob bo‘luvchi, predmet va tushunchalarni ifodalovchi so‘zlardir. NLP modellarida ular ko‘pincha `NOUN` yoki `PROPN` (Atoqli ot) tegi bilan belgilanadi.

### A. Son Kategoriyasi (Number)
Otlar birlik yoki ko‘plikda bo‘lishi mumkin.
*   **Morfema:** `-lar`.
*   **Semantik xususiyati:**
    *   *Oddiy ko‘plik:* "Kitob**lar**" (Ko‘p kitob).
    *   *Hurmat:* "Dadam**lar** keldilar" (Bitta shaxs, lekin hurmat ma’nosida).
    *   *Mavhumlik/Turkum:* "Qishloq kattalar**i**" (Guruh).

### B. Egalik Kategoriyasi (Possession)
Predmetning kimga yoki nimaga qarashli ekanini bildiradi. Bu o‘zbek tilining o‘ziga xos xususiyati (ingliz tilida bu *my, your* kabi alohida so‘zlar bilan ifodalanadi).
*   **Shakllar:**
    *   1-shaxs: `-im` (mening), `-imiz` (bizning).
    *   2-shaxs: `-ing` (sening), `-ingiz` (sizning).
    *   3-shaxs: `-i` / `-si` (uning).

> **NLP Challenge:** "Maktabi" so‘zidagi `-i` egalikmi yoki "Toshkent maktabi"dagi izofami? Buni aniqlash kontekstga bog‘liq.

### C. Kelishik Kategoriyasi (Case)
Otning gapdagi boshqa so‘zlar bilan sintaktik aloqasini belgilaydi. 6 ta kelishik mavjud:
1.  **Bosh k.:** (Belgisiz) — Ega vazifasida.
2.  **Qaratqich k. (`-ning`):** Aniqlovchi. ("Kitob**ning** varag‘i").
3.  **Tushum k. (`-ni`):** Vositasiz to‘ldiruvchi. ("Kitob**ni** o‘qidim").
4.  **Jo‘nalish k. (`-ga`):** Harakat yo‘nalishi.
5.  **O‘rin-payt k. (`-da`):** Joy va vaqt.
6.  **Chiqish k. (`-dan`):** Manba.

### D. Ot Yasovchilar (Derivation)
Otlar boshqa so‘z turkumlaridan yasalishi mumkin:
*   **Shaxs oti:** *Ish* + `-chi` = Ishchi.
*   **Narsa oti:** *Kurak* + `-cha` = Kurakcha.
*   **O‘rin-joy oti:** *Gul* + `-zor` = Gulzor.
*   **Mavhum ot:** *Yaxshi* (Sifat) + `-lik` = Yaxshilik.

---

## 2. SIFAT (ADJECTIVE) — Predmet Belgisi 🎨

Sifat predmetning rangi, shakli, hajmi va xususiyatini bildiradi (`ADJ`). O‘zbek tilida sifatlar otlardan oldin keladi va odatda turlanmaydi (agreement yo‘q).

### A. Daraja Kategoriyasi (Degrees of Comparison)
Sifatlar belgining qay darajada ekanini ko‘rsatadi:
1.  **Oddiy daraja:** *Qizil, katta, chiroyli* (Neytral).
2.  **Qiyosiy daraja (`-roq`):** *Kattaroq, qizilroq* (Comparative).
3.  **Orttirma daraja:** *Eng katta, juda chiroyli, yam-yashil* (Superlative). Odatda kuchaytiruvchi yuklamalar yoki reduplikatsiya (qip-qizil) orqali yasaladi.

### B. Qo‘llanilishi
Sifatlar ko‘pincha **Otlashadi** (Substantivization).
*   *Asl holat:* "Yaxshi odam ko‘p yashaydi." (Aniqlovchi).
*   *Otlashgan:* "**Yaxshilar** ko‘p yashaydi." (Ega vazifasida).

---

## 3. SON (NUMERAL) — Miqdor va Tartib 🔢

Predmetning sonini, sanog‘ini yoki tartibini bildiradi (`NUM`).

### A. Ma’no Turlari
1.  **Sanoq son:** *Bir, o‘n, yuz* (Cardinal).
2.  **Tartib son (`-inchi`):** *Birinchi, o‘ninchi* (Ordinal).
3.  **Dona son (`-ta`):** *Ikkita, beshta*. (Bu faqat o‘zbek tiliga xos, hisob so‘z).
4.  **Chama son (`-lar`, `-lab`):** *O‘nlar, yuzlab* (Approximation).
5.  **Kasr son:** *Yarim, chorak, uchdan bir*.

### B. Yozilish Qoidalari (Normalization Rule)
NLP uchun sonlarni to‘g‘ri o‘qish muhim:
*   Raqam bilan: *5-sinf* (chiziqcha bilan).
*   Rim raqami: *XX asr* (qo‘shimchasiz o‘qiladi).
*   Matn ichida: "100 ta" -> "yuzta" (Text-to-Speech uchun muhim).

---

## 4. OLMOSH (PRONOUN) — O‘rinbosar 🔄

Olmoshlar mustaqil ma’noga ega emas, ular boshqa so‘zlarning o‘rnida almashinib keladi (`PRON`).

### Turlari va Matndagi Roli:
1.  **Kishilik olmoshlari:** *Men, sen, u, biz, siz, ular*.
    *   *Rol:* Matnda Ega bo‘lib keladi.
2.  **Ko‘rsatish olmoshlari:** *Bu, shu, o‘sha, ana*.
    *   *Rol:* **Anafora** (Oldingi gapdagi so‘zga ishora). "Ali keldi. **U** (Ali) xursand edi."
3.  **O‘zlik olmoshi:** *O‘z*.
    *   *Rol:* Refleksivlik. "Men **o‘z**imni ko‘rdim."
4.  **Belgilash (`hamma`), Bo‘lishsizlik (`hech kim`), Gumon (`kimdir`).**

---

## 5. RAVISH (ADVERB) — Harakat Belgisi 🏃‍♂️

Ravishlar ish-harakatning bajarilish tarzini, paytini yoki o‘rnini bildiradi (`ADV`). Sifat Otnigina aniqlasa, Ravish Fe’lni aniqlaydi.

### Turlari:
1.  **Holat ravishi:** *Tez* yurdi, *ast*a gapirdi.
2.  **Payt ravishi:** *Bugun* keldi, *hozir* ketdi.
3.  **O‘rin ravishi:** *Uzoqda* yashaydi, *ichkariga* kirdi.
4.  **Miqdor-daraja ravishi:** *Ko‘p* o‘qidi, *sal* charchadi.

---

## 6. FE’L (VERB) — Eng Murakkab Turkum ⚙️

O‘zbek tili morfologiyasining "qiroli". U ish-harakat yoki holatni bildiradi (`VERB`). Fe’lning strukturasi juda boy.

### A. Bo‘lishli va Bo‘lishsizlik
Har bir fe’l inkor shakliga ega bo‘lishi mumkin.
*   **Bo‘lishli:** *Yozdi*.
*   **Bo‘lishsiz (`-ma`):** *Yoz**ma**di*.

### B. Nisbat Kategoriyalari (Voice)
Fe’lning bajaruvchisi va obyekti o‘rtasidagi munosabatni ko‘rsatadi. Bu o‘zbek tilining eng kuchli tomonlaridan biri.

1.  **Aniq nisbat (Active):** Maxsus qo‘shimchasi yo‘q. Ega harakatni o‘zi bajaradi.
    *   *Misol:* "Ali xatni **yozdi**."
2.  **Majhul nisbat (Passive) (`-il`, `-in`):** Ega noma’lum, e’tibor obyektda.
    *   *Misol:* "Xat **yozildi**." (Kim yozgani muhim emas).
3.  **O‘zlik nisbat (Reflexive) (`-in`, `-il`):** Harakat bajaruvchining o‘ziga qaytadi.
    *   *Misol:* "Ali **yuvindi**." (O‘zini yuvdi).
4.  **Orttirma nisbat (Causative) (`-t`, `-dir`, `-gaz`...):** Harakat boshqa birov orqali bajartiriladi.
    *   *Misol:* "Ali xatni **yozdirdi**." (Kotibaga aytdi).
5.  **Birgalik nisbat (Reciprocal) (`-sh`):** Harakat birgalikda bajariladi.
    *   *Misol:* "Ular **yozishdi**."

### C. Zamon Kategoriyasi (Tense)
Harakatning nutq paytiga nisbatan vaqti.
1.  **O‘tgan zamon:** *Bordim* (yaqin), *boribman* (o‘zgan), *borgan edim* (uzoq).
2.  **Hozirgi zamon:** *Yozyapman* (ayni paytda), *yozaman* (doimiy).
3.  **Kelasi zamon:** *Boraman* (aniq), *bormoqchiman* (maqsad).

### D. Shaxs-Son (Person-Number)
Fe’lning kim tomonidan bajarilganini ko‘rsatuvchi qo‘shimchalar (Predikativlik).
*   *Men* bor-a-**man**.
*   *Sen* bor-a-**san**.
*   *U* bor-a-**di**.

---

## Xulosa: "Lisoniy" uchun ahamiyati

Ushbu kategoriyalarni kompyuterga tushuntirish orqali biz quyidagilarga erishamiz:
1.  **To‘g‘ri Tarjima:** "Xat yozildi" ni "The letter wrote" emas, "The letter **was written**" deb tarjima qilish uchun **Majhul nisbatni** tanish kerak.
2.  **Sentiment Tahlil:** "Yomon emas" iborasida **Bo‘lishsizlik (-ma)** qo‘shimchasini taniy olsa, bu ijobiy gap ekanligini biladi.
3.  **Chatbot:** Foydalanuvchi "Mening kartam" deganda **Egalik (-im)** qo‘shimchasi orqali bu uning shaxsiy ma’lumoti ekanligini tushunadi.