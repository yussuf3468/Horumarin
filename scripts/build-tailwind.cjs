const fs = require("fs");
const postcss = require("postcss");
const tailwindPostcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

const input = fs.readFileSync("src/index.css", "utf8");

postcss([tailwindPostcss(), autoprefixer])
  .process(input, { from: undefined })
  .then((result) => {
    fs.writeFileSync("temp-tailwind-postcss.css", result.css);
    console.log("Wrote temp-tailwind-postcss.css — length:", result.css.length);
  })
  .catch((err) => {
    console.error("PostCSS build failed:", err);
    process.exitCode = 1;
  });
