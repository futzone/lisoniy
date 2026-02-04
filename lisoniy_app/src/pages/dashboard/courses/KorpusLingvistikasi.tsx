import { CourseLayout } from "@/app/components/CourseLayout";

const themes = [
  { id: '1', title: 'Korpus Lingvistikasi nima?', slug: 'intro', filePath: '/courses/korpus-lingvistikasi.md' },
  { id: '2', title: 'Korpus turlari', slug: 'types', filePath: '/courses/korpus-turlari.md' },
  { id: '3', title: 'Annotatsiya usullari', slug: 'annotation', filePath: '/courses/annotatsiya-usullari.md' },
  { id: '4', title: 'Parallel matnlar', slug: 'parallel-texts', filePath: '/courses/parallel-matnlar.md' },
  { id: '5', title: 'Korpus yaratish', slug: 'building', filePath: '/courses/korpus-yaratish.md' },
  { id: '6', title: 'Korpus statistikasi', slug: 'statistics', filePath: '/courses/korpus-statistikasi.md' },
];

export function KorpusLingvistikasi() {
  return (
    <CourseLayout
      courseTitle="Korpus Lingvistikasi"
      themes={themes}
    />
  );
}
