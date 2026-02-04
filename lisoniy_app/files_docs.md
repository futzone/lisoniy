# Lisoniy Platform - Files Documentation

## Pages Documentation

### Public Pages (with Navbar/Footer)

**HomePage.tsx** - For showing landing page and platform introduction. Elements:
- Hero section with platform tagline and CTA buttons
- Statistics cards (datasets, models, community members)
- Featured datasets carousel
- Platform features showcase
- FAQ section with expandable items
- Quote section with JetBrains Mono font

**AboutPage.tsx** - For showing platform information and mission. Elements:
- Platform mission and vision description
- Team members showcase
- Core values cards
- Timeline of platform development
- Contact information

**NLPPage.tsx** - For showing NLP tools and technologies. Elements:
- NLP overview and introduction
- Available NLP tools list
- Technology stack showcase
- Use cases and examples
- Research papers and publications

**CorpusPage.tsx** - For showing corpus information and datasets. Elements:
- Corpus overview and statistics
- Available corpus types
- Data collection methods
- Download and access information
- Corpus quality metrics

**HubPage.tsx** - For showing models and resources hub. Elements:
- Models gallery
- Model cards with descriptions
- Filter and search functionality
- Model categories
- Download and integration guides

**AIPage.tsx** - For showing AI models and capabilities. Elements:
- AI models showcase
- Model performance metrics
- Interactive demos
- API integration examples
- Training information

**HamjamiyatPage.tsx** - For showing community content (articles and forum). Elements:
- Tab navigation (Articles/Forum)
- Articles list with filters
- Forum discussions with categories
- Search functionality
- Trending topics
- User contributions

**PostDetailPage.tsx** - For showing individual article details. Elements:
- Article title and metadata
- Author information
- Article content with markdown support
- Tags and categories
- Related articles
- Comments section

**DiscussionDetailPage.tsx** - For showing forum discussion details. Elements:
- Discussion title and metadata
- Original post content
- Replies and comments thread
- Vote/like functionality
- User avatars and profiles
- Best answer marking

**NewPostPage.tsx** - For creating new articles. Elements:
- Article title input
- Rich text editor
- Tag selection
- Category picker
- Preview functionality
- Publish button

**NewDiscussionPage.tsx** - For creating new forum discussions. Elements:
- Discussion title input
- Content editor
- Category selection
- Tags input
- Submit button

**TagPage.tsx** - For showing content filtered by tag. Elements:
- Tag information
- Related articles/discussions
- Tag statistics
- Similar tags
- Filter options

**AuthorPage.tsx** - For showing author profile and contributions. Elements:
- Author bio and avatar
- Author statistics
- Published articles list
- Forum discussions
- Social links
- Achievements

**NotFoundPage.tsx** - For showing 404 error page. Elements:
- 404 message
- Navigation suggestions
- Back to home button
- Search functionality

---

### Authentication Pages (no Navbar/Footer)

**LoginPage.tsx** - For user authentication. Elements:
- Email input field
- Password input field
- Remember me checkbox
- Login button
- Forgot password link
- Register link
- Social login options

**RegisterPage.tsx** - For new user registration. Elements:
- Name input field
- Email input field
- Password input field
- Confirm password field
- Terms acceptance checkbox
- Register button
- Login link

**ResetPasswordPage.tsx** - For password reset request. Elements:
- Email input field
- Submit button
- Success message display
- Back to login link

**VerifyEmailPage.tsx** - For email verification. Elements:
- Verification status message
- Resend verification link
- Continue to dashboard button

---

### Dashboard Pages (with Sidebar, no Navbar/Footer)

**DashboardPage.tsx** - For showing main dashboard overview. Elements:
- User statistics cards (Projects, Requests, Datasets, Articles)
- Recent activity feed
- Quick actions menu
- Navigation sidebar with all sections
- User profile dropdown
- Logout button

**ExploreDatasetsPage.tsx** - For browsing and searching datasets. Elements:
- Search bar with filters
- Dataset type filters (Text, Audio, Image, etc.)
- Dataset cards with statistics
- Pagination
- Sort options
- View toggle (grid/list)

**MyContributionsPage.tsx** - For showing user's contributions. Elements:
- Contributions summary statistics
- Tab navigation (Discussions, Articles, Datasets)
- Contribution cards with status
- Filter by date/type
- View all links

**DatasetDetailPage.tsx** - For showing dataset detailed information. Elements:
- Dataset title and description
- Metadata and statistics
- Download buttons
- JSONB data viewer
- Usage examples
- Version history
- License information

**CreateDatasetPage.tsx** - For creating new datasets. Elements:
- Dataset name input
- Description textarea
- Category/type selector
- File upload area
- Metadata fields
- Tags input
- Visibility settings
- Submit button

**AllDiscussionsPage.tsx** - For showing all user discussions. Elements:
- Discussions list
- Filter and sort controls
- Search functionality
- Status indicators
- Pagination

**AllArticlesPage.tsx** - For showing all user articles. Elements:
- Articles list with thumbnails
- Status badges (Published/Draft)
- Edit/Delete actions
- Filter options
- Search bar

