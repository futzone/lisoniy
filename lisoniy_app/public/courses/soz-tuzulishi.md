# So‘zning Tarkibiy Qurilishi 

Bu qo‘llanma o‘zbek tili morfologiyasini "qora quti"dan "shaffof mexanizm"ga aylantirishga yordam beradi.

---

## 🧱 So‘zning Tarkibiy Qurilishi: Tilning "Lego" Konstruktori

Kompyuter lingvistikasida so‘z — bu yaxlit tosh emas, balki bo‘laklarga ajraladigan konstruktordir. O‘zbek tili — **Agglyutinativ** (yopishtiruvchi) til bo‘lgani uchun, bizda so‘zlar xuddi poyezd vagonlari kabi bir-biriga ulanib ketaveradi.

Ushbu qo‘llanmada biz so‘zni "atomlari"gacha parchalaymiz.

---

## 1. Morfema — Tilning Eng Kichik Ma’noli Bo‘lagi 🧬

Har qanday so‘zni ma’noga ega eng mayda bo‘laklarga ajratish mumkin. Bu bo‘laklar **Morfema** deyiladi.

Morfemalar ikki turga bo‘linadi: **O‘zak** va **Qo‘shimcha**.

### A. O‘zak (Root) — "Dvigatel"
So‘zning asosiy ma’nosini tashuvchi, bo‘linmaydigan qism. O‘zaksiz so‘z bo‘lmaydi.
*   **Misol:** `Ish`, `Gul`, `Oq`, `Yoz`.

### B. Qo‘shimcha (Affix) — "G‘ildiraklar va Bo‘yoq"
O‘zakka qo‘shilib, unga yangi ma’no beradigan yoki uni boshqa so‘zga bog‘laydigan qism. O‘zbek tilida qo‘shimchalar **faqat o‘zakdan keyin** keladi (Suffiks).
*   **Misol:** Ish**chi**, Gul**lar**, Oq**ar**, Yoz**di**.

> **Dasturchi uchun eslatma:** Ingliz tilida prefiks (un-happy) va suffiks (happi-ness) bor. O‘zbek tilida 99% holatda faqat suffiks (qo‘shimcha) bor. (Istisno: *no*malum, *ba*quvvat — bular fors-tojik tilidan kirgan old qo‘shimchalar).

---

## 2. Qo‘shimchalar Tasnifi (Algoritmik Yondashuv) 🗂️

Kompyuter so‘zni to‘g‘ri tahlil qilishi uchun qo‘shimchaning turini bilishi shart. O‘zbek tilida qo‘shimchalar funksiyasiga ko‘ra 3 guruhga bo‘linadi.

### I. So‘z Yasovchi (Derivational Suffixes) 🔨
Bu qo‘shimchalar o‘zakka qo‘shilib, **mutlaqo yangi so‘z** (yangi leksema) hosil qiladi. Ular so‘zning turkumini ham o‘zgartirishi mumkin.

*   **Vazifasi:** Lug‘at boyligini oshirish.
*   **Misollar:**
    *   `Gul` (Ot) + **-chi** = `Gulchi` (Ot, kasb egasi).
    *   `Tuz` (Ot) + **-la** = `Tuzla` (Fe’l, harakat).
    *   `Bilim` (Ot) + **-li** = `Bilimli` (Sifat).

### II. Lug‘aviy Shakl Yasovchi (Formative Suffixes) 🎨
Bu qo‘shimchalar yangi so‘z yasamaydi, balki so‘zga **qo‘shimcha ma’no bo‘yog‘ini** beradi (ko‘plik, erkalash, gumon va h.k.). So‘zning "skeleti" o‘zgarmaydi.

*   **Vazifasi:** Miqdor yoki munosabat bildirish.
*   **Misollar:**
    *   `Kitob` + **-lar** = `Kitoblar` (Ko‘plik).
    *   `Uy` + **-cha** = `Uycha` (Kichraytirish).
    *   `Oq` + **-ish** = `Oqish` (Ozroq oq).

### III. Sintaktik Shakl Yasovchi (Inflectional/Relational) 🔗
Tilshunoslikda "So‘z o‘zgartiruvchi" ham deyiladi. Bu qo‘shimchalar so‘zni gapdagi **boshqa so‘zlar bilan bog‘laydi**. Ular lug‘aviy ma’noni o‘zgartirmaydi.

*   **Vazifasi:** Gap tuzish (Egalik, Kelishik, Shaxs-son, Zamon).
*   **Misollar:**
    *   `Maktab` + **-ga** = `Maktabga` (Jo‘nalish k. - bormoq fe’liga bog‘laydi).
    *   `Kitob` + **-im** = `Kitobim` (Egalik).
    *   `Kel` + **-di** = `Keldi` (Zamon).

