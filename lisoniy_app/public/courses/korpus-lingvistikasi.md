# Korpus Lingvistikasi: Tilni Raqamli O‘rganish Asoslari

**Korpus lingvistikasi** — bu tilshunoslikning zamonaviy yo‘nalishi bo‘lib, tilni sun’iy ravishda tuzilgan qoidalar orqali emas, balki real hayotda ishlatilgan katta hajmdagi matnlar (korpuslar) asosida o‘rganadi.

Ushbu qo‘llanmada biz korpus nima ekanligi, u oddiy elektron kutubxonadan qanday farq qilishi va zamonaviy AI (Sun’iy Intellekt) uchun nima sababdan "havodek zarur" ekanligini ko‘rib chiqamiz.

---

## 1. "Korpus" so‘zining ma’nosi nima?

**Korpus** (lotincha *corpus* — "tana", "jism") — bu ma’lum bir qoidalar asosida tanlab olingan, raqamlashtirilgan, mashina (kompyuter) o‘qiy oladigan va lingvistik ishlov berilgan matnlar to‘plamidir.

Oddiy qilib aytganda, agar til **bino** bo‘lsa, korpus — bu shu binoni tashkil etuvchi **g‘ishtlar omboridir**.

### Oddiy kutubxona vs. Lingvistik Korpus
Ko‘pchilik korpusni elektron kutubxona (masalan, ZiyoUz) bilan adashtiradi. Ularning farqi quyidagicha:

| Xususiyat | Elektron Kutubxona | Lingvistik Korpus |
| :--- | :--- | :--- |
| **Maqsad** | Matnni o‘qish va mazmunini tushunish uchun. | Til qonuniyatlarini tahlil qilish (statistika) uchun. |
| **Foydalanuvchi** | Kitobxon. | Tilshunos, Dasturchi (NLP muhandisi). |
| **Qidiruv** | Kitob nomi yoki muallif bo‘yicha. | So‘z shakli, so‘z turkumi, grammatik qo‘shimcha bo‘yicha. |
| **Ishlov** | Odatda PDF yoki Word formatida. | Tokenizatsiya qilingan, teglangan (XML, JSON). |

---

## 2. Korpusning Asosiy Belgilari

Har qanday matn to‘plami ham korpus bo‘la olmaydi. Korpus quyidagi talablarga javob berishi kerak:

1.  **Reprezentativlik (Vakillik):** Korpus tilning barcha qatlamlarini qamrab olishi kerak. Faqat badiiy asarlardan tuzilgan korpus tilni to‘liq aks ettirmaydi. Unda *gazeta maqolalari, ilmiy matnlar, og‘zaki so‘zlashuv* va *ijtimoiy tarmoq yozishmalari* ham bo‘lishi lozim.
2.  **Mashina o‘qiy olishi (Machine-readable):** Matnlar kompyuter tushunadigan formatda bo‘lishi shart.
3.  **Annotatsiya (Belgilash):** Korpusdagi har bir so‘zga qo‘shimcha lingvistik ma’lumot (meta-data) biriktirilgan bo‘ladi.

---

## 3. Annotatsiya va Teglash (Tagging)

Korpusni "aqlli" qiladigan narsa bu — **Annotatsiya**. Bu jarayonda har bir so‘zga "pasport" beriladi.

### POS-tagging (Part of Speech Tagging)
So‘zlarni turkumlarga ajratish.

> **Misol:** "O‘zbekiston chiroyli."
> *   *O‘zbekiston* [Ot, Bosh kelishik, Atoqli ot]
> *   *chiroyli* [Sifat, Asl daraja]

### Lemmatizatsiya (Lemmatization)
So‘zning boshlang‘ich shaklini ko‘rsatish. O‘zbek tili kabi qo‘shimchalar orqali boyiydigan (agglyutinativ) tillarda bu juda muhim.

> **Matnda:** "kitoblarimdan"
> **Korpusda saqlanishi:** `Lemma: kitob` + `Qo‘shimchalar: -lar (ko‘plik), -im (egalik), -dan (chiqish kelishigi)`

