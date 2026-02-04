# Korpus statistikasi

Bu qo‘llanma tilshunoslarni "matn o‘qish"dan "matnni o‘lchash"ga o‘tkazadi.

---

# 📊 Korpus Tahlili Metodlari: Matnlar Ichidagi Raqamlar

Korpus lingvistikasi — bu tilni **mikroskop** ostida ko‘rish demakdir. Oddiy o‘quvchi matnni o‘qib mazmunini tushunsa, korpus lingvisti (yoki kompyuter) matn ichidan yashirin qonuniyatlarni, statistik bog‘liqliklarni qidiradi.

Biz siz bilan uchta eng muhim tahlil qurolini o‘rganamiz: **Chastota**, **Konkordans** va **Kollokatsiya**.

---

## 1. Chastotaviy Lug‘atlar (Frequency Lists) 📈

Bu eng oddiy, lekin eng kuchli tahlil usuli. Bu shunchaki: **"Qaysi so‘z necha marta ishlatildi?"** degan savolga javob beradi.

### Nega bu muhim?
1.  **Til o‘rgatishda:** Chet ellik talabaga o‘zbek tilini o‘rgatishni "Ehtimollik nazariyasi" so‘zidan boshlamaysiz-ku? Unga eng ko‘p ishlatiladigan 1000 ta so‘z (Core Vocabulary) kerak.
2.  **Muallif uslubi:** Agar biror matnda "dilbar" so‘zi 50 marta ishlatilgan bo‘lsa, bu Alisher Navoiy yoki mumtoz adabiyotga tegishli ekanligini taxmin qilish mumkin.
3.  **Zipf Qonuni (Zipf's Law):** Har qanday tilda eng ko‘p ishlatiladigan so‘z (rank 1) ikkinchi o‘rindagi so‘zdan (rank 2) ikki barobar ko‘p uchraydi.

### 🐍 Python Example: Word Counter

```python
from collections import Counter
import re

text = """
O'zbekiston — buyuk davlat. O'zbekiston kelajagi buyuk. 
Biz yoshlar O'zbekiston uchun xizmat qilamiz.
"""

# 1. Tozalash va tokenizatsiya (Soddalashtirilgan)
tokens = re.findall(r"\w+|[^\w\s]", text.lower())

# 2. Sanash
freq_list = Counter(tokens)

print(f"{'So‘z':<15} | {'Soni':<5}")
print("-" * 25)
for word, count in freq_list.most_common(5):
    print(f"{word:<15} | {count:<5}")
```

**Natija:**
```text
So‘z            | Soni 
-------------------------
o'zbekiston     | 3    
buyuk           | 2    
.               | 2    
davlat          | 1    
kelajagi        | 1    
```

> **Stopwords (To‘xta so‘zlar):** Ro‘yxatning boshida odatda *va, da, ni, bilan* kabi ma’nosiz yordamchi so‘zlar turadi. Tahlil paytida ularni filtrlash kerak.

---

## 2. Konkordans (KWIC - Key Word In Context) 🔍

Chastota bizga "qancha" ekanini aytsa, Konkordans "qanday" ekanini aytadi.
Bu usul **KWIC** (Key Word In Context) deb ham ataladi.

Tasavvur qiling, siz qidiruv tizimiga "yuz" deb yozdingiz. Tizim sizga shunchaki "yuz" so‘zi bor sahifalarni emas, balki u gapning o‘rtasida qanday kelganini ko‘rsatadi.

### Strukturasi:
`Chap kontekst`  << **KALIT SO‘Z** >> `O‘ng kontekst`

### Nega kerak?
**Ma’noni ajratish (Disambiguation):**
*   "... suvda suzib **yuz** ..." -> (Fe’l)
*   "... chiroyli **yuz** ..." -> (Ot)
*   "... **yuz** ming so‘m ..." -> (Son)

### 🐍 Python Example: KWIC Viewer

```python
def kwic_search(keyword, text, window=20):
    # Matnni kichik harfga o'tkazamiz
    text_lower = text.lower()
    keyword = keyword.lower()
    
    # Barcha joylashuvlarni topamiz
    import re
    matches = [m.start() for m in re.finditer(re.escape(keyword), text_lower)]
    
    print(f"KWIC tahlili: '{keyword.upper()}'\n")
    for idx in matches:
        # Chap va O'ng tomonlarni qirqib olish
        start = max(0, idx - window)
        end = min(len(text), idx + len(keyword) + window)
        
        snippet = text[start:end].replace('\n', ' ')
        
        # Chiroyli formatlash
        left = text[start:idx].replace('\n', ' ').rjust(window)
        center = text[idx:idx+len(keyword)]
        right = text[idx+len(keyword):end].replace('\n', ' ').ljust(window)
        
        print(f"{left} [{center}] {right}")

sample_text = "Bugun bozorda olma narxi tushdi. Men yangi telefon olma demoqchi edim. Olma daraxti gulladi."
kwic_search("olma", sample_text, window=15)
```

**Natija:**
```text
KWIC tahlili: 'OLMA'

  Bugun bozorda [olma]  narxi tushdi. 
n yangi telefon [olma]  demoqchi edim.
           .    [Olma]  daraxti gulladi
```
*(Ko‘rib turganingizdek, kontekst orqali biz qaysi biri meva, qaysi biri fe’l ekanini bilib olamiz)*

---

## 3. Kollokatsiyalar (Collocations) 🤝

Tilshunoslikdagi eng qiziq qism! Kollokatsiya — bu so‘zlarning "do‘stligi". Ba’zi so‘zlar doim birga yurishni yaxshi ko‘radi.

> **Misol:**
> *   ✅ "Shiddatli yomg‘ir" (Tabiiy)
> *   ❌ "Kuchli yomg‘ir" (Tushunarli, lekin g‘alati)
> *   ❌ "Dahshatli yomg‘ir" (Kam ishlatiladi)

Ingliz tilida: *Strong tea* (To‘g‘ri), *Powerful tea* (Xato).
O‘zbek tilida: *Osh damlamoq* (To‘g‘ri), *Osh pishirmoq* (Oddiy).

### Statistik O‘lchovlar (Metrics)
Kompyuter qaysi so‘zlar "do‘st" ekanini qayerdan biladi? Ular yonma-yon kelish **ehtimolligini** hisoblaydi.
1.  **T-score:** So‘zlar tasodifan emas, balki qonuniyat asosida birga kelganini tekshiradi.
2.  **MI Score (Mutual Information):** Ikki so‘z bir-biriga qanchalik qattiq bog‘langanini o‘lchaydi.

### 🐍 Python Example: NLTK Collocations

Bu misol uchun bizga `nltk` kutubxonasi kerak bo‘ladi (Professional tahlil).

```python
import nltk
from nltk.collocations import BigramCollocationFinder
from nltk.metrics import BigramAssocMeasures

# Korpus (tokenlar ro'yxati)
corpus_tokens = [
    "sun'iy", "intellekt", "kelajak", "texnologiyasi",
    "sun'iy", "intellekt", "biznes", "uchun",
    "yurak", "xuruji", "shifokor", "qabuli",
    "sun'iy", "yo'ldosh", "kosmos", "kema",
    "qon", "bosimi", "yurak", "urishi"
]

# 1. Bigramma qidiruvchini yaratish
finder = BigramCollocationFinder.from_words(corpus_tokens)

# 2. Kam uchraydiganlarni o'chirish (shovqinni tozalash)
finder.apply_freq_filter(2) 

# 3. Eng kuchli kollokatsiyalarni topish (PMI - Pointwise Mutual Information bo'yicha)
bigram_measures = BigramAssocMeasures()
collocations = finder.nbest(bigram_measures.pmi, 5)

print("Top Kollokatsiyalar:")
for pair in collocations:
    print(f"{pair[0]} + {pair[1]}")
```

**Natija:**
```text
Top Kollokatsiyalar:
sun'iy + intellekt
```
*(Chunki "sun'iy" va "intellekt" so‘zlari bu kichik korpusda doim birga keldi)*

---

## Xulosa

Korpus statistikasi — bu raqamlar orqali tilning portretini chizishdir.
*   **Chastota** bizga so‘zning **mashhurligini** aytadi.
*   **Konkordans** bizga so‘zning **muhitini** ko‘rsatadi.
*   **Kollokatsiya** bizga so‘zning **do‘stlarini** tanishtiradi.

"Lisoniy" platformasida biz mana shu uchala vositani ham interaktiv tarzda taqdim etamiz. Siz shunchaki so‘zni kiritasiz, biz esa sizga uning butun "biografiyasi"ni chiqarib beramiz. 🚀