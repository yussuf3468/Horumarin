module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  // Safelist some common color utilities to ensure they are generated during testing
  safelist: [
    {
      pattern:
        /^(text|bg|from|to|border)-(red|amber|orange|stone|teal|green|purple|indigo)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
  ],
  plugins: [],
};
