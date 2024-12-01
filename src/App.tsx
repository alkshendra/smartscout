import React, { useState } from "react";
import { Sidesheet } from "./components/Layout/Sidesheet";
import { AppGrid } from "./components/Apps/AppGrid";
import { Calculator } from "./components/Apps/Calculator";
import { Translator } from "./components/Apps/Translator";
import { Summarizer } from "./components/Apps/Summarizer";
import { LinkExtractor } from "./components/Apps/LinkExtractor";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemePicker } from "./components/ThemePicker";

export default function App() {
	const [currentApp, setCurrentApp] = useState<string | null>(null);

	const handleAppClick = (appId: string) => {
		setCurrentApp(appId);
	};

	const handleBack = () => {
		setCurrentApp(null);
	};

	const handleClose = () => {
		// Send close message to parent window
		window.parent.postMessage({ action: "toggle_sidebar" }, "*");
	};

	const renderContent = () => {
		switch (currentApp) {
			case "calculator":
				return <Calculator />;
			case "translator":
				return <Translator />;
			case "summarizer":
				return <Summarizer />;
			case "links":
				return <LinkExtractor />;
			default:
				return <AppGrid onAppClick={handleAppClick} />;
		}
	};

	return (
		<ThemeProvider>
			<div className="h-screen">
				<Sidesheet
					onClose={handleClose}
					showBack={currentApp !== null}
					onBack={handleBack}
				>
					{renderContent()}
				</Sidesheet>
				{currentApp === null && <ThemePicker />}
			</div>
		</ThemeProvider>
	);
}
