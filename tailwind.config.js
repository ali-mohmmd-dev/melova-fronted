/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#562c1b",
        secondary: "#ffffff",
        text: "#575757",
        accent: "#502c1e",
        bg: "#f6f2ec",
        white: "#f6f2ec",
        divider: "#1218201A",
        "dark-divider": "#FFFFFF1A",
        error: "rgb(230, 87, 87)",
      },
    },
  },
  plugins: [],
};
