import type { Config } from "tailwindcss";

const config = {
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	safelist: [
		{
			pattern: /^(bg|text|fill|stroke|border)-innoq-(petrol|apricot|blue|red|green|yellow|gray)/,
		},
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				serif: ["'FreightTextPro'", "Georgia", "serif"],
				sans: ["'FFMarkWebPro'", "'DM Sans'", "sans-serif"],
				mono: ["'HackRegular'", "'JetBrains Mono'", "monospace"],
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				// INNOQ Brand Colors
				'innoq-petrol': {
					DEFAULT: '#004153',
					75: '#40707e',
					50: '#80a0a9',
					25: '#bfcfd4',
				},
				'innoq-apricot': {
					DEFAULT: '#ff9c66',
					75: '#ffb58c',
					50: '#ffcdb2',
					25: '#ffe6d9',
				},
				'innoq-blue': {
					DEFAULT: '#24244c',
					75: '#5b5b79',
					50: '#9191a5',
					25: '#c8c8d2',
				},
				'innoq-red': {
					DEFAULT: '#ff4d67',
					75: '#fc6e86',
					50: '#fd9eae',
					25: '#feced6',
				},
				'innoq-green': {
					DEFAULT: '#55cdaf',
					75: '#68ddc3',
					50: '#9ae8d7',
					25: '#ccf3eb',
				},
				'innoq-yellow': {
					DEFAULT: '#fff019',
					75: '#fff87a',
					50: '#fffb9f',
					25: '#fffdbe',
				},
				'innoq-gray': {
					DEFAULT: '#242424',
					75: '#646465',
					50: '#979798',
					25: '#d8d8d8',
					light: '#f4f4f4',
					lighter: '#f7f7f7',
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
