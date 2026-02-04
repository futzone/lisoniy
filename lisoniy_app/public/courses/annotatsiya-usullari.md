# Korpus Annotatsiyasi  

Bu qo‘llanma matnni shunchaki "saqlash" va unga "jon kiritish" o‘rtasidagi farqni ochib beradi.

---

# 🏷️ Korpus Lingvistikasida Annotatsiya Usullari

**Annotatsiya** (lotincha *annotatio* — izoh) — bu korpusdagi xom matnga (raw text) lingvistik va ekstralingvistik ma’lumotlarni **teglar (tags)** ko‘rinishida biriktirish jarayonidir.

Tasavvur qiling: Oddiy matn — bu ko‘chada yurgan noma’lum odam. Annotatsiya qilingan matn — bu qo‘lida pasporti, tibbiy kartasi va tarjimai holi bor shaxs.

Biz annotatsiyani **5 ta asosiy qavatga (layer)** bo‘lib o‘rganamiz.

---

## 1-Qavat: Morfologik Annotatsiya (POS Tagging) 🧱

Bu eng keng tarqalgan va fundamental usul. Bunda har bir so‘zning turkumi va grammatik shakli aniqlanadi.

### Jarayon:
1.  **Tokenizatsiya:** Matn so‘zlarga ajratiladi.
2.  **Lemmatizatsiya:** So‘zning lug‘aviy shakli (lemma) topiladi.
3.  **POS Tagging (Part of Speech):** So‘z turkumi belgilanadi (Ot, Fe’l, Sifat...).
4.  **Morphological Features:** Grammatik ma’nolar (kelishik, zamon, shaxs-son) kodlanadi.

**O‘zbek tili uchun standart (Universal Dependencies):**

| So‘z | Lemma | POS | Morph Features |
| :--- | :--- | :--- | :--- |
| **Maktablarga** | maktab | `NOUN` | `Number=Plur` (Ko‘plik) \| `Case=Dat` (Jo‘nalish k.) |
| **bordim** | bormoq | `VERB` | `Tense=Past` (O‘tgan z.) \| `Person=1` (1-shaxs) |

---

## 2-Qavat: Sintaktik Annotatsiya (Parsing) 🌳

Bu usulda so‘zlar emas, balki **so‘zlar o‘rtasidagi bog‘liqlik** belgilanadi. Natijada "Sintaktik daraxt" (Treebank) hosil bo‘ladi.

*   **Maqsad:** Gapdagi Ega (Subject), Kesim (Predicate) va To‘ldiruvchi (Object) ni aniqlash.
*   **Dependency Parsing:** So‘zlar o‘rtasidagi tobelikni ko‘rsatadi.

> **Misol:** "O‘quvchi qiziqarli kitobni o‘qidi."
> *   *o‘qidi* (ROOT/Kesim) -> kim? -> *o‘quvchi* (nsubj/Ega)
> *   *o‘qidi* -> nimani? -> *kitobni* (obj/Vositasiz to‘ldiruvchi)
> *   *kitobni* -> qanday? -> *qiziqarli* (amod/Sifatlovchi aniqlovchi)

---

## 3-Qavat: Semantik Annotatsiya (Ma’no) 🧠

Bu yerda biz grammatikadan chiqib, **ma’no**ga o‘tamiz.

### A. Named Entity Recognition (NER)
Matndagi atoqli otlarni (shaxs, joy, tashkilot) aniqlash.
*   `PER` (Person): Alisher Navoiy
*   `LOC` (Location): Toshkent, Samarqand
*   `ORG` (Organization): O‘zbekiston Milliy Universiteti
*   `DATE`: 1991-yil

### B. Semantic Roles (Semantic Role Labeling)
Gapdagi "kim nima qildi" emas, balki voqeadagi rollarni aniqlash:
*   **Agent:** Ish-harakat bajaruvchisi.
*   **Patient:** Ish-harakat obyekti.
*   **Instrument:** Ish-harakat quroli.

> *Misol:* "Ali (Agent) oynani (Patient) tosh bilan (Instrument) sindirdi."

---

## 4-Qavat: Fonetik va Prosodik Annotatsiya 🎙️

Bu asosan **Nutq korpuslari (Speech Corpus)** uchun ishlatiladi.
*   **Fonetik transkripsiya:** So‘zning qanday aytilishi (IPA belgilarida).
*   **Prosodiya:** Intonatsiya, urg‘u, pauzalar va hissiyot (xursand, xafa) belgilanadi.

> *Format:* `Salom [sa-lɔm] <pauza=0.5s> <tone=happy>`

---

## 💻 Python Example: Annotatsiya Strukturasi

Keling, professional annotatsiya tizimi (masalan, `spaCy` yoki `Stanza` kabi) ma’lumotni qanday saqlashini Python class orqali simulyatsiya qilamiz.

Bu kod "Lisoniy" platformasida ma'lumotlar bazasiga yozishdan oldin ma'lumot qanday ko'rinishda bo'lishini ko'rsatadi.

