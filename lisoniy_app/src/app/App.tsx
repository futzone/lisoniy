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
import { NotFoundPage } from "@/pages/NotFoundPage";
import { Toaster } from "@/app/components/ui/sonner";
import { ProtectedRoute } from "@/app/components/auth/ProtectedRoute";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background flex flex-col">
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
            <Route path="/dashboard/create-dataset" element={<CreateDatasetPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            {/* Terminology Management */}
            <Route path="/dashboard/terms" element={<TermsPage />} />

            <Route path="/dashboard/learn" element={<LearnPage />} />
            <Route path="/dashboard/learn/korpus-lingvistikasi" element={<KorpusLingvistikasi />} />
            <Route path="/dashboard/learn/uzbek-morphology" element={<UzbekMorphology />} />
            <Route path="/dashboard/learn/nlp-basics" element={<NLPBasics />} />
            <Route path="/dashboard/learn/large-language-models" element={<LargeLanguageModels />} />
            <Route path="/dashboard/learn/speech-technologies" element={<SpeechTechnologies />} />
            <Route path="/dashboard/learn/specialized-areas" element={<SpecializedAreas />} />
          </Route>

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