/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/tw-elements/js/**/*.js",
		"./node_modules/flowbite/**/*.js",
	],
	theme: {
		screens: {
			sm: '480px',
			md: '768px',
			lg: '976px',
			xl: '1440px'
		},
		colors: {
			blue: '#1D2529FF',
			purple: '#7e5bef',
			pink: '#ff49db',
			orange: '#ff7849',
			green: '#13ce66',
			yellow: '#ffc82c',
			'gray-dark': '#273444',
			gray: '#8492a6',
			'gray-light': '#d3dce6'
		},
		fontFamily: {
			sans: ['Graphik', 'sans-serif'],
			serif: ['Merriweather', 'serif']
		},
		extend: {
			spacing: {
				'128': '32rem',
				'144': '36rem'
			},
			borderRadius: {
				'4xl': '2rem',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function ({ addUtilities }) {
			const newUtilities = {
				/* Firefox scrollbar style */
				'.scrollbar-thin': {
					scrollbarWidth: 'thin',
					scrollbarColor: '#0d6efd #f0f0f0', /* Thumb and track colors */
				},
				/* WebKit (Chrome, Safari) scrollbar style */
				'.scrollbar-webkit': {
					'&::-webkit-scrollbar': {
						width: '8px',
					},
					'&::-webkit-scrollbar-track': {
						background: '#f0f0f0',
						borderRadius: '10px',
					},
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: '#0d6efd',
						borderRadius: '10px',
						border: '2px solid #d3dce6',
					},
					'&::-webkit-scrollbar-button': {
						display: 'none',
					},
					'&::-webkit-scrollbar-corner': {
						backgroundColor: 'transparent', /* Set the corner to be transparent */
						border: 'none',                 /* Remove any border */
					},
				},
			};
			addUtilities(newUtilities, ["responsive", "hover"]);
		},
		require('flowbite/plugin')({
			datatables: true,
		}),
		// require("tw-elements/plugin.cjs")
	],
}