```python
import json

class AnnotatedToken:
    def __init__(self, id, text, lemma, pos, tag, dep, head, ner):
        self.id = id          # So'zning tartib raqami
        self.text = text      # Asl so'z
        self.lemma = lemma    # O'zak/Negiz
        self.pos = pos        # Umumiy so'z turkumi (UPOS)
        self.tag = tag        # Batafsil morfologik teg
        self.dep = dep        # Sintaktik vazifasi (Dependency)
        self.head = head      # Qaysi so'zga bog'langani (ID)
        self.ner = ner        # Named Entity (Shaxs, Joy...)

    def to_dict(self):
        return self.__dict__

# Misol gap: "Alisher Toshkentga keldi."
# Biz buni xuddi "Model" tahlil qilgandek qo'lda yozamiz:

sentence_data = [
    AnnotatedToken(1, "Alisher", "Alisher", "PROPN", "Atoqli_Ot", "nsubj", 3, "B-PER"),
    AnnotatedToken(2, "Toshkentga", "Toshkent", "PROPN", "Ot_Jo'nalish", "obl", 3, "B-LOC"),
    AnnotatedToken(3, "keldi", "kelmoq", "VERB", "Fe'l_O'tgan", "root", 0, "O"),
    AnnotatedToken(4, ".", ".", "PUNCT", "Nuqta", "punct", 3, "O")
]

# 1. JSON formatida saqlash (API uchun)
print("--- JSON Export ---")
json_output = json.dumps([t.to_dict() for t in sentence_data], indent=2, ensure_ascii=False)
print(json_output)

# 2. CoNLL-U formatida chiqarish (Lingvistik standart)
# Bu format dunyo bo'yicha NLP olimlari tilida "standart" hisoblanadi.
print("\n--- CoNLL-U Format ---")
print(f"{'ID':<4} {'FORM':<12} {'LEMMA':<10} {'UPOS':<6} {'HEAD':<6} {'DEPREL':<8} {'NER'}")
print("-" * 60)

for t in sentence_data:
    print(f"{t.id:<4} {t.text:<12} {t.lemma:<10} {t.pos:<6} {t.head:<6} {t.dep:<8} {t.ner}")

```

### Kod Natijasi (Tushuntirish bilan):

**JSON (Dasturchilar uchun):**
API orqali frontendga uzatish uchun qulay.

```json
[
  {
    "id": 1,
    "text": "Alisher",
    "lemma": "Alisher",
    "pos": "PROPN",
    "dep": "nsubj",
    "ner": "B-PER" 
  },
  ...
]
```

**CoNLL-U (Olimlar va Modellar uchun):**
Jadval ko'rinishida.
*   **HEAD:** `Alisher` (ID: 1) ning HEAD qismi `3` (ya'ni `keldi`). Bu degani "Alisher" so'zi "keldi" so'ziga tobe (Kim keldi? -> Alisher).
*   **NER:** `B-PER` (Begin Person) - Alisher shaxs ekanligini bildiradi.

---

## 5. Annotatsiya Usullari (Avtomatik va Qo'lda)

Korpusni qanday qilib teglaymiz? Har bir so‘zni qo‘lda yozib chiqmaymizku?

### A. Avtomatik Annotatsiya (Bootstrapping)
Bu usulda bizga kichik, lekin aniq qoidalar kerak bo‘ladi.
1.  **Rule-based:** "Agar so‘z `-ga` bilan tugasa va katta harf bilan boshlansa -> `LOC` (Joy) yoki `ORG` bo‘lish ehtimoli yuqori" degan qoidalar yoziladi.
2.  **Machine Learning:** Oldindan tayyorlangan model (masalan, UzBERT) katta matnni 90-95% aniqlikda avtomatik teglab chiqadi.

### B. Manual Correction (Oltin Standart)
Avtomatik model xato qilishi mumkin (masalan, "olma" so‘zini *meva* yoki *fe’l* (olmoq) deb adashtirishi mumkin).
Shunda **lingvistlar** (annotatorlar) maxsus dasturlar (masalan, **Brat**, **WebAnno**) orqali kirib, modelning xatolarini to‘g‘rilaydi.

> **Lisoniy platformasi strategiyasi:**
> 1. AI orqali "Pre-annotation" qilish (qora ish).
> 2. Community (ko'ngillilar) orqali xatolarni to'g'rilash (gamification).

---

## Xulosa

Annotatsiya — bu matnni "o‘qish"dan "tushunish"ga o‘tkazish jarayonidir.

*   **Tegsiz matn:** "Bank yopildi." (Daryo bo‘yimi? Moliya muassasasimi? Noma’lum)
*   **Annotatsiyali matn:** "Bank `[NOUN, Finance]` yopildi `[VERB]`." (Aniq Moliya muassasasi).

Sizning platformangizda annotatsiya qanchalik chuqur bo‘lsa, AI shunchalik aqlli bo‘ladi.