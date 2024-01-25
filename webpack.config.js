const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fse = require("fs-extra");
const postCSSPlugins = [
  require("postcss-mixins"),
  require("postcss-import"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("postcss-hexrgba"),
  require("autoprefixer"),
];

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy images", function () {
      fse.copySync("./app/assets/images", "./docs/assets/images");
    });
  }
}

const cssConfig = {
  test: /\.css$/i,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: { postcssOptions: { plugins: postCSSPlugins } },
    },
  ],
};

const commonPlugins = [
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: [
      "docs", // Keep docs clean
      path.join(__dirname, "app", "!(assets|index.html)"), // Exclude assets and index.html from app folder cleaning
    ],
  }),
  new MiniCssExtractPlugin({
    filename: "styles.[chunkhash].css",
  }),
  new RunAfterCompile(),
];

// Update paths for HTML files in 'docs' folder and exclude index.html from automatic generation
const pages = fse
  .readdirSync("./docs")
  .filter(function (file) {
    return file.endsWith(".html") && file !== "index.html"; // Exclude index.html
  })
  .map(function (page) {
    return new HtmlWebpackPlugin({
      filename: page,
      template: `./docs/${page}`,
    });
  });

// Manually manage index.html for both dev and production
const indexHtmlPlugin = new HtmlWebpackPlugin({
  filename: "index.html",
  template: `./app/index.html`,
});

const config = {
  entry: "./app/assets/scripts/app.js",
  plugins: pages.concat(commonPlugins, indexHtmlPlugin),
  module: {
    rules: [cssConfig],
  },
  optimization: {
    splitChunks: { chunks: "all" },
  },
  output: {
    path: path.resolve(__dirname, "docs"), // Output to 'docs' in both dev and production
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
  },
};

if (process.env.npm_lifecycle_event == "dev") {
  config.devServer = {
    watchFiles: {
      paths: ["./app/**/*.html"], // Watch all HTML files in 'app' folder
    },
    static: path.join(__dirname, "app"),
    hot: true,
    port: 3000,
    host: "0.0.0.0",
  };
  config.mode = "development";
}

if (process.env.npm_lifecycle_event == "build") {
  config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
  });

  postCSSPlugins.push(require("cssnano")); // Apply cssnano for production
  config.mode = "production";
}

module.exports = config;