**AllDatasetsPage.tsx** - For showing all user datasets. Elements:
- Dataset cards
- Statistics per dataset
- Manage options
- Filter controls
- Upload new dataset button

**LearnPage.tsx** - For showing learning courses catalog. Elements:
- Course categories grid
- Course cards with progress
- Filter by difficulty/topic
- Featured courses
- Completion badges

**SettingsPage.tsx** - For user account settings. Elements:
- Profile settings tab
- Account security tab
- API tokens management
- Notification preferences
- Theme toggle
- Language selection
- Privacy settings
- Delete account option

**ProfilePage.tsx** - For showing user profile. Elements:
- User avatar and bio
- Statistics cards (Datasets, Articles, Discussions, Code)
- Recent activity timeline
- Achievements and badges
- Social links
- Tabs (Activity, Achievements, Statistics)
- Points and ranking display

**LeaderboardPage.tsx** - For showing top contributors ranking. Elements:
- Leaderboard table with rankings
- User cards with stats
- Category filters (Overall, Datasets, Articles, Discussions, Code)
- Search users functionality
- Badge system display
- Points explanation card
- Monthly statistics

---

### Course Pages (with Course Layout)

**LearnPage.tsx** - For showing courses catalog. Elements:
- Course grid with 6 categories
- Course card thumbnails
- Description and duration
- Start course button
- Progress indicators

**KorpusLingvistikasi.tsx** - For Corpus Linguistics course. Elements:
- Three-panel layout (themes sidebar, content, TOC)
- Theme list with navigation
- Markdown content rendering
- Syntax highlighting for code
- Previous/Next navigation buttons
- Auto-generated table of contents
- Back button to courses

**UzbekMorphology.tsx** - For Uzbek Morphology course. Elements:
- Same layout as KorpusLingvistikasi
- Morphology-specific themes
- Interactive examples
- Language structure diagrams

**NLPBasics.tsx** - For NLP Basics course. Elements:
- Same layout structure
- Beginner-friendly content
- Step-by-step tutorials
- Practice exercises

**LargeLanguageModels.tsx** - For LLM course. Elements:
- Same layout structure
- Advanced topics
- Model architectures
- Fine-tuning guides

**SpeechTechnologies.tsx** - For Speech Technologies course. Elements:
- Same layout structure
- Audio processing topics
- ASR and TTS content
- Practical examples

**SpecializedAreas.tsx** - For Specialized NLP Areas course. Elements:
- Same layout structure
- Advanced topics
- Research papers
- Implementation guides

---

### Tool Pages (with Sidebar, no Navbar/Footer)

**TransliterationPage.tsx** - For text transliteration tool. Elements:
- Input textarea (Latin/Cyrillic)
- Output textarea
- Direction toggle (Latin ↔ Cyrillic)
- Copy to clipboard button
- Clear button
- Example texts
- Transliteration rules display

**SpellcheckerPage.tsx** - For spell checking tool. Elements:
- Text input area
- Check spelling button
- Errors list with suggestions
- Replace/Ignore actions
- Statistics (errors count)
- Language selector
- Custom dictionary

**NERPage.tsx** - For Named Entity Recognition visualization. Elements:
- Text input area
- Analyze button
- Entity highlighting with colors
- Entity types legend
- Entity list with counts
- Export results option
- Model selector

**DictionaryPage.tsx** - For Uzbek dictionary tool. Elements:
- Search input
- Word definitions display
- Pronunciation guide
- Usage examples
- Related words
- Translation options
- Word categories

---

### Documentation Pages (with Sidebar, no Navbar/Footer)

**APIDocsPage.tsx** - For API documentation. Elements:
- API introduction and features
- Authentication guide with token setup
- Code examples (Python, JavaScript, cURL)
- Copy code buttons
- API endpoints list with methods
- Parameters documentation
- Rate limits information
- Example responses

**GuidelinesPage.tsx** - For community guidelines. Elements:
- Community values cards
- Guidelines by category (Datasets, Articles, Forum, Code)
- Do's and Don'ts lists
- Reporting system information
- Best practices
- Badge explanations

**OpenSourcePage.tsx** - For open source projects showcase. Elements:
- GitHub statistics overview
- Repository cards with stars/forks
- Language indicators
- License badges
- Packages/SDK list
- Download statistics
- Contributing guide with steps
- Links to repositories

---

## Components Documentation

### Layout Components

**Navbar.tsx** - For main navigation bar. Elements:
- Lisoniy logo
- Navigation links (Bosh sahifa, NLP, Korpus, Hub, AI, Hamjamiyat)
- Search button
- Login/Register buttons or user menu
- Mobile menu toggle
- Responsive design

**Footer.tsx** - For page footer. Elements:
- Platform description
- Quick links sections
- Social media icons
- Copyright information
- Newsletter signup
- Contact information

**Sidebar.tsx** - For dashboard/tools sidebar navigation. Elements:
- Logo and platform name
- Navigation sections with icons
- Active link highlighting
- User profile section
- Logout button
- Collapsible on mobile

---

### Course Components

