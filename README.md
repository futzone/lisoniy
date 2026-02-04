# Lisoniy - AI Ma'lumotlar To'plami Platformasi

Lisoniy — bu sun'iy intellekt (AI) modellarini o'qitish uchun turli xildagi ma'lumotlar to'plamlarini (dataset) yaratish, boshqarish va ommalashtirish uchun mo'ljallangan zamonaviy platforma.

## 🚀 Loyiha Haqida

Ushbu loyiha tadqiqotchilar, dasturchilar va ma'lumotlar muhandislariga sifatli AI ma'lumotlar to'plamlarini hamkorlikda yaratish imkonini beradi. Platforma o'zbek tili va boshqa tillar uchun korpuslar, buyruq-javob juftliklari (instructions) va NER (Named Entity Recognition) kabi murakkab ma'lumotlar tuzilmalarini qo'llab-quvvatlaydi.

## ✨ Asosiy Imkoniyatlar

- **Dataset Boshqaruvi**: Jamoatga ochiq (public) yoki shaxsiy (private) datasetlar yaratish.
- **Turli Dataset Turlari**:
  - `Instruction Dataset`: Buyruq-javob juftliklari.
  - `Parallel Corpus`: Tarjima modellari uchun parallel matnlar.
  - `NER Dataset`: Nomlangan entitylarni aniqlash uchun belgilangan matnlar.
  - `QA Dataset`: Savol-javob juftliklari.
  - `Sentiment/Classification`: Matn tahlili va tasniflash.
- **Tez Kiritish (Quick Add)**: Har bir dataset turi uchun optimallashtirilgan tezkor ma'lumot kiritish formasi (Ctrl+Enter qo'llab-quvvatlanadi).
- **Profil va Statistika**: Foydalanuvchi yutuqlari, reytingi va faoliyati statistikasi.
- **Ijtimoiy Funktsiyalar**: Datasetlarni yulduzchalar (star) bilan belgilash va ommaboplik tahlili.
- **Xavfsizlik**: Har bir foydalanuvchi uchun alohida kirish va ma'lumotlar himoyasi.

## 🛠 Texnologiyalar To'plami

### Frontend
- **React**: Interaktiv foydalanuvchi interfeysi.
- **TypeScript**: Kod sifatini ta'minlash.
- **Tailwind CSS**: Zamonaviy va moslashuvchan dizayn.
- **shadcn/ui**: Premium UI komponentlar kutubxonasi.
- **Lucide Icons**: Vizual piktogrammalar.
- **Zustand / Auth Store**: Holatni boshqarish.

### Backend
- **FastAPI**: Yuqori unumdorlikka ega Python asosi.
- **PostgreSQL**: Ishonchli relyatsion ma'lumotlar bazasi.
- **SQLAlchemy (Async)**: Ma'lumotlar bazasi bilan asinxron ishlash.
- **Docker & Docker Compose**: Oson joylashtirish va muhitni boshqarish.

## 📦 O'rnatish va Ishga Tushirish

### Talablar
- Docker va Docker Compose
- Node.js (Frontend uchun alohida ishlab chiqishda)
- Python 3.9+ (Backend uchun alohida ishlab chiqishda)

### Ishga Tushirish
1. Loyihani yuklab oling:
   ```bash
   git clone https://github.com/username/lisoniy.git
   cd lisoniy
   ```

2. Docker orqali ishga tushiring:
   ```bash
   docker compose up --build
   ```

3. Brauzerda quyidagi manzillarni oching:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000/docs`

## � Loyiha Tuzilmasi

Loyiha ikkita asosiy qismdan iborat:

- **`lisoniy_app/`**: Frontend qismi (React + Vite).
  - `src/api/`: API servislar va turlar.
  - `src/pages/`: Sahifalar (Dashboard, Explore, Dataset Detail va h.k.).
  - `src/app/components/`: Qayta ishlatiladigan UI komponentlar.
  - `src/store/`: Auth va global holat boshqaruvi.
- **`lisoniy_server/`**: Backend qismi (FastAPI).
  - `app/api/`: API routerlari va endpointlar.
  - `app/models/`: SQLAlchemy ma'lumotlar bazasi modellari.
  - `app/schemas/`: Pydantic validatsiya sxemalari.
  - `app/services/`: Biznes mantiqi va baza bilan ishlash serislari.

## 📡 API endpointlari haqida qisqacha

Platforma quyidagi asosiy API resurslarini taqdim etadi:

- `/auth`: Ro'yxatdan o'tish va login (JWT orqali).
- `/datasets`: Datasetlarni yaratish, o'chirish, tahrirlash va qidirish.
- `/datasets/{id}/meta`: Dataset metama'lumotlari (yulduzchalar, ko'rishlar).
- `/datasets/{id}/entries`: Dataset ichidagi yozuvlarni boshqarish.
- `/user-meta`: Foydalanuvchi profili va statistikasi.

## 🤝 Hissa Qo'shish

Biz loyihani rivojlantirish uchun har qanday yordamni (kod, xatoliklar haqida xabar, yangi g'oyalar) olqishlaymiz!

1. Loyihani **Fork** qiling.
2. Yangi funksiya uchun **Branch** yarating (`git checkout -b feature/YangiImkoniyat`).
3. O'zgarishlarni **Commit** qiling (`git commit -m 'Yangi imkoniyat qo'shildi'`).
4. **Push** qiling (`git push origin feature/YangiImkoniyat`).
5. **Pull Request** yuboring.

## 🗺 Kelajakdagi Rejalar

- [ ] Datasetlarni `.csv` va `.jsonl` formatlarida eksport qilish.
- [ ] Jamoaviy tahrirlash (Collaborative labeling) tizimi.
- [ ] Ma'lumotlarni avtomatik validatsiya qiluvchi AI agentlari integratsiyasi.
- [ ] O'zbek tili uchun maxsus pre-trained modellarni platforma orqali yuklab olish.

## �📝 Litsenziya

Ushbu loyiha litsenziyalangan (batafsil ma'lumotni loyiha sozlamalaridan ko'ring).

---
*Lisoniy - O'zbek tili uchun AI texnologiyalarini rivojlantirish yo'lida.*