---

## 4. Korpus Turlari

"Lisoniy" platformasida biz quyidagi korpus turlarini rivojlantirishni maqsad qilganmiz:

### A. Milliy Korpus (General Corpus)
Butun bir tilning holatini aks ettiruvchi ulkan baza (masalan, 100 milliondan ortiq so‘z). U tilning "standardi" hisoblanadi.

### B. Parallel Korpus
Ikki yoki undan ortiq tildagi bir-biriga tarjima qilingan matnlar.
*   **Maqsadi:** Google Translate, Yandex Translate kabi tizimlarni o‘qitish.
*   **Tuzilishi:** `Uz: "Salom dunyo"` <-> `En: "Hello world"` (Gapma-gap moslangan).

### C. Ixtisoslashgan Korpus
Ma’lum bir soha doirasidagi matnlar.
*   *Tibbiy korpus:* Kasallik varaqalari, dori yo‘riqnomalari.
*   *Yuridik korpus:* Qonunlar, kodekslar, sud qarorlari.

### D. Mualliflik Korpusi
Bir shaxsning barcha asarlari to‘plami. Masalan, **"Alisher Navoiy asarlari korpusi"**. Bu orqali Navoiyning lug‘at boyligi va qaysi so‘zni qancha ishlatgani aniqlanadi.

---

## 5. Korpus Nima Uchun Kerak? (Amaliyot)

Nega biz korpus tuzishga shuncha vaqt sarflaymiz?

### 1. Sun’iy Intellekt (AI va LLM) uchun
ChatGPT, Llama yoki Gemini kabi modellar grammatika kitobini o‘qib tilni o‘rganmaydi. Ular milliardlab so‘zlardan iborat korpuslarni "yutib", qaysi so‘zdan keyin qaysi so‘z kelishini statistika orqali o‘rganadi. **O‘zbek milliy korpusi bo‘lmasa, o‘zbek tilida gapiradigan mukammal AI ham bo‘lmaydi.**

### 2. Mukammal Lug‘atlar Tuzish
Eski usulda tilshunoslar so‘zning ma’nosini o‘z xotirasiga tayanib yozgan. Korpus yordamida esa so‘zning **kontekstda** qanday ishlatilishini ko‘rish mumkin.
*   *Misol:* "Tushmoq" fe’li korpusda 50 xil ma’noda (avtobusdan tushmoq, narx tushmoq, kayfiyat tushmoq) kelishi mumkin.

### 3. Imlo Dasturlari (Spellcheckers)
Word yoki Telegramdagi "qizil chiziq"lar korpusdagi eng ko‘p ishlatiladigan to‘g‘ri so‘zlar statistikasi asosida ishlaydi.

---

Bu juda ajoyib talab! Keling, **"Lisoniy"** platformasi uchun **"Korpus Lingvistikasi: Noldan Ekspertgacha"** nomli fundamental qo‘llanmani yozamiz.

Bu qo‘llanma shunday tuzilganki, uni tilshunoslikdan xabari yo‘q talaba ham, Google DeepMind’da ishlaydigan muhandis ham qiziqib o‘qiydi.

---

## 📚 Korpus Lingvistikasi: Tilni Raqamli "Tana"si

> **Dasturchi uchun qisqacha:** Korpus — bu tilning "Big Data"si.
> **Tilshunos uchun qisqacha:** Korpus — bu tilning real hayotdagi "jonli" aksidir.

Agar biz sun’iy intellekt (AI) ga o‘zbek tilini o‘rgatmoqchi bo‘lsak, unga quruq grammatika kitobini berish befoyda. Unga **millionlab** jonli misollar kerak. Ana shu misollar ombori — **KORPUS** deyiladi.

---

## Asosiy Tushunchalar (Noob Level 👶)

