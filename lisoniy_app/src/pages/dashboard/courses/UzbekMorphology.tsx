 import { CourseLayout } from "@/app/components/CourseLayout";

const themes = [
  { id: 1, title: "So'zning tuzilishi", slug: "soz-tuzulishi", filePath: "/courses/soz-tuzulishi.md" },
  { id: 2, title: "So'z turkumlari", slug: "soz-turkumlari", filePath: "/courses/soz-turkumlari.md" },
  { id: 3, title: "Yordamchi so'zlar", slug: "yordamchi-sozlar", filePath: "/courses/yordamchi-sozlar.md" },
  { id: 4, title: "O‘zbek tili agglutinativligi", slug: "agglyutinativ-tabiati", filePath: "/courses/agglutinativ-tabiati.md" },
  { id: 5, title: "Morfologik norm va uslubiyat", slug: "morfologik-norm-va-uslubiyat", filePath: "/courses/morfologik-norm.md" },
]

export function UzbekMorphology() {
  return <CourseLayout courseTitle="O'zbek Tili Morfologiyasi" emoji="🔤" themes={themes} />;
}
