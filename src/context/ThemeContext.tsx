import React, { createContext, useContext, useState, useEffect } from 'react';
import { type ThemeColor } from '../types';
import { themeColors } from '../styles/theme';

interface ThemeContextType {
	currentTheme: ThemeColor;
	setTheme: (theme: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [currentTheme, setCurrentTheme] = useState<ThemeColor>(themeColors[0]);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = (e?: MediaQueryListEvent) => {
			const themeId = (e ? e.matches : mediaQuery.matches) ? "black" : "blue";
			// Switch to corresponding theme when system preference changes
			const newTheme = themeColors.find(theme => theme.id === themeId);
			if (newTheme) {
				setTheme(newTheme);
			}
		};

		handleChange();

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	const setTheme = (theme: ThemeColor) => {
		setCurrentTheme(theme);
		document.documentElement.style.setProperty('--color-primary', theme.primary);
		document.documentElement.style.setProperty('--color-surface', theme.surface);
		document.documentElement.style.setProperty('--color-surface-variant', theme.surfaceVariant);
		document.documentElement.style.setProperty('--color-on-surface', theme.onSurface);
	};

	return (
		<ThemeContext.Provider value={{ currentTheme, setTheme }}>{children}</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
