**5.26-mavzu: Integration with PM Tools (Loyiha Boshqaruv Vositalari bilan Integratsiya)** bo‘yicha amaliy qo‘llanma.

AI agentlar izolyatsiyada ishlamasligi kerak. Ular ish jarayoni sodir bo‘ladigan joyda — Jira, Asana va Monday.com ichida yashashi va harakat qilishi lozim.

***

# 5.26. Integration with PM Tools: Jira, Asana va Monday.com da Agentlarni Sozlash

Biz agentlarni ikki xil usulda integratsiya qilishimiz mumkin: **Native (Ichki o‘rnatilgan)** va **Custom (Tashqi/API orqali)**.

## 1. Jira: Atlassian Intelligence va Rovo (Native)

Atlassian platformasi **"Rovo"** deb nomlangan AI agentlar tizimini taqdim etadi. Bu shunchaki chatbot emas, balki Jira va Confluence ma'lumotlarini to‘liq tushunadigan "Virtual Hamkasb"dir.

### Qanday sozlanadi va ishlatiladi?
1.  **Rovo Agents:** Jira Cloud admin panelidan `Atlassian Intelligence`ni yoqing. Rovo agentlari quyidagilarni bajaradi:
    *   **Natural Language to JQL:** Siz *"Mening ochiq qolgan va muddati o‘tgan vazifalarimni ko‘rsat"* deb yozasiz, Rovo buni murakkab JQL (Jira Query Language) kodiga aylantirib beradi.
    *   **Work Breakdown:** Katta "Epic" vazifalarni avtomatik ravishda kichik "User Stories" va "Sub-task"larga bo‘lib chiqadi.
    *   **Virtual Service Agent:** Jira Service Management (JSM) ichida ishlaydi. U kelib tushgan ticketlarni o‘zi tahlil qiladi, toifalaydi (triage) va Confluence bazasidan javob topib, mijozga yechim beradi. Bu 1-darajali (Tier-1) qo‘llab-quvvatlashni to‘liq avtomatlashtiradi.

## 2. Monday.com: Agent Factory (No-Code Builder)

Monday.com o‘zining **"Agent Factory"** vositasi orqali har kimga kod yozmasdan shaxsiy agent yaratish imkonini beradi.

### Qanday sozlanadi?
1.  **Role Definition:** Siz agentga aniq rol berasiz (masalan, "Email Triage Agent" yoki "Project Analyzer").
2.  **Trigger & Action:** "Agar status 'Done' ga o‘zgarsa (Trigger), Slack kanaliga xabar yoz va mijozga hisobot yubor (Action)" kabi mantiqni o‘rnatasiz.
3.  **Monday Sidekick:** Bu shaxsiy yordamchi bo‘lib, u yuzlab loyihalarni kuzatib boradi. Siz undan *"Qaysi loyihalar kechikmoqda va sababi nima?"* deb so‘rashingiz mumkin. U barcha doskalarni (boards) tahlil qilib, xatarlarni aniqlaydi.

## 3. Asana va MCP (Model Context Protocol)

Asana va boshqa vositalarni ulashda eng zamonaviy usul — bu **Microsoft Teams Channel Agent** yoki **MCP** (3.13-mavzuda o‘rganganimiz) dan foydalanishdir.

### Qanday ishlaydi?
Microsoft Teams endi MCP serverlari orqali Asana va Jira bilan to‘g‘ridan-to‘g‘ri gaplasha oladi.
*   **Prompt:** *"@ChannelAgent, ushbu yig'ilish bayonnomasidan Asana-da yangi vazifalar yarat va tegishli xodimlarga biriktir."*
*   **Jarayon:** Agent matnni tahlil qiladi $\rightarrow$ Asana API orqali vazifa yaratadi $\rightarrow$ Linkini chatga tashlaydi.

## 4. Custom Integration (n8n va Webhooks)

Agar sizga murakkabroq logika kerak bo‘lsa (masalan, Jira $\rightarrow$ AI tahlil $\rightarrow$ CRM yangilash), **n8n** yoki **LangChain** dan foydalaning.

*   **Ssenariy:** Jira-da "Bug" yaratilganda, AI agent uni kod bazasidan tekshirsin va yechim taklif qilsin.
*   **Architecture:**
    1.  **Webhook:** Jira-da yangi ticket ochilganda n8n ga signal yuboradi.
    2.  **Agent (LangChain/CrewAI):** Xato matnini oladi, GitHub-dan kodni qidiradi va "Fix Suggestion" tayyorlaydi.
    3.  **API Update:** Agent Jira ticketiga kommentariya sifatida yechimni yozib qo‘yadi.

---

### Xulosa: Qaysi birini tanlash kerak?
*   **Tez va oson:** Jira Rovo yoki Monday Agent Factory (Platformaning o‘zida).
*   **Moslashuvchan (Cross-Platform):** n8n yoki Zapier orqali bog‘langan Custom Agentlar.
*   **Jamoaviy Chat:** Microsoft Teams + MCP.

***

**Tabriklayman!** Siz **"5-Modul: Project Management with AI"** ni to‘liq yakunladingiz. Biz agentlarni yaratishdan tortib, ularni jamoa va loyihalarga integratsiya qilishgacha bo‘lgan yo‘lni bosib o‘tdik.