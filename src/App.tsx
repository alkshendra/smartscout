import { useState } from 'react';
import { Sidesheet } from './components/Layout/Sidesheet';
import { AppGrid } from './components/Apps/AppGrid';
// import { Calculator } from "./components/Apps/Calculator";
import { Translator } from './components/Apps/Translator';
import { WritingAssistant } from './components/Apps/WritingAssistant';
import { Summarizer } from './components/Apps/Summarizer';
import { LinkExtractor } from './components/Apps/LinkExtractor';
import { Freestyle } from './components/Apps/Freestyle';
import { ThemeProvider } from './context/ThemeContext';
import { ThemePicker } from './components/ThemePicker';
import { apps } from './data/apps';
import { TOC } from './components/Apps/TOC';
import { usePageInsights } from './hooks/usePageInsights';
import { SEO } from './components/Apps/SEO/SEO';
import { Post } from './components/Apps/Post/Post';

interface AppState {
	id: string | null;
	options?: Record<string, undefined>;
}

export default function App() {
	const [currentApp, setCurrentApp] = useState<AppState>({ id: null });
	console.log('🚀 ~ App ~ currentApp:', currentApp);

	const { insights } = usePageInsights();

	const handleAppClick = (appId: string, options?: Record<string, any>) => {
		setCurrentApp({ id: appId, options });
	};

	const handleBack = () => {
		setCurrentApp({ id: null });
	};

	const handleClose = () => {
		window.parent.postMessage({ action: 'toggle_sidebar' }, '*');
	};

	const getCurrentAppTitle = () =>
		currentApp.id ? apps.find(app => app.id === currentApp.id)?.name || '' : '';

	const renderContent = () => {
		switch (currentApp.id) {
			// case 'calculator':
			// 	return <Calculator />;
			case 'translator':
				return <Translator />;
			case 'writingAssistant':
				return <WritingAssistant />;
			case 'summarizer':
				return <Summarizer initialTab={currentApp.options?.initialTab} />;
			case 'links':
				return <LinkExtractor />;
			case 'freestyle':
				return <Freestyle />;
			case 'toc':
				return <TOC />;
			case 'seo':
				return <SEO />;
			case 'post':
				return <Post />;
			default:
				return <AppGrid onAppClick={handleAppClick} insights={insights} />;
		}
	};

	return (
		<ThemeProvider>
			<div className="h-screen bg-surface">
				<Sidesheet
					onClose={handleClose}
					showBack={currentApp.id !== null}
					onBack={handleBack}
					title={getCurrentAppTitle()}
				>
					{renderContent()}
				</Sidesheet>
				{currentApp.id === null && <ThemePicker />}
			</div>
		</ThemeProvider>
	);
}
