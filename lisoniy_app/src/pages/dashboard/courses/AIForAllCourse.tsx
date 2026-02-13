import { CourseLayout } from "@/app/components/CourseLayout";

const themes = [
  // Kirish
  { id: 'kirish', title: '📘 Kurs haqida', slug: 'kirish', filePath: '/ai-for-all/kirish.md' },
  
  // 1-Modul: SI Asoslari
  { id: 'modul-1-kirish', title: '📚 1-Modul: SI Asoslari', slug: 'modul-1-kirish', filePath: '/ai-for-all/modul-1-kirish.md' },
  { id: '1', title: '1.1 SI va KTM nima?', slug: '1', filePath: '/ai-for-all/1.md' },
  { id: '2', title: '1.2 ChatGPT, Claude, Gemini', slug: '2', filePath: '/ai-for-all/2.md' },
  { id: '3', title: '1.3 Bepul va pullik variantlar', slug: '3', filePath: '/ai-for-all/3.md' },
  { id: '4', title: '1.4 SI imkoniyatlari va cheklovlari', slug: '4', filePath: '/ai-for-all/4.md' },
  
  // 2-Modul: Prompt Engineering Asoslari
  { id: 'modul-2-kirish', title: '📚 2-Modul: Prompt Engineering', slug: 'modul-2-kirish', filePath: '/ai-for-all/modul-2-kirish.md' },
  { id: '5', title: '2.1 Yaxshi prompt nima?', slug: '5', filePath: '/ai-for-all/5.md' },
  { id: '6', title: '2.2 Rol berish texnikasi', slug: '6', filePath: '/ai-for-all/6.md' },
  { id: '7', title: '2.3 Kontekst va cheklovlar', slug: '7', filePath: '/ai-for-all/7.md' },
  { id: '8', title: '2.4 Misollar bilan o\'rgatish', slug: '8', filePath: '/ai-for-all/8.md' },
  { id: '9', title: '2.5 Bosqichma-bosqich fikrlash', slug: '9', filePath: '/ai-for-all/9.md' },
  
  // 3-Modul: Soha Bo'yicha Qo'llash
  { id: 'modul-3-kirish', title: '📚 3-Modul: Soha bo\'yicha qo\'llash', slug: 'modul-3-kirish', filePath: '/ai-for-all/modul-3-kirish.md' },
  { id: '10', title: '3.1 Ta\'lim va o\'qituvchilar', slug: '10', filePath: '/ai-for-all/10.md' },
  { id: '11', title: '3.2 Tibbiyot va sog\'liq', slug: '11', filePath: '/ai-for-all/11.md' },
  { id: '12', title: '3.3 Huquq va yuridik sohalar', slug: '12', filePath: '/ai-for-all/12.md' },
  { id: '13', title: '3.4 Marketing va sotuvlar', slug: '13', filePath: '/ai-for-all/13.md' },
  { id: '14', title: '3.5 Moliya va buxgalteriya', slug: '14', filePath: '/ai-for-all/14.md' },
  { id: '15', title: '3.6 Jurnalistika va kontent', slug: '15', filePath: '/ai-for-all/15.md' },
  
  // 4-Modul: SI Agentlar va Avtomatizatsiya
  { id: 'modul-4-kirish', title: '📚 4-Modul: Agentlar va Avtomatizatsiya', slug: 'modul-4-kirish', filePath: '/ai-for-all/modul-4-kirish.md' },
  { id: '16', title: '4.1 SI Agent nima?', slug: '16', filePath: '/ai-for-all/16.md' },
  { id: '17', title: '4.2 Vazifalarni avtomatlashtirish', slug: '17', filePath: '/ai-for-all/17.md' },
  { id: '18', title: '4.3 Email va xabarlar', slug: '18', filePath: '/ai-for-all/18.md' },
  { id: '19', title: '4.4 Hujjatlar va hisobotlar', slug: '19', filePath: '/ai-for-all/19.md' },
  { id: '20', title: '4.5 Jamoaviy ish', slug: '20', filePath: '/ai-for-all/20.md' },
  
  // 5-Modul: Xavfsizlik va Etika
  { id: 'modul-5-kirish', title: '📚 5-Modul: Xavfsizlik va Etika', slug: 'modul-5-kirish', filePath: '/ai-for-all/modul-5-kirish.md' },
  { id: '21', title: '5.1 Maxfiy ma\'lumotlar', slug: '21', filePath: '/ai-for-all/21.md' },
  { id: '22', title: '5.2 SI "gallyutsinatsiyalari"', slug: '22', filePath: '/ai-for-all/22.md' },
  { id: '23', title: '5.3 Tekshirish va tasdiqlash', slug: '23', filePath: '/ai-for-all/23.md' },
  { id: '24', title: '5.4 Etika va copyright', slug: '24', filePath: '/ai-for-all/24.md' },
  
  // Resurslar
  { id: 'resources', title: '📎 Foydali resurslar', slug: 'resources', filePath: '/ai-for-all/resources.md' },
];

export function AIForAllCourse() {
  return <CourseLayout courseTitle="Barcha Sohalar Uchun SI" themes={themes} />;
}
