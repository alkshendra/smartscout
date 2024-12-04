import { useState, useCallback } from 'react';

interface TranslationOptions {
	targetLanguage: string;
	onProgress?: (text: string) => void;
	onError?: (error: Error) => void;
}

interface DetectedLanguage {
	detectedLanguage: string;
	confidence: number;
}

export function useTranslation() {
	const [isTranslating, setIsTranslating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [detectedLanguage, setDetectedLanguage] = useState<DetectedLanguage | null>(null);

	const detectLanguage = useCallback(async (text: string) => {
		if (!('translation' in window) || !('createDetector' in (window as any).translation)) {
			throw new Error('Translation API not supported in this browser');
		}
		const detector = await (window as any).translation.createDetector();

		// TODO: this does not work, fix it later
		// const [detection] = await detector.detect(text.trim());
		// return detection || { detectedLanguage: 'en', confidence: 0 };
		return { detectedLanguage: 'en', confidence: 0 };
	}, []);

	const translate = async (text: string, options: TranslationOptions) => {
		if (!text.trim() || isTranslating) {
			return;
		}

		setIsTranslating(true);
		setError(null);

		try {
			// First detect the language
			const detection = await detectLanguage(text);
			setDetectedLanguage(detection);

			if (!['en', 'ja', 'es'].includes(detection.detectedLanguage)) {
				throw new Error(
					'Currently, only English ↔ Spanish and English ↔ Japanese are supported.',
				);
			}

			// Create translator
			const translator = await (window as any).translation.createTranslator({
				sourceLanguage: detection.detectedLanguage,
				targetLanguage: options.targetLanguage,
			});

			// Translate the text
			const translatedText = await translator.translate(text.trim());

			if (options.onProgress) {
				options.onProgress(translatedText);
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Translation failed. Please try again.';
			setError(errorMessage);
			if (options.onError) {
				options.onError(error instanceof Error ? error : new Error(errorMessage));
			}
		} finally {
			setIsTranslating(false);
		}
	};

	const getLanguageDisplay = (languageTag: string) => {
		try {
			const displayNames = new Intl.DisplayNames(['en'], {
				type: 'language',
			});
			return displayNames.of(languageTag);
		} catch {
			return languageTag;
		}
	};

	return {
		translate,
		isTranslating,
		error,
		detectedLanguage,
		getLanguageDisplay,
	};
}
