# Lisoniy - O'zbek Tili Raqamli Kelajagi

A comprehensive linguistic AI platform for the Uzbek language, featuring NLP tools, corpus explorer, community hub, and AI models.

## 🚀 Features

### 1. **Landing Page (Home)**
- Hero section with compelling messaging
- Feature grid showcasing all modules
- Statistics display (1M+ sentences, 50+ models, 5K+ contributors)
- Professional gradient backgrounds with Lisoniy Blue theme

### 2. **NLP Playground (`/nlp`)**
- **Transliteration Tool**: Cyrillic ↔ Latin conversion with real-time processing
- **Tokenizer**: Advanced text tokenization with visual token classification
  - Word tokens (blue)
  - Numbers (green)
  - Punctuation (gray)
- **Spell Check**: Placeholder for future implementation

### 3. **Corpus Data Explorer (`/corpus`)**
- Rich data table with 8+ sample entries
- Advanced filtering by:
  - Genre (Huquqiy, Ta'lim, Texnologiya, Badiiy, etc.)
  - Year (2018-2024)
  - Search query
- JSONB metadata viewer with dialog modal
- Flexible data structure supporting various formats
- Export functionality

### 4. **Community Hub (`/hub`)**
- Forum-style feed with discussions and articles
- Post cards with:
  - Author avatars
  - Tags and categories
  - Upvote and comment counts
  - Timestamps
- **Sidebar Features**:
  - Top Contributors with rank badges
  - Trending Topics with counts
  - Quick action cards
- Fully responsive layout

### 5. **AI Chat Interface (`/ai`)**
- ChatGPT-style conversational UI
- Model selection:
  - Lisoniy-Llama-3
  - Mistral-Uz
  - GPT-Uz-Base
  - Lisoniy-Poet
- Features:
  - Real-time chat with typing indicators
  - Message history
  - Sample prompts for quick start
  - Model information display
  - Conversation clearing

## 🎨 Design System

### Color Palette
- **Primary**: `#2563eb` (Lisoniy Blue - blue-600)
- **Background**: `#ffffff` (Light) / `#020617` (Dark - slate-950)
- **Foreground**: `#0f172a` (Deep Navy)
- **Muted**: `#f1f5f9` (slate-50)
- **Border**: `#e2e8f0` (slate-200)

### Typography
- **Primary Font**: Inter (Sans-serif)
- **Literary Font**: Merriweather (for corpus text)
- Clean, modern, data-dense but readable

### UI Components
Built with Radix UI primitives:
- Buttons, Cards, Inputs, Textareas
- Tabs, Select dropdowns, Badges
- Dialog modals, Toast notifications
- Fully accessible and keyboard navigable

## 🛠️ Tech Stack

- **Framework**: React 18.3 + Vite 6.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI (Shadcn/UI architecture)
- **Routing**: React Router DOM v7
- **State Management**: React Hooks + Zustand
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📁 Project Structure

```
/src
  /app
    /components
      /layout
        Navbar.tsx          # Main navigation with search & theme toggle
      /ui                   # Reusable UI components (Shadcn)
        button.tsx
        card.tsx
        input.tsx
        tabs.tsx
        select.tsx
        badge.tsx
        textarea.tsx
        sonner.tsx         # Toast notifications
    App.tsx               # Main app with routing
  /pages
    HomePage.tsx          # Landing page with hero & features
    NLPPage.tsx          # NLP Playground (translit, tokenizer)
    CorpusPage.tsx       # Data explorer with table & filters
    HubPage.tsx          # Community forum & articles
    AIPage.tsx           # AI chat interface
  /hooks
    useTheme.ts          # Dark mode toggle hook
  /lib
    utils.ts             # Utility functions (cn, etc.)
  /styles
    fonts.css            # Google Fonts (Inter, Merriweather)
    theme.css            # CSS variables & design tokens
    tailwind.css         # Tailwind directives
    index.css            # Main stylesheet
```

## 🌐 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with features & stats |
| `/nlp` | NLP Playground | Transliteration & tokenization tools |
| `/corpus` | Corpus Explorer | Data table with filters & JSONB viewer |
| `/hub` | Community Hub | Forum, articles, contributors |
| `/ai` | AI Chat | Conversational AI interface |

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`
- Collapsible sidebar on mobile
- Adaptive layouts

### Dark Mode
- Full dark mode support
- System preference detection
- Manual toggle with localStorage persistence
- Smooth theme transitions

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus states
- Screen reader support

### Performance
- Lazy loading
- Optimized re-renders
- Efficient state management
- Code splitting with React Router

## 🔮 Mock Data

All modules use comprehensive mock data:
- **Corpus**: 8 sample entries across different genres
- **Forum**: 5 discussion posts with realistic metadata
- **AI**: Pre-programmed responses for demo
- **Contributors**: Top 5 ranked users
- **Trending**: 5 popular topics

## 🚦 Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run development server**:
   ```bash
   pnpm run dev
   ```

3. **Build for production**:
   ```bash
   pnpm run build
   ```

## 🔧 Future Enhancements

- [ ] Backend integration with REST API
- [ ] Real NLP model integration
- [ ] Database for corpus (PostgreSQL with JSONB)
- [ ] User authentication & profiles
- [ ] Real-time chat with WebSocket
- [ ] Dataset upload functionality
- [ ] Advanced search with Elasticsearch
- [ ] SEO optimization (migrate to Next.js)
- [ ] Markdown support for articles
- [ ] File export (CSV, JSON)

## 📝 Notes

- This is a **React + Vite** implementation (not Next.js)
- For better SEO, consider migrating to Next.js 14+ with App Router
- All text is in **Uzbek (Latin script)**
- Design inspired by Hugging Face, GitHub, and Vercel
- Professional, scientific, open-source vibe

## 🌍 Language

UI text is primarily in **O'zbek tili** (Uzbek - Latin script)

## 📄 License

Open Source - Contribute freely!

---

**Built with ❤️ for the Uzbek linguistic community**