---

## 3. Asos va Negiz: Eng Muhim Farq ⚖️

Morfologik analizator (Morphological Analyzer) tuzayotganda bu ikki tushunchani adashtirmaslik kerak.

### Asos (Stem/Root in general sense)
So‘zning qo‘shimchalarsiz eng boshlang‘ich shakli. Bu — **sof O‘zak**.

### Negiz (Base / Lemma Candidate)
Bu — so‘zning **So‘z Yasovchi** qo‘shimchalar qo‘shilgandan keyingi holati.
Lug‘atda (Dictionary) so‘zlar aynan **Negiz** shaklida beriladi.

> **Formula:**
> `Negiz` = `O‘zak` + `So‘z Yasovchi Qo‘shimchalar`

**Keling, vizual ko‘ramiz:**

So‘z: **"Dengizchilikdan"**

1.  **O‘zak:** `Dengiz` (Narsa-buyum).
2.  **+ So‘z yasovchi:** `Dengiz` + *-chi* = `Dengizchi` (Shaxs).
3.  **+ So‘z yasovchi:** `Dengizchi` + *-lik* = `Dengizchilik` (Soha/Mavhum ot).
    *   🛑 **STOP!** Shu yergacha bo‘lgan qism **NEGIZ** deyiladi. Lug‘atdan biz "Dengizchilik"ni qidiramiz.
4.  **+ Shakl yasovchi:** `Dengizchilik` + *-dan* (Chiqish kelishigi).

**Xulosa:**
*   **Asos (O‘zak):** Dengiz
*   **Negiz:** Dengizchilik

---

## 4. Tahlil Algoritmi (Parsing) 💻

Kompyuter so‘zni qanday tahlil qiladi? Odatda jarayon **o‘ngdan chapga** (oxiridan boshiga) qarab ketadi.

**Input:** `Ishchilarimiz`

**1-Qadam: Segmentatsiya (Bo‘laklash)**
Kompyuter mumkin bo‘lgan barcha qo‘shimchalarni aniqlaydi:
`Ish` - `chi` - `lar` - `i` - `miz`.

**2-Qadam: Identifikatsiya (Taniqlash)**

| Morfema | Turi | Izoh |
| :--- | :--- | :--- |
| **Ish** | O‘zak | Ot (Harakat nomi) |
| **-chi** | So‘z yasovchi | Ot -> Ot (Shaxs oti) |
| **-lar** | Lug‘aviy shakl | Ko‘plik |
| **-imiz** | Sintaktik shakl | Egalik (1-shaxs, ko‘plik) |

**3-Qadam: Ierarxiya (Daraxt qurish)**
```text
      Ishchilarimiz (So'z)
          /       \
   Ishchilar (Negiz?) -> Yo'q, Negiz bu "Ishchi"
      /    \      \
   Ishchi  -lar   -imiz
    /  \
 Ish   -chi
```

---

## 5. Amaliyot: Python-da Tahlil Strukturasi

Dasturchilar uchun bu ma’lumotlar JSON formatida quyidagicha ko‘rinadi. "Lisoniy" APIsi shunday javob qaytarishi kerak:

```json
{
  "word": "bilimdonlar",
  "analysis": {
    "root": "bil",
    "root_pos": "VERB",
    "structure": [
      {
        "morpheme": "bil",
        "type": "ROOT",
        "meaning": "know"
      },
      {
        "morpheme": "-im",
        "type": "DERIVATIONAL",
        "desc": "Verb->Noun"  // Bil -> Bilim
      },
      {
        "morpheme": "-don",
        "type": "DERIVATIONAL",
        "desc": "Noun->Adj/Noun" // Bilim -> Bilimdon
      },
      {
        "morpheme": "-lar",
        "type": "INFLECTIONAL",
        "desc": "Plural" // Bilimdon -> Bilimdonlar
      }
    ],
    "stem": "bil",
    "lemma": "bilimdon" // Negiz shu!
  }
}
```

---

## Xulosa

"Lisoniy" platformasida biz shunchaki so‘zlarni yig‘maymiz, biz ularning DNK sini o‘rganamiz.

*   **O‘zak** — so‘zning ruhi.
*   **Negiz** — so‘zning jamiyatdagi (lug‘atdagi) maqomi.
*   **Qo‘shimchalar** — so‘zning boshqalar bilan munosabati.

Bu tushunchalarni bilish mukammal **Imlo tekshirgich** va **Tarjimon** dasturlarini yaratishning kalitidir. 🗝️