### Korpus
Tasavvur qiling, sizda minglab soatlar davomida yozib olingan ko‘cha suhbatlari, barcha gazeta maqolalari va Alisher Navoiyning barcha g‘azallari bor. Hammasi bitta qutida. Lekin bu shunchaki quti emas. Bu — **tartiblangan, etiketka yopishtirilgan va qidiruvga moslashgan** tizim.

**Oddiy matn vs Korpus**

| Oddiy Matn (Text) | Lingvistik Korpus (Corpus) |
| :--- | :--- |
| `Word` yoki `PDF` fayl. | `JSON`, `XML` yoki `CoNLL-U` formatidagi ma’lumot. |
| **Maqsad:** O‘qish uchun. | **Maqsad:** Tahlil qilish va Model o‘qitish uchun. |
| **Ichida:** Faqat so‘zlar. | **Ichida:** So‘zlar + Metadata + Lingvistik teglar. |
| **Qidiruv:** "Mustaqillik" so‘zini qidirish. | **Qidiruv:** "Mustaqillik" so‘zidan keyin kelgan *sifatlarni* topish. |

### Nega bu muhim? 💡
Siz "yuz" so‘zini bilasiz.
1.  **Yuz** (son): 100.
2.  **Yuz** (tana a’zosi): Bashara.
3.  **Yuz** (fe’l): Suvda suzmoq.

Kompyuter buni qayerdan biladi? **Korpusdan!**
Agar korpusda "yuz" so‘zi "yuvmoq" so‘zi bilan ko‘p kelsa, demak u tana a’zosi. Agar "so‘m" so‘zi bilan kelsa, demak u son.

---

## Korpus Anatomiyasi (Intermediate Level 👨‍🎓)

Keling, korpusning ichini yorib ko‘ramiz. Korpusdagi har bir matn shunchaki matn emas, u boyitilgan ma’lumotdir.

### Metadata (Pasport ma’lumotlari)
Har bir matnning kelib chiqish tarixi bo‘lishi shart.

```json
{
  "doc_id": "uz_news_2024_001",
  "meta": {
    "author": "Gazeta.uz muxbiri",
    "date": "2024-05-21",
    "genre": "news",
    "topic": "technology",
    "url": "https://gazeta.uz/..."
  },
  "content": "Sun'iy intellekt rivojlanmoqda..."
}
```

### Lingvistik Annotatsiya (Tagging)
Bu korpusning "yuragi". Biz matnni shunchaki saqlamaymiz, uni tahlil qilib saqlaymiz.

1.  **Tokenizatsiya:** Matnni bo‘laklarga (tokenlarga) ajratish.
2.  **POS-tagging (Part of Speech):** So‘z turkumini aniqlash.
3.  **Lemmatizatsiya:** So‘zning o‘zagini topish.

**Haqiqiy misol (O‘zbek tili uchun):**
*Gap:* "Bolalarimiz maktabga borishdi."

**Korpusdagi ko‘rinishi (CoNLL formati):**

| Token | Lemma | POS (Turkum) | Morph (Morfologiya) |
| :--- | :--- | :--- | :--- |
| Bolalarimiz | **bola** | NOUN | Number=Plur \| Poss=1Pl |
| maktabga | **maktab** | NOUN | Case=Dat |
| borishdi | **bormoq** | VERB | Tense=Past \| Person=3 |
| . | . | PUNCT | _ |

---

## Dasturlash va Amaliyot (Developer Level 💻)

Nazariya yetarli. Keling, Python yordamida kichik "mini-korpus" yaratish jarayonini ko‘ramiz.

### 🔧 1-Qadam: Tokenizatsiya (Preprocessing)
O‘zbek tilida tokenizatsiya qiyinroq, chunki bizda `'` (apostrof) va `-` (chiziqcha) so‘zning ichida kelishi mumkin.

