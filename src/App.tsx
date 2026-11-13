import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { initSmoothScroll } from './lib/smooth';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MonogramPreloader } from './components/MonogramPreloader';
import { RouteCurtain } from './components/RouteCurtain';
import { CustomCursor } from './components/CustomCursor';
import { HomePage } from './pages/HomePage';

function lazyWithRetry<T extends { default: React.ComponentType<any> }>(
  componentImport: () => Promise<T>
) {
  return lazy(async () => {
    const pageHasBeenRefreshed = sessionStorage.getItem('chunk_retry');
    try {
      const component = await componentImport();
      sessionStorage.removeItem('chunk_retry');
      return component;
    } catch (error) {
      if (!pageHasBeenRefreshed) {
        sessionStorage.setItem('chunk_retry', 'true');
        window.location.reload();
        return new Promise<T>(() => {});
      }
      throw error;
    }
  });
}

const ProjectCaseStudyPage = lazyWithRetry(() =>
  import('./pages/ProjectCaseStudyPage').then((m) => ({ default: m.ProjectCaseStudyPage }))
);
const ExploringPage = lazyWithRetry(() =>
  import('./pages/ExploringPage').then((m) => ({ default: m.ExploringPage }))
);
const NotFoundPage = lazyWithRetry(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

export function App() {
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  return (
    <ThemeProvider>
      <CustomCursor />
      <MonogramPreloader />
      <BrowserRouter>
        <RouteCurtain />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--fg)]">
          <Navbar />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            <Suspense fallback={<div className="min-h-screen" />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects/:slug" element={<ProjectCaseStudyPage />} />
                <Route path="/exploring" element={<ExploringPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