**CourseLayout.tsx** - For course page layout. Elements:
- Left sidebar with themes list
- Main content area with markdown rendering
- Right sidebar with table of contents
- Mobile responsive overlay sidebar
- Previous/Next theme navigation
- Back to courses button
- Active theme highlighting with primary color
- Syntax highlighting for code blocks
- Auto-generated heading IDs for TOC

---

### UI Components (from @/app/components/ui/)

**button.tsx** - Reusable button component with variants
**card.tsx** - Card container component
**input.tsx** - Form input component
**badge.tsx** - Badge/label component
**avatar.tsx** - User avatar component
**tabs.tsx** - Tab navigation component
**scroll-area.tsx** - Custom scrollable area
**dialog.tsx** - Modal dialog component
**dropdown-menu.tsx** - Dropdown menu component
**select.tsx** - Select/dropdown input
**textarea.tsx** - Multiline text input
**checkbox.tsx** - Checkbox input
**switch.tsx** - Toggle switch
**toast.tsx** - Toast notification
**sonner.tsx** - Toast notification system

---

## Store (State Management)

**authStore.ts** - For authentication state management. Elements:
- User object with name, email, avatar
- Login/logout functions
- Register function
- Password reset function
- Auth state persistence
- Token management

---

## Routes Structure

### Public Routes (with Navbar/Footer):
- `/` - HomePage
- `/about` - AboutPage
- `/nlp` - NLPPage
- `/corpus` - CorpusPage
- `/hub` - HubPage
- `/ai` - AIPage
- `/hamjamiyat` - HamjamiyatPage
- `/hamjamiyat/post/:postId` - PostDetailPage
- `/hamjamiyat/discussion/:discussionId` - DiscussionDetailPage
- `/hamjamiyat/new-post` - NewPostPage
- `/hamjamiyat/new-discussion` - NewDiscussionPage
- `/hamjamiyat/tag/:tag` - TagPage
- `/hamjamiyat/author/:authorSlug` - AuthorPage

### Auth Routes (no Navbar/Footer):
- `/auth/login` - LoginPage
- `/auth/register` - RegisterPage
- `/auth/reset-password` - ResetPasswordPage
- `/auth/verify-email` - VerifyEmailPage

### Dashboard Routes (with Sidebar, no Navbar/Footer):
- `/dashboard` - DashboardPage
- `/dashboard/explore-datasets` - ExploreDatasetsPage
- `/dashboard/contributions` - MyContributionsPage
- `/dashboard/contributions/discussions` - AllDiscussionsPage
- `/dashboard/contributions/articles` - AllArticlesPage
- `/dashboard/contributions/datasets` - AllDatasetsPage
- `/dashboard/dataset/:datasetId` - DatasetDetailPage
- `/dashboard/create-dataset` - CreateDatasetPage
- `/dashboard/settings` - SettingsPage
- `/dashboard/profile` - ProfilePage
- `/dashboard/learn` - LearnPage
- `/dashboard/learn/korpus-lingvistikasi` - KorpusLingvistikasi
- `/dashboard/learn/uzbek-morphology` - UzbekMorphology
- `/dashboard/learn/nlp-basics` - NLPBasics
- `/dashboard/learn/large-language-models` - LargeLanguageModels
- `/dashboard/learn/speech-technologies` - SpeechTechnologies
- `/dashboard/learn/specialized-areas` - SpecializedAreas

### Tool Routes (with Sidebar, no Navbar/Footer):
- `/tools/transliteration` - TransliterationPage
- `/tools/spellchecker` - SpellcheckerPage
- `/tools/ner` - NERPage
- `/tools/dictionary` - DictionaryPage

### Community & Docs Routes (with Sidebar, no Navbar/Footer):
- `/hamjamiyat/leaderboard` - LeaderboardPage
- `/docs/api` - APIDocsPage
- `/docs/guidelines` - GuidelinesPage
- `/docs/opensource` - OpenSourcePage

---

## Styling and Design System

### Fonts:
- **Nunito** - Main font for all text (better readability)
- **JetBrains Mono** - Only for homepage quote (technical aesthetic)

### Color Scheme:
- **Deep Navy** (#0f172a) - Primary dark color
- **Slate Gray** (#64748b) - Secondary/muted text
- **Pure White** - Background and text
- **Blue to Purple Gradient** - Brand colors for logo and accents
- **Primary Color** - Used for active states and highlights

### Design Principles:
- Academic yet Modern aesthetic
- Inspired by Hugging Face, Vercel, and GitHub
- Data-rich but organized layout
- High information density
- Responsive across all breakpoints
- Fumadocs-style for course TOC sidebar
- Clean and minimal interface

---

## Technical Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Shadcn/UI** - Component library
- **React Router** - Navigation
- **Zustand** - State management
- **React Markdown** - Markdown rendering
- **Rehype/Remark** - Markdown processing
- **Syntax Highlighting** - Code blocks
- **Lucide React** - Icons

---

## Data Handling

- Universal string types for text data
- JSONB structure for flexible data
- Mock data for demonstrations
- Dataset viewer with JSON formatting
- API integration ready structure
- Responsive data tables
- Dynamic filtering and sorting

---

*Last updated: January 28, 2026*
