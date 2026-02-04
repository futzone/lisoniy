# Korpus Yaratish Bosqichlari

Bu qo‘llanma shunchaki nazariya emas, balki real loyiha (masalan, kichik "O‘zbek Yangiliklar Korpusi") ustida ishlash uchun yo‘riqnomadir.

---

# 🏗️ Korpus Yaratish: G‘oyadan Tayyor Mahsulotgacha

O‘z korpusimizni yaratish — bu xuddi uy qurishga o‘xshaydi. Agar poydevor (reja) qiyshiq bo‘lsa, uy (AI modeli) qulab tushadi. Agar g‘ishtlar (ma’lumot) sifatsiz bo‘lsa, uy sovuq bo‘ladi.

Keling, bu jarayonni 5 ta professional bosqichda ko‘rib chiqamiz.

---

## 1-Bosqich: Rejalashtirish (Blueprint) 📝

Kod yozishdan oldin qog‘oz va qalam olib, loyihaning "Pasporti"ni chizib olishimiz kerak.

### Asosiy savollar:
1.  **Maqsad nima?**
    *   *Chatbot uchun:* Bizga savol-javob (dialog) matnlari kerak.
    *   *Grammatik tekshirgich uchun:* Bizga adabiy tildagi "toza" matnlar kerak.
    *   *Sotsiologik tadqiqot:* Ijtimoiy tarmoqlardagi "slang" va jargonlar kerak.
2.  **Hajm (Volume):**
    *   Kichik tadqiqot: 1 mln so‘z.
    *   LLM o‘qitish: 100 mln+ so‘z.
3.  **Balans (Balance):**
    *   Agar korpusning 90% qismi "Sport yangiliklari" bo‘lsa, sizning AI modelingiz siyosat haqida so‘rasangiz ham "Futbol" deb javob beradi.
    *   **Yechim:** Kvota belgilash (masalan: 30% Yangilik, 30% Badiiy, 20% Ilmiy, 20% Og‘zaki).

---

## 2-Bosqich: Ma’lumot Yig‘ish (Data Collection) 🕷️

Bu bosqichda biz Internetdagi ma’lumotlarni "o‘rib olamiz". Buning uchun **Web Scraping** yoki **Crawling** usullari ishlatiladi.

### Asosiy Manbalar:
1.  **Web Scraping:** `kun.uz`, `gazeta.uz`, `daryo.uz` kabi saytlardan maqolalarni yig‘ish.
2.  **OCR (Optical Character Recognition):** PDF kitoblar yoki gazeta skanlarini (`Tesseract` yordamida) matnga aylantirish.
3.  **API:** Twitter, Telegram yoki Wikipedia API orqali qonuniy ma'lumot olish.

### 🐍 Python Example: Web Scraper
Oddiygina yangilik saytidan sarlavha va matnni ko‘chirib oluvchi bot yozamiz.

```python
import requests
from bs4 import BeautifulSoup

def scrape_news(url):
    # 1. Saytga so'rov yuborish (User-Agent muhim, bot ekanligimizni yashiramiz)
    headers = {'User-Agent': 'Mozilla/5.0 (Lisoniy Corpus Bot)'}
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        return None

    # 2. HTMLni parslash
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 3. Kerakli qismlarni ajratib olish (CSS Selectorlar orqali)
    title = soup.find('h1').get_text(strip=True)
    
    # Maqola matni odatda <p> teglarida bo'ladi
    article_body = " ".join([p.get_text(strip=True) for p in soup.find_all('p')])
    
    return {
        "url": url,
        "title": title,
        "text": article_body
    }

# Ishlatib ko'ramiz (taxminiy URL)
data = scrape_news('https://kun.uz/news/2024/05/21/namuna-maqola')
print(data)
```

---

## 3-Bosqich: Tozalash (Data Cleaning) 🧹

Internetdan olingan ma’lumot har doim "iflos" bo‘ladi. Unda HTML kodlar, reklamalar, JavaScript bo‘laklari va emojilar aralashib yotadi.
**Qoida:** "Garbage In, Garbage Out" (Axlat kirdi, axlat chiqadi).

### Nimalarni tozalaymiz?
1.  **HTML Teglar:** `<div>`, `<br>`, `&nbsp;`.
2.  **Boilerplate:** "Saytga obuna bo‘ling", "Reklama" kabi takrorlanuvchi matnlar.
3.  **Deduplication:** Bir xil maqola 10 ta saytda chiqishi mumkin. Bizga faqat bittasi kerak.

