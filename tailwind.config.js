const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "box-diff": "#ffcc00",
        "box-diff-alt": colors.orange[400],
        "box-correct": "#00cc88",
        "box-correct-alt": colors.blue[400],
        "box-none": "#919191",
      },
    },
  },
  plugins: [],
};
