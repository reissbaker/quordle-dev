module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "box-diff": "#ffcc00",
        "box-correct": "#00cc88",
        "box-none": "#919191",
      },
    },
  },
  plugins: [],
};
