import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/app/components/layout/Navbar";
import { Footer } from "@/app/components/layout/Footer";
import { HomePage } from "@/pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import { NLPPage } from "@/pages/NLPPage";
import { CorpusPage } from "@/pages/CorpusPage";
import { HubPage } from "@/pages/HubPage";
import { HamjamiyatPage } from "@/pages/HamjamiyatPage";
import { PostDetailPage } from "@/pages/PostDetailPage";
import { NewPostPage } from "@/pages/NewPostPage";
import { NewDiscussionPage } from "@/pages/NewDiscussionPage";
import { TagPage } from "@/pages/TagPage";
import { AuthorPage } from "@/pages/AuthorPage";
import { AIPage } from "@/pages/AIPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { VerifyEmailPage } from "@/pages/auth/VerifyEmailPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { ExploreDatasetsPage } from "@/pages/dashboard/ExploreDatasetsPage";
import { MyContributionsPage } from "@/pages/dashboard/MyContributionsPage";
import { DatasetDetailPage } from "@/pages/dashboard/DatasetDetailPage";
import { CreateDatasetPage } from "@/pages/dashboard/CreateDatasetPage";
import { EditDatasetPage } from "@/pages/dashboard/EditDatasetPage";
import { QuickAddEntryPage } from "@/pages/dashboard/QuickAddEntryPage";
import { AllDiscussionsPage } from "@/pages/dashboard/AllDiscussionsPage";
import { AllArticlesPage } from "@/pages/dashboard/AllArticlesPage";
import { AllDatasetsPage } from "@/pages/dashboard/AllDatasetsPage";
import { LearnPage } from "@/pages/dashboard/LearnPage";
import { KorpusLingvistikasi } from "@/pages/dashboard/courses/KorpusLingvistikasi";
import { UzbekMorphology } from "@/pages/dashboard/courses/UzbekMorphology";
import { NLPBasics } from "@/pages/dashboard/courses/NLPBasics";
import { LargeLanguageModels } from "@/pages/dashboard/courses/LargeLanguageModels";
import { SpeechTechnologies } from "@/pages/dashboard/courses/SpeechTechnologies";
import { SpecializedAreas } from "@/pages/dashboard/courses/SpecializedAreas";
import { LLMProjectManagement } from "@/pages/dashboard/courses/LLMProjectManagement";
import { AIForAllCourse } from "@/pages/dashboard/courses/AIForAllCourse";
import { TransliterationPage } from "@/pages/tools/TransliterationPage";
import { SpellcheckerPage } from "@/pages/tools/SpellcheckerPage";
import { NERPage } from "@/pages/tools/NERPage";
import { DictionaryPage } from "@/pages/tools/DictionaryPage";
import { SettingsPage } from "@/pages/dashboard/SettingsPage";
import { ProfilePage } from "@/pages/dashboard/ProfilePage";
import { PublicProfilePage } from "@/pages/PublicProfilePage";
import { TermsPage } from "@/pages/dashboard/TermsPage";
import { LeaderboardPage } from "@/pages/dashboard/LeaderboardPage";
import { APIDocsPage } from "@/pages/docs/APIDocsPage";
import { GuidelinesPage } from "@/pages/docs/GuidelinesPage";
import { OpenSourcePage } from "@/pages/docs/OpenSourcePage";
import { PrivacyPolicy } from "@/pages/docs/PrivacyPolicy";
import { TermsOfService } from "@/pages/docs/TermsOfService";
import { ChangelogPage } from "@/pages/docs/ChangelogPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { Toaster } from "@/app/components/ui/sonner";
import { ProtectedRoute } from "@/app/components/auth/ProtectedRoute";

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link, useLocation } from "react-router-dom"; 
import { X, LayoutDashboard, Database, BookOpen, FileUp, Languages, CheckSquare, Eye, BookA, FileText, MessageSquare, Trophy, Code, BookMarked, Github, User, Settings, ScrollText } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Navbar } from "@/app/components/layout/Navbar";
import { Footer } from "@/app/components/layout/Footer";
// ... imports

