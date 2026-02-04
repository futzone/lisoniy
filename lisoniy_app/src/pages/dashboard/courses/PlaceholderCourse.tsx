import { CourseLayout } from "@/app/components/CourseLayout";

interface PlaceholderCourseProps {
  courseTitle: string;
  emoji: string;
}

const themes = [
  { id: '1', title: 'Kirish', slug: 'intro' },
  { id: '2', title: 'Asosiy tushunchalar', slug: 'basics' },
  { id: '3', title: 'Amaliy qo\'llanilishi', slug: 'applications' },
];

export function PlaceholderCourse({ courseTitle, emoji }: PlaceholderCourseProps) {
  const markdownContent = `
# ${courseTitle}

${emoji} **Ushbu kurs hozirda ishlab chiqilmoqda!**

## Tez orada qo'shiladi

Biz ${courseTitle} kursi ustida faol ishlayapmiz. Kurs quyidagi mavzularni qamrab oladi:

### Rejalashtir Learn plan

1. **Nazariy asoslar**
   - Asosiy tushunchalar
   - Tarixiy rivojlanish
   - Zamonaviy yondashuvlar

2. **Amaliy ko'nikmalar**
   - Hands-on mashqlar
   - Real loyihalar
   - Best practices

3. **Ilg'or mavzular**
   - Zamonaviy texnologiyalar
   - Tadqiqot yo'nalishlari
   - Kelajak istiqbollari

## Eslatma

Iltimos, [Korpus Lingvistikasi](/dashboard/learn/korpus-lingvistikasi) kursini ko'ring - u to'liq tayyorlangan va foydalanish uchun tayyor!

### Yangilanishlardan xabardor bo'ling

Biz yangi kurslarni qo'shganimizda sizga xabar beramiz. Dashboard sahifangizni kuzatib boring!

---

*Ushbu sahifa yakinda yangilanadi 🚀*
`;

  return (
    <CourseLayout
      courseTitle={courseTitle}
      themes={themes}
      markdownContent={markdownContent}
    />
  );
}
