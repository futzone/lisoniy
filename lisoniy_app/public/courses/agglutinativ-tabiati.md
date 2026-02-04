# O‘zbek Tilining Agglyutinativ Tabiati

Hisoblash lingvistikasining eng "qaynoq" va texnik jihatdan eng muhim mavzusi bo‘yicha fundamental qo‘llanma.

Bu qo‘llanma nima uchun O‘zbek tili uchun shunchaki GPT-4 ga ulanish yetarli emasligini, nega bizga o‘zimizning milliy algoritmik poydevorimiz kerakligini ilmiy va amaliy tomondan ochib beradi.

---

# ⚙️ Hisoblash Lingvistikasi va Morfologiya: Zamonaviy Yondashuv

Sun’iy intellekt dunyosida tillar ikki turga bo‘linadi:
1.  **Resursi ko‘p tillar (High-resource):** Ingliz, Rus, Xitoy. Ular uchun tayyor "qora quti"lar (modellari) bor.
2.  **Morfologik boy tillar (Morphologically rich):** O‘zbek, Turk, Venger. Bu tillar uchun standart modellar samarali ishlamaydi.

Bizning tilimiz — bu matematika. Uni tushunish uchun so‘zlarni yodlash emas, **formulalarni** bilish kerak.

---

## 1. O‘zbek Tilining Agglyutinativ Tabiati: "Lego" Effekti 🧩

O‘zbek tili **Agglyutinativ** (lotincha *agglutinare* — yopishtirmoq) til hisoblanadi. Bu nima degani?

Ingliz tilida (Flektiv til) biz grammatik ma’nolarni ifodalash uchun **alohida so‘zlardan** foydalanamiz:
*   *English:* "I will not go to the schools." (7 ta so‘z).

O‘zbek tilida esa biz bitta o‘zakka **qo‘shimchalar zanjirini** ulaymiz:
*   *O‘zbek:* "Maktablarga bormayman." (2 ta so‘z).

### Muammo: "Lug‘aviy Portlash" (Vocabulary Explosion) 💥
Kompyuter uchun "Maktab", "Maktabim", "Maktabda", "Maktablargacha"... bularning hammasi **alohida** so‘zlar.

Agar ingliz tilida `100,000` ta so‘z bilan 90% matnni qamrab olish mumkin bo‘lsa, o‘zbek tilida bitta fe’lning o‘zidan **millionlab** shakl yasash mumkin (`Bor` -> `Bordim`, `Borgandim`, `Boryapman`, `Bormoqchiman`...).

> **Xulosa:** Biz AI ga barcha so‘z shakllarini yodlata olmaymiz. Biz unga **so‘z yasash qoidalarini** o‘rgatishimiz kerak.

---

## 2. Nega Qoidalarga Asoslangan (Rule-Based) Tizimlar Muhim? 📏

Bugungi kunda hamma "Neural Networks" (Neyron tarmoqlar) va "Deep Learning" haqida gapirmoqda. Lekin O‘zbek tili morfologiyasi uchun klassik **Rule-Based** (Qoidaga asoslangan) usullar haliyam "Oltin standart" hisoblanadi.

### Neyron Tarmoqlar vs. Qoidalar

| Mezon | Neyron Tarmoq (Deep Learning) | Qoidaga Asoslangan (Rule-Based / FST) |
| :--- | :--- | :--- |
| **Ishlash prinsipi** | Misollardan "taxmin" qiladi. | Aniq lingvistik formulalar asosida ishlaydi. |
| **Aniqlik** | 90-95% (Kam uchraydigan so‘zlarda adashadi). | **100%** (Agar qoida to‘g‘ri yozilgan bo‘lsa). |
| **Resurs talabi** | Katta GPU va minglab datasetlar. | Juda yengil (CPU da ishlaydi). |
| **O‘zbek tili uchun** | Kontekstni tushunish uchun zo‘r (Semantika). | **So‘z tuzilishini tahlil qilish uchun eng zo‘ri (Morfologiya).** |

### Finite State Transducers (FST)
Dunyodagi eng kuchli morfologik analizatorlar (masalan, `Apertium` yoki `HFST`) **FST** texnologiyasida ishlaydi. Bu xuddi ulkan **sxema** (graflar tarmog‘i).

*   Start -> `k` -> `i` -> `t` -> `o` -> `b` -> (Ot aniqlandi) -> `l` -> `a` -> `r` -> (Ko‘plik aniqlandi) -> Finish.

> **"Lisoniy" strategiyasi:** Bizga **Gibrid** tizim kerak. So‘zning ichini tahlil qilish uchun **Rule-based**, gapning ma’nosini tushunish uchun **Neural**.

---