```python
import re

text = "O'zbekiston — kelajagi buyuk davlat! Bugun 25-oktabr."

# Yomon usul (faqat bo'sh joydan qirqish)
# print(text.split()) 
# Natija: ["O'zbekiston", "—", "kelajagi", "buyuk", "davlat!", ...] -> "davlat!" (xato)

# To'g'ri usul (Regex)
# O'zbek harflari, apostrof va raqamlarni hisobga olamiz
pattern = r"[a-zA-Z\u0400-\u04FFo'g'shchO'G'SHCH]+|[\d]+|[.,!?;]"
tokens = re.findall(pattern, text)

print(tokens)
# Output: ["O'zbekiston", "kelajagi", "buyuk", "davlat", "!", "Bugun", "25", "oktabr", "."]
```

### 🔨 2-Qadam: KWIC (Key Word In Context)
Linguistlar va Data Scientistlar so‘zning qanday ishlatilishini ko‘rish uchun **Konkordans (Concordance)** dan foydalanishadi.

Keling, matn ichidan "til" so‘zi qatnashgan barcha jumlalarni topamiz.

```python
def get_concordance(word, text, window=3):
    tokens = text.split() # Soddalashtirilgan tokenizatsiya
    results = []
    
    for i, token in enumerate(tokens):
        if token.lower().startswith(word.lower()): # Stemmingish
            left = tokens[max(0, i-window):i]
            right = tokens[i+1:min(len(tokens), i+window+1)]
            results.append(f"{' '.join(left)} << {token} >> {' '.join(right)}")
            
    return results

corpus_text = "O‘zbek tili davlat tilidir. Bu til juda boy va qadimiy til hisoblanadi."
matches = get_concordance("til", corpus_text)

for m in matches:
    print(m)

# Output:
# O‘zbek << tili >> davlat tilidir.
# tili davlat << tilidir. >> Bu til
# tilidir. Bu << til >> juda boy
# boy va qadimiy << til >> hisoblanadi.
```

---

## AI va LLM davrida Korpus (Expert Level 🚀)

Bugungi kunda korpus lingvistikasi ChatGPT kabi **Katta Til Modellari (LLM)** ning poydevori hisoblanadi.

### Vector Embeddings (So‘zlarning raqamli makoni)
Eski korpuslarda so‘zlar shunchaki `string` edi. Zamonaviy "Lisoniy" korpusida har bir so‘z — bu **Vektor**.

Masalan, kompyuter uchun:
*   `Podshoh` - `Erkak` + `Ayol` = `Malika`

Buni amalga oshirish uchun biz korpusni **Embedding** qilamiz.

```python
# (Mavhum kod - tushunish uchun)
import word2vec_model

# Korpusdan o'rganilgan vektorlar
vector_king = word2vec_model.get_vector("podshoh")
vector_man = word2vec_model.get_vector("erkak")
vector_woman = word2vec_model.get_vector("ayol")

result = vector_king - vector_man + vector_woman

print(word2vec_model.most_similar(result))
# Output: [('malika', 0.92), ('qirolicha', 0.88)]
```

### Data Pipeline (Haqiqiy loyiha arxitekturasi)
"Lisoniy" korpusi qanday yig‘iladi?

1.  🕷️ **Crawling:** `Scrapy` yoki `Selenium` orqali `kun.uz`, `daryo.uz`, `ziyouz.com` saytlaridan ma'lumot yig'ish.
2.  🧹 **Cleaning:** HTML teglarni, reklamalarni, keraksiz belgilarni tozalash.
3.  🔄 **Deduplication:** Bir xil maqolalarni o‘chirib tashlash (Internetda copy-paste juda ko‘p).
4.  🏷️ **Annotation:** `UzSpacy` yoki boshqa NLP modellar orqali POS-tagging qilish.
5.  💾 **Storage:** Ma'lumotni `PostgreSQL` (metadata uchun) va `Elasticsearch` (matn qidiruvi uchun) ga saqlash.

---

## Xulosa

Korpus lingvistikasi — bu tilni **raqamli asrga** olib o‘tuvchi ko‘prikdir. "Lisoniy" platformasining maqsadi shunchaki matn yig‘ish emas, balki o‘zbek tilini kompyuterlar "tushunadigan", tahlil qila oladigan va qayta ishlata oladigan darajaga olib chiqishdir.
