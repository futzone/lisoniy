import { ToolLandingPage } from "./ToolLandingPage";
import { Eye, User, MapPin, Building2, Tag, Sparkles, BarChart3 } from "lucide-react";

export function NERPage() {
  const features = [
    {
      title: "Shaxs nomlarini aniqlash",
      description: "Matndagi shaxs nomlarini avtomatik tanib olish va ajratish",
      icon: User
    },
    {
      title: "Geografik nomlar",
      description: "Shahar, viloyat, davlat va boshqa joylashuvlarni aniqlash",
      icon: MapPin
    },
    {
      title: "Tashkilotlar",
      description: "Kompaniya, muassasa va tashkilot nomlarini topish",
      icon: Building2
    },
    {
      title: "Vizual ko'rinish",
      description: "Topilgan nomlarni ranglar bilan ajratib ko'rsatish",
      icon: Eye
    },
    {
      title: "Kategoriyalash",
      description: "Har bir nomni tegishli kategoriyasiga avtomatik ajratish",
      icon: Tag
    },
    {
      title: "Statistika va tahlil",
      description: "Topilgan nomlar bo'yicha batafsil statistik ma'lumotlar",
      icon: BarChart3
    }
  ];

  return (
    <ToolLandingPage
      title="NER Vizualizator"
      description="Named Entity Recognition - matndan shaxs, joy va tashkilot nomlarini aniqlash va vizuallashtirish uchun zamonaviy AI vosita."
      icon={Eye}
      features={features}
      comingSoon={true}
    />
  );
}