## 3. Morfologik Analizatorlar: Stemming va Lemmatization 🛠️

Kompyuterga matn berganda, u birinchi bo‘lib so‘zni "tozalashi" kerak.

### A. Stemming (O‘zakni Qirqish)
Bu — "Boltasoy" usuli. Algoritm so‘z oxiridan eng mashhur qo‘shimchalarni shunchaki qirqib tashlaydi.
*   **Algoritm:** `Agar so‘z oxiri "-lar" bo‘lsa -> o‘chir.`
*   *Input:* "Bolalar" -> *Output:* "Bola".
*   *Input:* "Olar" (Fe'l) -> *Output:* "O" (Xato! Asli "Ol").

**Qachon ishlatiladi?** Qidiruv tizimlarida (Search Engines). Foydalanuvchi "Kitoblar" deb izlasa, "Kitob" so‘zi bor sahifalarni ham topish uchun.

### B. Lemmatization (Negizni Tiklash)
Bu — "Jarroh" usuli. Algoritm so‘zning qaysi turkumdaligini va uning lug‘aviy shaklini (Lemma) aniqlaydi.
*   *Input:* "Ko‘rdi".
*   *Tahlil:* Bu `Ko‘rmoq` fe’lining o‘tgan zamon shakli.
*   *Output:* "Ko‘rmoq".

**Qachon ishlatiladi?** Mashina tarjimasida, Chatbotlarda va matnni tushunishda.

### Python Example: Farqini ko‘ramiz

```python
# Pseudo-code (Mantiqni tushunish uchun)

word = "o'qituvchilarimizdan"

# Stemming (Qirqish)
stem = word.replace("dan", "").replace("miz", "").replace("lar", "")
print(stem) 
# Natija: "o'qituvchi" (Yaxshi, lekin har doim ham to'g'ri ishlamaydi)

# Lemmatization (Tahlil)
analysis = MorphAnalyzer.parse(word)
lemma = analysis.root  # o'qi (fe'l)
derived = analysis.lemma # o'qituvchi (ot)
tags = analysis.tags   # Noun, Plural, Possessive(1pl), Ablative
print(f"Negiz: {derived}, Teglar: {tags}")
```

---

## 4. NLP Uchun Teglar (POS Tagging) 🏷️

POS Tagging (Part of Speech Tagging) — bu har bir so‘zga uning "grammatik pasporti"ni berishdir.
Dunyoda **Universal Dependencies (UD)** standarti mavjud bo‘lib, o‘zbek tili uchun ham shu ishlatiladi.

### Asosiy Teglar (UPOS):
1.  **NOUN:** Ot (*Kitob, Toshkent*).
2.  **VERB:** Fe’l (*Bordi, Keldi*).
3.  **ADJ:** Sifat (*Chiroyli, Katta*).
4.  **ADV:** Ravish (*Tez, Bugun*).
5.  **PRON:** Olmosh (*Men, Bu*).
6.  **NUM:** Son (*Bir, 1991*).
7.  **ADP:** Ko‘makchi (*Bilan, Uchun*).
8.  **CONJ:** Bog‘lovchi (*Va, Lekin*).
9.  **PART:** Yuklama (*-mi, -ku*).

### Omonimlik Muammosi (Disambiguation)
O‘zbek tilida so‘zlar kontekstga qarab har xil teg olishi mumkin. Bu NLP ning eng qiyin qismi.

**Misol: "Yoz"**
1.  "Men xat **yoz**dim." -> `VERB` (Fe’l).
2.  "Bugun havo issiq, **yoz** keldi." -> `NOUN` (Ot).

**Misol: "To‘la"**
1.  "Paqir suvga **to‘la**." -> `ADJ` (Sifat).
2.  "Pulni **to‘la**." -> `VERB` (Fe’l).

Model bu farqni qayerdan biladi? U **atrofidagi so‘zlarga** qaraydi (n-gram models). Agar "to‘la" dan keyin nuqta kelsa yoki u gap oxirida bo‘lsa, u fe’l bo‘lish ehtimoli yuqori.

---

## Xulosa: "Lisoniy"ning Texnik Yuragi ❤️

Sizning platformangiz muvaffaqiyatli bo‘lishi uchun quyidagilar shart:

1.  **Ochiq kodli Morfologik Analizator:** O‘zbek tili uchun `UzStanza` yoki shunga o‘xshash yangi, tezkor kutubxona yaratish (Python/C++ da).
2.  **Stemmer emas, Lemmatizerga urg‘u berish:** O‘zbek tili boy til, so‘zni shunchaki qirqish ma’noni o‘ldiradi.
3.  **Gibrid yondashuv:** Qoidalarni (Rule-based) sun’iy intellekt (AI) bilan birlashtirish.