// Sidebar config copy
const sidebarSections = [
    {
        id: 'main',
        title: 'Asosiy',
        items: [
            { id: 'dashboard', label: 'Bosh sahifa', icon: LayoutDashboard, href: '/dashboard' },
            { id: 'explore', label: 'Datasetlarni ko\'rish', icon: Database, href: '/dashboard/explore-datasets' },
            { id: 'learn', label: 'O\'rganing', icon: BookOpen, href: '/dashboard/learn' },
            { id: 'contributions', label: 'Mening hissalarim', icon: FileUp, href: '/dashboard/contributions' },
        ]
    },
    {
        id: 'linguistic',
        title: 'Til asboblari',
        items: [
            { id: 'transliteration', label: 'Transliteratsiya', icon: Languages, href: '/tools/transliteration' },
            { id: 'spellchecker', label: 'Imlo tekshiruv', icon: CheckSquare, href: '/tools/spellchecker' },
            { id: 'ner', label: 'NER Vizualizator', icon: Eye, href: '/tools/ner' },
            { id: 'dictionary', label: 'Lug\'at', icon: BookOpen, href: '/tools/dictionary' },
            { id: 'terms', label: 'Atamalar', icon: BookA, href: '/dashboard/terms' },
        ]
    },
    {
        id: 'community',
        title: 'Hamjamiyat',
        items: [
            { id: 'articles', label: 'Maqolalar', icon: FileText, href: '/hamjamiyat?tab=articles' },
            { id: 'forum', label: 'Forum', icon: MessageSquare, href: '/hamjamiyat?tab=forum' },
            { id: 'leaderboard', label: 'Yetakchilar', icon: Trophy, href: '/hamjamiyat/leaderboard' },
        ]
    },
    {
        id: 'support',
        title: 'Hujjatlar',
        items: [
            { id: 'api', label: 'API Hujjatlari', icon: Code, href: '/docs/api' },
            { id: 'guidelines', label: 'Ko\'rsatmalar', icon: BookMarked, href: '/docs/guidelines' },
            { id: 'opensource', label: 'Ochiq manba', icon: Github, href: '/docs/opensource' },
            { id: 'changelog', label: 'O\'zgarishlar', icon: ScrollText, href: '/docs/changelog' },
        ]
    },
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background flex flex-col relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity" 
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out h-full overflow-y-auto">
              <div className="flex h-16 items-center justify-between border-b border-border px-6 shrink-0 bg-card sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <img src="/lisoniy_small.png" alt="Lisoniy Logo" className="h-8 w-8 object-cover rounded-lg" />
                  <span className="font-bold text-foreground">Lisoniy</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 p-3">
                {/* Landing Links (Added for convenience) */}
                <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Sayt
                    </div>
                    <div className="mt-1 space-y-1">
                        <Link to="/" onClick={() => setSidebarOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start gap-3 px-6 py-2 h-auto text-sm">
                                <LayoutDashboard className="h-4 w-4" />
                                Bosh Sahifa
                            </Button>
                        </Link>
                    </div>
                </div>

                {sidebarSections.map((section) => (
                    <div key={section.id} className="mb-4">
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {section.title}
                        </div>
                        <div className="mt-1 space-y-1">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={item.id} to={item.href} onClick={() => setSidebarOpen(false)}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start gap-3 px-6 py-2 h-auto text-sm"
                                        >
                                            <Icon className="h-4 w-4" />
                                            {item.label}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div className="border-t pt-4 mt-4 px-3">
                  <Link to="/auth/login" onClick={() => setSidebarOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-3 mb-2">
                        Kirish
                    </Button>
                  </Link>
                  <Link to="/auth/register" onClick={() => setSidebarOpen(false)}>
                    <Button className="w-full justify-start gap-3">
                        Ro'yxatdan o'tish
                    </Button>
                  </Link>
                </div>
              </nav>
            </aside>
          </div>
        )}

        <Routes>
          {/* Auth routes - no navbar/footer */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          {/* Add direct route for email link backward compatibility */}
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

          {/* Dashboard routes - no navbar/footer */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/explore-datasets" element={<ExploreDatasetsPage />} />
            <Route path="/dashboard/contributions" element={<MyContributionsPage />} />
            <Route path="/dashboard/contributions/discussions" element={<AllDiscussionsPage />} />
            <Route path="/dashboard/contributions/articles" element={<AllArticlesPage />} />
            <Route path="/dashboard/contributions/datasets" element={<AllDatasetsPage />} />
            <Route path="/dashboard/dataset/:datasetId" element={<DatasetDetailPage />} />
            <Route path="/dashboard/dataset/:datasetId/edit" element={<EditDatasetPage />} />
            <Route path="/dashboard/dataset/:datasetId/add" element={<QuickAddEntryPage />} />
            <Route path="/dashboard/create-dataset" element={<CreateDatasetPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            {/* Terminology Management */}
            <Route path="/dashboard/terms" element={<TermsPage />} />
          </Route>

          {/* Learning routes - PUBLIC, no auth required */}
          <Route path="/dashboard/learn" element={<LearnPage />} />
          <Route path="/dashboard/learn/korpus-lingvistikasi" element={<KorpusLingvistikasi />} />
          <Route path="/dashboard/learn/uzbek-morphology" element={<UzbekMorphology />} />
          <Route path="/dashboard/learn/nlp-basics" element={<NLPBasics />} />
          <Route path="/dashboard/learn/large-language-models" element={<LargeLanguageModels />} />
          <Route path="/dashboard/learn/speech-technologies" element={<SpeechTechnologies />} />
          <Route path="/dashboard/learn/specialized-areas" element={<SpecializedAreas />} />
          <Route path="/dashboard/learn/llm-project-management" element={<LLMProjectManagement />} />
          <Route path="/dashboard/learn/ai-for-all" element={<AIForAllCourse />} />

          {/* Tool routes - with sidebar layout, no navbar/footer */}
          <Route path="/tools/transliteration" element={<TransliterationPage />} />
          <Route path="/tools/spellchecker" element={<SpellcheckerPage />} />
          <Route path="/tools/ner" element={<NERPage />} />
          <Route path="/tools/dictionary" element={<DictionaryPage />} />


          {/* Community and Docs routes - no navbar/footer */}
          <Route path="/hamjamiyat" element={<HamjamiyatPage />} />
          <Route path="/hamjamiyat/leaderboard" element={<LeaderboardPage />} />
          <Route path="/hamjamiyat/post/:id" element={<PostDetailPage />} />
          <Route path="/hamjamiyat/article/:id" element={<PostDetailPage />} />
          <Route path="/hamjamiyat/discussion/:id" element={<PostDetailPage />} />
          <Route path="/docs/api" element={<APIDocsPage />} />
          <Route path="/docs/guidelines" element={<GuidelinesPage />} />
          <Route path="/docs/opensource" element={<OpenSourcePage />} />
          <Route path="/docs/changelog" element={<ChangelogPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Public routes - with navbar/footer */}
          <Route path="/*" element={
            <>
              <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              <main className="relative flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/nlp" element={<NLPPage />} />
                  <Route path="/corpus" element={<CorpusPage />} />
                  <Route path="/hub" element={<HubPage />} />
                  <Route path="/hamjamiyat/new-post" element={<NewPostPage />} />
                  <Route path="/hamjamiyat/new-discussion" element={<NewDiscussionPage />} />
                  <Route path="/hamjamiyat/tag/:tag" element={<TagPage />} />
                  <Route path="/hamjamiyat/author/:authorSlug" element={<AuthorPage />} />
                  <Route path="/ai" element={<AIPage />} />
                  <Route path="/:username" element={<PublicProfilePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}