### 🐍 Python Example: Cleaning Pipeline

```python
import re

def clean_text(raw_text):
    # 1. HTML teglarni olib tashlash (<...>)
    text = re.sub(r'<[^>]+>', '', raw_text)
    
    # 2. URL va Email manzillarni o'chirish
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'\S+@\S+', '', text)
    
    # 3. Ortiqcha bo'shliqlarni (whitespace) bittaga keltirish
    # "Salom      dunyo" -> "Salom dunyo"
    text = re.sub(r'\s+', ' ', text).strip()
    
    # 4. Normalizatsiya (Masalan, kirilldagi 'ҳ' va lotindagi 'h' ni birxillashtirish kerak bo'lsa)
    # Bu qism loyiha talabiga qarab yoziladi.
    
    return text

raw_input = "<p>Bugun havo <strong>ajoyib!</strong>   Batafsil: http://kun.uz</p>"
clean_output = clean_text(raw_input)

print(f"Oldin: {raw_input}")
print(f"Keyin: {clean_output}")
# Natija: Bugun havo ajoyib! Batafsil:
```

---

## 4-Bosqich: Annotatsiya (Tagging) 🏷️

Endi "toza" matnni "aqlli" matnga aylantiramiz.

### Usullar:
1.  **Avtomatik (NLP Pipeline):** `UzStanza` yoki `Trankit` kabi modellar yordamida butun korpusni bir necha soatda teglab chiqish.
2.  **Manual (Qo‘lda):** Agar siz oltin standart (Gold Standard) korpus tuzayotgan bo‘lsangiz, har bir gapni tilshunoslar tekshirib chiqishi shart.

**Annotatsiya nimani o‘z ichiga oladi?**
*   **POS:** So‘z turkumi.
*   **Lemma:** So‘z o‘zagi.
*   **Sentence Boundaries:** Gap qayerda tugashini aniq belgilash (bu juda qiyin masala, masalan "A.Q.Sh." so‘zida nuqtalar bor, lekin gap tugamagan).

---

## 5-Bosqich: Saqlash va Tarqatish 💾

Korpus tayyor. Endi uni qanday saqlaymiz? Oddiy `.txt` fayl katta hajmdagi qidiruv uchun yaroqsiz.

### Formatlar:
*   **JSONL (JSON Lines):** Har bir qator bitta hujjat. Dasturchilar va LLM o‘qitish uchun eng qulay format.
*   **XML (TEI):** Raqamli gumanitar fanlar va klassik tilshunoslik uchun standart.

### Qidiruv Tizimlari (Indexing):
Foydalanuvchilar korpus ichidan "Ega + Kesim" qolipidagi gaplarni qidira olishi kerak.
1.  **Elasticsearch:** Zamonaviy, tezkor, web-loyihalar uchun (Lisoniy uchun tavsiya etiladi).
2.  **CWB (Corpus Workbench):** Professional lingvistlar uchun maxsus indekslash tizimi.
3.  **Sketch Engine:** Agar byudjet bo‘lsa, tayyor platformaga yuklash.

### 🐍 Python Example: Saving to JSONL

```python
import json

corpus_data = [
    {"id": 1, "text": "Salom dunyo", "meta": {"year": 2024}},
    {"id": 2, "text": "Python zo'r til", "meta": {"year": 2023}}
]

# JSONL formatida saqlash (Append mode)
with open('lisoniy_corpus.jsonl', 'w', encoding='utf-8') as f:
    for entry in corpus_data:
        json.dump(entry, f, ensure_ascii=False)
        f.write('\n') # Yangi qator

print("Korpus muvaffaqiyatli saqlandi!")
```

---

## Xulosa

Korpus yaratish — bu bir martalik ish emas. Bu **siklik jarayon**.
1.  Yig‘asiz.
2.  Tozalaysiz.
3.  Ishlatib ko‘rasiz (Model o‘qitasiz).
4.  Xatolarini ko‘rib, yana yangi ma’lumot yig‘ishga qaytasiz.

"Lisoniy" platformasi orqali biz bu jarayonni avtomatlashtirib, o‘zbek tili uchun eng katta va sifatli bazani yaratishni maqsad qilganmiz. 🚀