import { ToolLandingPage } from "./ToolLandingPage";
import { CheckSquare, AlertCircle, Lightbulb, Zap, BookOpen, FileText } from "lucide-react";

export function SpellcheckerPage() {
  const features = [
    {
      title: "Xatolarni aniqlash",
      description: "O'zbek tilida yozilgan matndagi imlo xatolarini avtomatik aniqlash",
      icon: AlertCircle
    },
    {
      title: "Tuzatish takliflari",
      description: "Har bir xato uchun eng mos tuzatish variantlarini taklif qilish",
      icon: Lightbulb
    },
    {
      title: "Tezkor tekshirish",
      description: "Real vaqt rejimida matn tekshirish va tezkor natija olish",
      icon: Zap
    },
    {
      title: "Kontekstual tahlil",
      description: "Jumla kontekstini hisobga olgan holda xatolarni aniqlash",
      icon: FileText
    },
    {
      title: "Lug'at integratsiyasi",
      description: "Keng qamrovli o'zbek tili lug'ati bilan ishlash",
      icon: BookOpen
    },
    {
      title: "Grammatika qoidalari",
      description: "O'zbek tili grammatikasi qoidalariga asoslangan tekshirish",
      icon: CheckSquare
    }
  ];

  return (
    <ToolLandingPage
      title="Imlo tekshiruv"
      description="O'zbek tilidagi matnlardagi imlo xatolarini aniqlash va tuzatish uchun sun'iy intellekt asosida ishlovchi zamonaviy vosita."
      icon={CheckSquare}
      features={features}
      comingSoon={true}
    />
  );
}
