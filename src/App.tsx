import { lazy, Suspense, useEffect, useState } from 'react';
import { PortfolioProvider } from '@/lib/portfolio-context';
import { LanguageProvider } from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { ErrorBoundary } from '@/components/core/error-boundary';
import { Sketchbook } from './Sketchbook';

const StudioApp = lazy(() => import('./studio/StudioApp').then(({ StudioApp }) => ({ default: StudioApp })));

function PortfolioRoutes() {
  const [isStudio, setIsStudio] = useState(isStudioLocation);

  useEffect(() => {
    const onRoute = () => setIsStudio(isStudioLocation());
    window.addEventListener('hashchange', onRoute);
    window.addEventListener('popstate', onRoute);
    trackEvent('home', 'pageview');
    return () => {
      window.removeEventListener('hashchange', onRoute);
      window.removeEventListener('popstate', onRoute);
    };
  }, []);

  if (isStudio) {
    return <Suspense fallback={<p role="status">Loading Developer Studio…</p>}><StudioApp onExitStudio={() => {
      window.history.pushState(null, '', '/#home');
      window.scrollTo(0, 0);
      setIsStudio(false);
    }} /></Suspense>;
  }
  return <Sketchbook />;
}

function isStudioLocation() {
  const { pathname, hash } = window.location;
  return pathname === '/studio' || pathname.startsWith('/studio/') ||
    hash === '#studio' || hash === '#/studio' || hash.startsWith('#/studio/');
}

export default function App() {
  return <ErrorBoundary><PortfolioProvider><LanguageProvider><PortfolioRoutes /></LanguageProvider></PortfolioProvider></ErrorBoundary>;
}
