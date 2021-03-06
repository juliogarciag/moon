const path = require("path");

module.exports = {
  plugins: [
    require("postcss-import")({ path: [path.resolve("src")] }),
    require("postcss-flexbugs-fixes"),
    require("postcss-preset-env")({
      autoprefixer: {
        flexbox: "no-2009"
      },
      stage: 3
    }),
    require("postcss-nested"),
    require("tailwindcss")
  ]
};
