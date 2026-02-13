import { CourseLayout } from "@/app/components/CourseLayout";

const themes = [
  // Kirish
  { id: 'kirish', title: '📘 Kurs haqida', slug: 'kirish', filePath: '/llm-pm/kirish.md' },
  
  // 1-Modul: Advanced Prompt Engineering
  { id: 'modul-1-kirish', title: '📚 1-Modul: Advanced Prompt Engineering', slug: 'modul-1-kirish', filePath: '/llm-pm/modul-1-kirish.md' },
  { id: '1', title: '1.1 Protocol-Based Prompting', slug: '1', filePath: '/llm-pm/modul-1-1.md' },
  { id: '2', title: '1.2 Chain-of-Thought & Reasoning', slug: '2', filePath: '/llm-pm/modul-1-2.md' },
  { id: '3', title: '1.3 Role & Persona Simulation', slug: '3', filePath: '/llm-pm/modul-1-3.md' },
  { id: '4', title: '1.4 Reverse Prompting', slug: '4', filePath: '/llm-pm/modul-1-4.md' },
  { id: '5', title: '1.5 Iterative Refinement Loops', slug: '5', filePath: '/llm-pm/modul-1-5.md' },
  
  // 2-Modul: Context Engineering
  { id: 'modul-2-kirish', title: '📚 2-Modul: Context Engineering', slug: 'modul-2-kirish', filePath: '/llm-pm/modul-2-kirish.md' },
  { id: '6', title: '2.1 Context Construction', slug: '6', filePath: '/llm-pm/modul-2-6.md' },
  { id: '7', title: '2.2 RAG Arxitekturalari', slug: '7', filePath: '/llm-pm/modul-2-7.md' },
  { id: '8', title: '2.3 Chunking Strategies', slug: '8', filePath: '/llm-pm/modul-2-8.md' },
  { id: '9', title: '2.4 Hybrid Search & Reranking', slug: '9', filePath: '/llm-pm/modul-2-9.md' },
  { id: '10', title: '2.5 Information Isolation', slug: '10', filePath: '/llm-pm/modul-2-10.md' },
  { id: '11', title: '2.6 "Lost in the Middle" Fenomeni', slug: '11', filePath: '/llm-pm/modul-2-11.md' },
  
  // 3-Modul: Skills & Tool Use
  { id: 'modul-3-kirish', title: '📚 3-Modul: Skills & Tool Use', slug: 'modul-3-kirish', filePath: '/llm-pm/modul-3-kirish.md' },
  { id: '12', title: '3.1 Defining Skills', slug: '12', filePath: '/llm-pm/modul-3-12.md' },
  { id: '13', title: '3.2 Model Context Protocol (MCP)', slug: '13', filePath: '/llm-pm/modul-3-13.md' },
  { id: '14', title: '3.3 Dynamic Tool Selection', slug: '14', filePath: '/llm-pm/modul-3-14.md' },
  { id: '15', title: '3.4 Function Calling & JSON Mode', slug: '15', filePath: '/llm-pm/modul-3-15.md' },
  { id: '16', title: '3.5 Skill Libraries', slug: '16', filePath: '/llm-pm/modul-3-16.md' },
  
  // 4-Modul: AI Agentlar va Orkestratsiya
  { id: 'modul-4-kirish', title: '📚 4-Modul: AI Agentlar va Orkestratsiya', slug: 'modul-4-kirish', filePath: '/llm-pm/modul-4-kirish.md' },
  { id: '17', title: '4.1 Single vs Multi-Agent Systems', slug: '17', filePath: '/llm-pm/modul-4-17.md' },
  { id: '18', title: '4.2 Agent Frameworks', slug: '18', filePath: '/llm-pm/modul-4-18.md' },
  { id: '19', title: '4.3 Orchestration Patterns', slug: '19', filePath: '/llm-pm/modul-4-19.md' },
  { id: '20', title: '4.4 Self-Reflection & Critique', slug: '20', filePath: '/llm-pm/modul-4-20.md' },
  { id: '21', title: '4.5 Human-in-the-Loop (HITL)', slug: '21', filePath: '/llm-pm/modul-4-21.md' },
  
  // 5-Modul: Project Management with AI
  { id: 'modul-5-kirish', title: '📚 5-Modul: Project Management with AI', slug: 'modul-5-kirish', filePath: '/llm-pm/modul-5-kirish.md' },
  { id: '22', title: '5.1 Automating Routine Tasks', slug: '22', filePath: '/llm-pm/modul-5-22.md' },
  { id: '23', title: '5.2 Dynamic Resource Optimization', slug: '23', filePath: '/llm-pm/modul-5-23.md' },
  { id: '24', title: '5.3 Risk Prediction & Analysis', slug: '24', filePath: '/llm-pm/modul-5-24.md' },
  { id: '25', title: '5.4 Soft Skills Simulation', slug: '25', filePath: '/llm-pm/modul-5-25.md' },
  { id: '26', title: '5.5 Integration with PM Tools', slug: '26', filePath: '/llm-pm/modul-5-26.md' },
  
  // 6-Modul: Limitlar, Xavfsizlik va Samaradorlik
  { id: 'modul-6-kirish', title: '📚 6-Modul: Limitlar, Xavfsizlik va Samaradorlik', slug: 'modul-6-kirish', filePath: '/llm-pm/modul-6-kirish.md' },
  { id: '27', title: '6.1 Token Optimization', slug: '27', filePath: '/llm-pm/modul-6-27.md' },
  { id: '28', title: '6.2 Hallucination Guardrails', slug: '28', filePath: '/llm-pm/modul-6-28.md' },
  { id: '29', title: '6.3 Identity & Governance', slug: '29', filePath: '/llm-pm/modul-6-29.md' },
  { id: '30', title: '6.4 Cost Attribution', slug: '30', filePath: '/llm-pm/modul-6-30.md' },
  { id: '31', title: '6.5 Security Protocols', slug: '31', filePath: '/llm-pm/modul-6-31.md' },
  { id: '32', title: '6.6 Testing & Evaluation', slug: '32', filePath: '/llm-pm/modul-6-32.md' },
  
  // Resurslar
  { id: 'sources', title: '📎 Resurslar va Manbalar', slug: 'sources', filePath: '/llm-pm/sources.md' },
];

export function LLMProjectManagement() {
  return <CourseLayout courseTitle="SI, KTM, Agentlar" themes={themes} />;
}
