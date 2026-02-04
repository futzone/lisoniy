# Korpus Turlari
Korpuslar shunchaki matnlar uyumi emas, ular qanday maqsadda yig‘ilgani va qanday tuzilganiga qarab qat’iy turlarga bo‘linadi. Har bir turning o‘z arxitekturasi va Python-da ishlash uslubi mavjud.

Quyida **"Lisoniy"** platformasi uchun korpuslarning chuqurlashtirilgan tasnifi keltirilgan.

---

# 🗂 Korpus Turlari: Tasnif va Arxitektura

Biz korpuslarni asosan 4 ta mezon bo‘yicha ajratamiz:
1.  **Til miqdori bo‘yicha** (Language Count)
2.  **Mazmun va qamrov bo‘yicha** (Content & Scope)
3.  **Vaqt parametri bo‘yicha** (Time)
4.  **Annotatsiya darajasi bo‘yicha** (Annotation)

---

## 1. Til Miqdori Bo‘yicha Tasnif

Bu eng keng tarqalgan tasnif bo‘lib, NLP (Tabiiy Tilni Qayta Ishlash) vazifasini belgilab beradi.

### A. Monolingual (Bir tilli) Korpus
Faqat bitta tildagi matnlardan iborat.
*   **Maqsadi:** Tilning umumiy statistikasini chiqarish, Spellchecker, Word Prediction va Katta Til Modellarini (LLM - GPT, Llama) o‘qitish.
*   **Tuzilishi:** Matnlar oqimi (Raw text stream).

**Python Example:**
Bir tilli korpusda eng ko‘p ishlatiladigan N-grammalarni (so‘z birikmalarini) topish.

```python
from collections import Counter
from nltk.util import ngrams

# Monolingual data (O'zbek tili)
corpus_text = """
Sun'iy intellekt kelajak texnologiyasidir. 
Sun'iy intellekt orqali biz katta ma'lumotlarni tahlil qilamiz.
Kelajak texnologiyasi bizga yangi imkoniyatlar beradi.
"""

def analyze_monolingual(text, n=2):
    tokens = text.lower().split()
    # Bigrammalarni yaratish (2 ta so'zdan iborat birikmalar)
    bigrams = ngrams(tokens, n)
    # Sanash
    counts = Counter(bigrams)
    return counts.most_common(2)

print(analyze_monolingual(corpus_text))
# Natija: [(("sun'iy", "intellekt"), 2), (('kelajak', 'texnologiyasidir.'), 1)]
```

### B. Parallel Korpus (Translation Corpus)
Ikki (bilingual) yoki undan ortiq tildagi, gapma-gap tarjima qilingan va moslashtirilgan (**aligned**) matnlar.
*   **Maqsadi:** Mashina tarjimasini (Machine Translation) o‘rgatish.
*   **Muhim shart:** **Alignment** (Moslashuv). 1-tildagi 5-gap 2-tildagi aynan 5-gapga to‘g‘ri kelishi shart.

**Python Example:**
Parallel korpuslar odatda `list of tuples` yoki `JSONL` formatida saqlanadi.

```python
# Parallel dataset strukturasi
parallel_corpus = [
    {"id": 1, "uz": "Salom dunyo", "en": "Hello world"},
    {"id": 2, "uz": "Men dasturchiman", "en": "I am a programmer"},
    {"id": 3, "uz": "Havo sovuq", "en": "The weather is cold"}
]

# Ma'lumotni filtrlash yoki mosligini tekshirish
def filter_short_sentences(corpus, min_len=2):
    return [
        pair for pair in corpus 
        if len(pair['uz'].split()) >= min_len and len(pair['en'].split()) >= min_len
    ]

print(filter_short_sentences(parallel_corpus))
```

### C. Comparable (Qiyosiy) Korpus
Ikki xil tilda, bir xil mavzuda, lekin **tarjima qilinmagan** matnlar.
*   **Misol:** BBC News (Inglizcha) va BBC O‘zbek (O‘zbekcha) saytlarida bir kunda chiqqan "Zilzila" haqidagi yangiliklar. Ular bir voqeani yoritadi, lekin gaplari mos kelmaydi.
*   **Maqsadi:** Madaniyatlararo tahlil, terminologiyani qiyoslash (Cross-lingual retrieval).

---

## 2. Mazmun va Qamrov Bo‘yicha

### A. Milliy Korpus (National/Reference Corpus)
Tilning barcha qatlamlarini (badiiy, ilmiy, publitsistik, og‘zaki) proporsional ravishda qamrab oluvchi ulkan baza (100 mln+ so‘z).
*   **Xususiyati:** Balanslashtirilgan (Balanced). Masalan, 40% gazeta, 30% badiiy asar, 20% ilmiy, 10% og‘zaki nutq.

### B. Ixtisoslashgan (Specialized) Korpus
Faqat ma’lum bir sohaga oid matnlar.
*   **Turlari:** Tibbiy, Yuridik, IT, Diniy.
*   **Maqsadi:** Sohaga oid "Terminologik lug‘at" yaratish yoki sohaviy Chatbot qilish (masalan, "Yurist AI").

