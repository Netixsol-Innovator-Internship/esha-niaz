module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#3b82f6", // pick your brand color (this one is Tailwind's blue-500)
        },
      },
    },
  },
  plugins: [],
};
