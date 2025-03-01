import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'slider1': "url('../assets/images/slider1-empty.png')",
        'sliderMobile': "url('../assets/images/slider-mobile.png')",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lbGreen : "#007067",
        lbOrange : "#cb6d28",
      },
      fontFamily: {
        peyda: ['var(--font-peyda)'],
      },
      keyframes: {
        floating: {
          '0%': { transform: 'translate(0,  0px)' },
          '50%':  { transform: 'translate(0, 15px);', },
          '100%':   { transform: 'translate(0, -0px)' } 
        }
      },
      animation: {
        floating: 'floating 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
