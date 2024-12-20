/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "var(--color-primary)",
				surface: "var(--color-surface)",
				"surface-variant": "var(--color-surface-variant)",
				"on-surface": "var(--color-on-surface)",
			},
		},
	},
	plugins: [],
};
