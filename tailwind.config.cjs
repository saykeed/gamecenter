
/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
				primary: 'var(--primary)',
        background: 'var(--backGround)',
        white: 'var(--white)',
				blue: 'var(--blue)',
				light_grey: 'var(--light_grey)',
				divider: 'var(--divider)',
        red: 'var(--red)',
        ash: 'var(--ash)'
			}
    },
  },
  plugins: [],
}
