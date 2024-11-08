/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "max-sm": { max: "800px" },
        sm: { min: "800px" },
      },

      animation: {
        "carousel-slide": "carousel 0.8s ease-in-out",
      },
      keyframes: {
        carousel: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/line-clamp")],
};
