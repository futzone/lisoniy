**3.16-mavzu: Skill Libraries** (Skill Kutubxonalari) bo‘yicha amaliy dars. Bu mavzu agentlarni individual loyihalardan korporativ darajadagi **ekotizimga** aylantirishning kalitidir.

***

# 3.16. Skill Libraries: Tayyor Skill Kutubxonalarini Yaratish va Ulashish

Agentlar ko'paygani sari, bir xil funksiyani (masalan, "Jira ticket ochish" yoki "PDF o'qish") qayta-qayta yozish muammosi paydo bo'ladi. **Skill Library** — bu oldindan yozilgan, test qilingan va hujjatlashtirilgan vositalar to'plami bo'lib, ularni istalgan agentga "plug-and-play" usulida ulash mumkin.

2025-2026 yillarda bu **"Platform Team"**larning asosiy vazifasiga aylandi: ular agentlar emas, balki agentlar ishlatadigan **"legolar"ni (Skillarni)** yaratadilar.

---

## 1. Skill Library Arxitekturasi

Professional Skill shunchaki Python fayli emas. U qayta ishlatilishi uchun quyidagi 3 qavatdan iborat bo'lishi kerak:

1.  **Implementation Layer (Ijro):** Asl kod (masalan, API so'rovlari). Bu qatlam LLMdan mustaqil bo'lishi kerak.
2.  **Interface Layer (Schema):** Model tushunadigan JSON tavsifi (nomi, argumentlari, tiplari).
3.  **Documentation Layer (Prompting):** Agentga ushbu vositani qachon va qanday ishlatishni tushuntiruvchi yo'riqnoma (docstring).

> **Tamoyil:** "Bir marta yoz, hamma joyda ishlat." (Write once, use everywhere).

---

## 2. Model Context Protocol (MCP) — Ulashish Standarti

Hozirda Skillarni ulashishning eng zamonaviy usuli — **MCP (Model Context Protocol)**. Bu ochiq standart bo'lib, u orqali siz yaratgan Skill nafaqat sizning agentingizda, balki Claude Desktop, IDE yoki boshqa platformalarda ham ishlayveradi.

### MCP Server Konsepsiyasi:
Siz Skillarni **MCP Server** sifatida ishga tushirasiz. Agentlar (mijozlar) ushbu serverga ulanib, undagi barcha vositalarni (tools) avtomatik kashf qiladilar (discovery).

*   **Misol:** Siz kompaniyangiz uchun `Internal-DB-MCP` serverini yaratasiz.
*   **Natija:**
    *   *HR Agenti* unga ulanib, xodimlar ma'lumotini oladi.
    *   *Finans Agenti* unga ulanib, maoshlarni hisoblaydi.
    *   Kod o'zgarsa, faqat MCP server yangilanadi, agentlarga tegish shart emas.

---

## 3. Centralized Tool Catalog (Markazlashgan Katalog)

Katta tashkilotlarda **"Markaziy Skill Katalogi"** bo'lishi shart. Bu xavfsizlik va tartibni ta'minlaydi.

### Katalog Qoidalari:
1.  **Vetting (Tekshiruv):** Har bir skill xavfsizlik jamoasi tomonidan tekshirilishi kerak (masalan, `delete_database` skilli ochiq qolib ketmasligi uchun).
2.  **Identity & Access (RBAC):** Har bir agent hamma skillni ishlata olmasligi kerak. "Junior Dev Agent"ga "Production Deploy" skillini bermang.
3.  **Versioning:** Skill yangilanganda eski agentlar buzilmasligi uchun versiyalash (v1, v2) shart.

---

## 4. Amaliyot: Reusable Skill Yaratish

Keling, oddiy funksiyani qayta ishlatiladigan **Skill Moduli**ga aylantiramiz.

**❌ Yomon (Qayta ishlatib bo'lmaydi):**
Agent kodi ichida qolib ketgan funksiya:
```python
def send_slack(msg): # Faqat shu agent uchun ishlaydi
    requests.post("hooks.slack.com/...", json={"text": msg})
```

**✅ Yaxshi (Reusable Library Component):**
Buni alohida paket yoki MCP vositasi sifatida qadoqlaymiz:

```python
# skills/communications.py

from crewai_tools import BaseTool

class SlackNotificationTool(BaseTool):
    name: str = "Send Slack Notification"
    description: str = (
        "Muhim xabarlarni Slack kanaliga yuborish uchun ishlatiladi. "
        "Faqat favqulodda (critical) xabarlar yoki yakuniy hisobotlar uchun foydalaning. "
        "Oddiy loglar uchun ishlatmang."
    )

    def _run(self, message: str, channel: str = "#general") -> str:
        # Haqiqiy logika shu yerda
        return api_client.send(channel, message)
```

Endi bu faylni istalgan jamoa a'zosi `from skills.communications import SlackNotificationTool` deb chaqirib olishi mumkin.

---

## 5. Xulosa

*   **Skill Libraries** — bu agentlarni tezroq qurish usulidir. Jamoangiz har safar noldan boshlamasligi kerak.
*   **Platform Team:** Skillarni yaratadi, xavfsizligini ta'minlaydi va katalogga joylaydi.
*   **Product Team:** Katalogdan tayyor skillarni olib, o'z biznes vazifasiga mos agentlarni yig'adi (Assembly).

***

**Tabriklayman!** Siz **3-Modul: Skills & Tool Use** ni muvaffaqiyatli yakunladingiz. Endi sizning agentlaringiz nafaqat "miyaga" (Prompt), balki kuchli "qo'llarga" (Skills) ham ega.

Endi bitta emas, bir nechta agentni birgalikda ishlashga majburlash vaqti keldi. Biz eng qiziqarli qismga o'tamiz.

**4-Modul: AI Agentlar va Orkestratsiya (Tizimni Boshqarish)** ga o'tamiz!