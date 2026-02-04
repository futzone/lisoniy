import { CourseLayout } from "@/app/components/CourseLayout";

const themes = [
  { id: '1', title: 'NLP`ga kirish', slug: '1', filePath: '/nlp-themes/1.md' },
  { id: '2', title: 'NLP amalda', slug: '2', filePath: '/nlp-themes/2.md' },
  { id: '3', title: 'Bulutli va mahalliy yechimlar', slug: '3', filePath: '/nlp-themes/3.md' },
  { id: '4', title: ' Nutqni matnga (STT) texnologiyasi', slug: '4', filePath: '/nlp-themes/4.md' },
  { id: '5', title: 'STT bulutli yechimlari', slug: '5', filePath: '/nlp-themes/5.md' },
  { id: '6', title: 'Mahalliy (On-Premise) STT Tizimini Sozlash', slug: '6', filePath: '/nlp-themes/6.md' },
  { id: '7', title: 'STT Model Arxitekturalari', slug: '7', filePath: '/nlp-themes/7.md' },
  { id: '8', title: 'OpenAI Whisper Modellari', slug: '8', filePath: '/nlp-themes/8.md' },
  { id: '9', title: 'Alternativ STT Freymvorklari: Wav2Vec 2.0 va NVIDIA NeMo', slug: '9', filePath: '/nlp-themes/9.md' },
  { id: '10', title: 'ONNX yordamida Modellarni Optimallashtirish', slug: '10', filePath: '/nlp-themes/10.md' },
  { id: '11', title: 'STT Uchun Ma\'lumotlar Talablari', slug: '11', filePath: '/nlp-themes/11.md' },
  { id: '12', title: 'Matnni Nutqqa (TTS) Texnologiyasiga Kirish', slug: '12', filePath: '/nlp-themes/12.md' },
  { id: '13', title: 'Bulutli TTS Xizmatlari', slug: '13', filePath: '/nlp-themes/13.md' },
  { id: '14', title: 'VITS 2 — Eng Zamonaviy Mahalliy TTS', slug: '14', filePath: '/nlp-themes/14.md' },
  { id: '15', title: 'Meta MMS — Massiv Ko\'p Tilli Nutq', slug: '15', filePath: '/nlp-themes/15.md' },
  { id: '16', title: 'TTS Ma\'lumotlari', slug: '16', filePath: '/nlp-themes/16.md' },
  { id: '17', title: 'TTS Xulosasi', slug: '17', filePath: '/nlp-themes/17.md' },
  { id: '18', title: 'LLM ga Kirish', slug: '18', filePath: '/nlp-themes/18.md' },
  { id: '19', title: 'Bulutli LLM Xizmatlari', slug: '19', filePath: '/nlp-themes/19.md' },
  { id: '20', title: 'Mahalliy LLMlar', slug: '20', filePath: '/nlp-themes/20.md' },
  { id: '21', title: 'N-gramlar', slug: '21', filePath: '/nlp-themes/21.md' },
  { id: '22', title: 'So\'z Embeddinglari', slug: '22', filePath: '/nlp-themes/22.md' },
  { id: '23', title: 'Transformerlar', slug: '23', filePath: '/nlp-themes/23.md' },
  { id: '24', title: 'LLM O\'qitish', slug: '24', filePath: '/nlp-themes/24.md' },
  { id: '25', title: 'Ma\'lumotlar va Keyingi Qadamlar', slug: '25', filePath: '/nlp-themes/25.md' },
  { id: '26', title: 'RAG — Retrieval-Augmented Generation', slug: '26', filePath: '/nlp-themes/26.md' },
  { id: '27', title: 'Ochiq Manba Modellari', slug: '27', filePath: '/nlp-themes/27.md' },
  { id: '28', title: 'O\'quv Resurslari', slug: '28', filePath: '/nlp-themes/28.md' },
];

export function NLPBasics() {
  return <CourseLayout courseTitle="NLP Asoslari" themes={themes} />;
}