**Python Example:**
Sohaviy korpusda "kalit so‘zlar"ni (TF-IDF konsepti) aniqlash. Oddiy korpusdan farqini ko‘rish uchun.

```python
import math

# Ixtisoslashgan korpus (IT sohasi)
tech_corpus = ["server", "api", "kod", "server", "ma'lumotlar bazasi", "api"]
# Umumiy korpus (General)
general_corpus = ["kitob", "non", "server", "uy", "kod", "bola", "osmon"]

def calculate_specificity(word, target_corp, general_corp):
    # Oddiy chastota hisobi
    tf_target = target_corp.count(word) / len(target_corp)
    tf_general = general_corp.count(word) / len(general_corp)
    
    # Agar so'z umumiy korpusda kam, lekin targetda ko'p bo'lsa, u "Termin"dir.
    if tf_general == 0: return float('inf')
    return tf_target / tf_general

print(f"Server score: {calculate_specificity('server', tech_corpus, general_corpus)}")
print(f"Non score: {calculate_specificity('non', tech_corpus, general_corpus)}")
# Natija: Server yuqori ball oladi, Non esa 0.
```

---

## 3. Vaqt Parametri Bo‘yicha

Til tirik organizm bo‘lib, u vaqt o‘tishi bilan o‘zgaradi.

### A. Sinxron (Synchronic) Korpus
Tilning **ayni bir vaqtdagi** (masalan, 2020-2025 yillar) holatini aks ettiradi.
*   **Foydasi:** Zamonaviy slanglar va neologizmlarni o‘rganish uchun.

### B. Diaxron (Diachronic / Historical) Korpus
Tilning **vaqt o‘tishi bilan o‘zgarishini** ko‘rsatadi. Turli davr matnlarini o‘z ichiga oladi (1900, 1950, 2000, 2024).
*   **Misol:** "Uchak" -> "Tayyora" -> "Samolyot" so‘zlarining ishlatilish dinamikasi.

**Python Example (Trend Analysis):**

```python
# Yillar bo'yicha ma'lumotlar
historical_data = {
    1920: ["tayyora", "maktab", "muallim"],
    1950: ["samolyot", "maktab", "o'qituvchi"],
    1990: ["samolyot", "litsey", "o'qituvchi"],
    2024: ["samolyot", "maktab", "ustoz", "smartfon"]
}

def check_word_trend(word, data):
    trend = {}
    for year, words in data.items():
        trend[year] = 1 if word in words else 0
    return trend

print(check_word_trend("tayyora", historical_data))
# {1920: 1, 1950: 0, 1990: 0, 2024: 0} -> So'z iste'moldan chiqib ketdi.
```

---

## 4. Annotatsiya Darajasi Bo‘yicha

### A. Raw (Xom) Korpus
Hech qanday lingvistik ishlov berilmagan toza matn.
*   **Format:** `.txt` fayllar.

### B. Annotated (Teglangan) Korpus
Har bir so‘zga teg (POS, Lemma, Morfologiya) yopishtirilgan.
*   **Format:** `CoNLL-U`, `XML`, `JSON`.
*   **Eng qimmatli korpus turi shu hisoblanadi.**

**Python Example:**
Annotatsiya qilingan korpusni o‘qish va tahlil qilish.

```python
# Annotated data (JSON formatida)
annotated_sentence = [
    {"token": "Men", "lemma": "men", "pos": "PRON", "tag": "pers_pron"},
    {"token": "kitobni", "lemma": "kitob", "pos": "NOUN", "tag": "acc_case"},
    {"token": "o'qidim", "lemma": "o'qimoq", "pos": "VERB", "tag": "past_tense"}
]

def extract_pos_sequence(sentence):
    # Grammatik strukturani olish
    return [word['pos'] for word in sentence]

print(extract_pos_sequence(annotated_sentence))
# Natija: ['PRON', 'NOUN', 'VERB'] -> O'zbek tilining tipik SOV (Ega-To'ldiruvchi-Kesim) qurilmasi.
```

### C. Treebank (Sintaktik Daraxt)
Bu eng yuqori darajadagi korpus. Unda nafaqat so‘zlar, balki gapning sintaktik daraxti (qaysi so‘z qaysi so‘zga bog‘langani) chizilgan bo‘ladi.
*   **Foydasi:** Gapning egasi va kesimini aniqlash, murakkab AI tahlillari uchun.

---

### Xulosa Jadvali

| Korpus Turi | Asosiy Vazifasi | O'zbek Tili Uchun Misol |
| :--- | :--- | :--- |
| **Monolingual** | LLM o'qitish | Wikipedia Dump (Uzbek) |
| **Parallel** | Google Translate | OPUS (Open Subtitles En-Uz) |
| **Ixtisoslashgan** | Sohaviy AI | O'zbekiston Qonunchilik Korpusi |
| **Diaxron** | Tarixiy tadqiqot | "Turkiston" gazetasidan "Kun.uz"gacha |
| **Treebank** | Grammatik tahlil | Universal Dependencies Uzbek |