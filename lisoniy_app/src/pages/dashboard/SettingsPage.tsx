import { ToolLandingPage } from "../tools/ToolLandingPage";
import { Settings, User, Bell, Lock, Palette, Globe, Shield } from "lucide-react";

export function SettingsPage() {
  const features = [
    {
      title: "Profil sozlamalari",
      description: "Shaxsiy ma'lumotlaringizni tahrirlash va boshqarish",
      icon: User
    },
    {
      title: "Bildirishnomalar",
      description: "Email va push bildirishnomalarni sozlash",
      icon: Bell
    },
    {
      title: "Xavfsizlik",
      description: "Parol va ikki faktorli autentifikatsiya sozlamalari",
      icon: Lock
    },
    {
      title: "Ko'rinish",
      description: "Interfeys rangi va mavzusini o'zgartirish",
      icon: Palette
    },
    {
      title: "Til sozlamalari",
      description: "Interfeys tilini tanlash va tilni sozlash",
      icon: Globe
    },
    {
      title: "Maxfiylik",
      description: "Ma'lumotlar maxfiyligi va profilni ko'rinish sozlamalari",
      icon: Shield
    }
  ];

  return (
    <ToolLandingPage
      title="Sozlamalar"
      description="Shaxsiy kabinet sozlamalari - profilingizni, xavfsizlikni va interfeys sozlamalarini boshqaring."
      icon={Settings}
      features={features}
      comingSoon={true}
    />
  );
}
