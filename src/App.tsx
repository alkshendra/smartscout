import React, { useState } from "react";
import { Sidesheet } from "./components/Layout/Sidesheet";
import { AppGrid } from "./components/Apps/AppGrid";
import { Calculator } from "./components/Apps/Calculator";
import { Translator } from "./components/Apps/Translator";
import { WritingAssistant } from "./components/Apps/WritingAssistant";
import { Summarizer } from "./components/Apps/Summarizer";
import { LinkExtractor } from "./components/Apps/LinkExtractor";
import { Freestyle } from "./components/Apps/Freestyle";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemePicker } from "./components/ThemePicker";
import { apps } from "./data/apps";

export default function App() {
	const [currentApp, setCurrentApp] = useState<string | null>(null);

	const handleAppClick = (appId: string) => {
		setCurrentApp(appId);
	};

	const handleBack = () => {
		setCurrentApp(null);
	};

	const handleClose = () => {
		window.parent.postMessage({ action: "toggle_sidebar" }, "*");
	};

	const getCurrentAppTitle = () => {
		if (!currentApp) return null;
		return apps.find((app) => app.id === currentApp)?.name || null;
	};

	const renderContent = () => {
		switch (currentApp) {
			case "calculator":
				return <Calculator />;
			case "translator":
				return <Translator />;
			case "writingAssistant":
				return <WritingAssistant />;
			case "summarizer":
				return <Summarizer />;
			case "links":
				return <LinkExtractor />;
			case "freestyle":
				return <Freestyle />;
			default:
				return <AppGrid onAppClick={handleAppClick} />;
		}
	};

	return (
		<ThemeProvider>
			<div className="h-screen bg-surface">
				<Sidesheet
					onClose={handleClose}
					showBack={currentApp !== null}
					onBack={handleBack}
					title={getCurrentAppTitle()}
				>
					{renderContent()}
				</Sidesheet>
				{currentApp === null && <ThemePicker />}
			</div>
		</ThemeProvider>
	);
}
