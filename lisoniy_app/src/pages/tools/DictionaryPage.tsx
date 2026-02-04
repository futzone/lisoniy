import { ToolLandingPage } from "./ToolLandingPage";
import { BookOpen, Search, Volume2, BookMarked, Languages, ListTree } from "lucide-react";

export function DictionaryPage() {
  const features = [
    {
      title: "Keng lug'at bazasi",
      description: "O'zbek tilining boy leksikasi bilan to'ldirilgan lug'at",
      icon: BookOpen
    },
    {
      title: "Tezkor qidiruv",
      description: "So'zlarni bir soniyada topish va ma'nosini olish",
      icon: Search
    },
    {
      title: "Talaffuz",
      description: "So'zlarning to'g'ri talaffuzi va audio namunalar",
      icon: Volume2
    },
    {
      title: "Sinonimlar va antonimlar",
      description: "Har bir so'z uchun sinonim va antonimlar ro'yxati",
      icon: BookMarked
    },
    {
      title: "Ko'p tillilik",
      description: "O'zbek-rus-ingliz lug'at integratsiyasi",
      icon: Languages
    },
    {
      title: "Morfologiya",
      description: "So'z shakllanishi va grammatik tahlil",
      icon: ListTree
    }
  ];

  return (
    <ToolLandingPage
      title="Lug'at"
      description="O'zbek tili lug'ati - so'zlarning ma'nosi, talaffuzi, sinonim va antonimlarini topish uchun keng qamrovli vosita."
      icon={BookOpen}
      features={features}
      comingSoon={true}
    />
  );
}
