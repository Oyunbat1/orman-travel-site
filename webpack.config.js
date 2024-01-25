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
      "docs", // Clean the docs directory before builds
      path.join(__dirname, "app", "!(assets)"), // Exclude the assets directory
    ],
  }),
  new MiniCssExtractPlugin({
    filename: "styles.[chunkhash].css",
  }),
  new RunAfterCompile(),
];

// Update the template path and output path for HTML files in the 'docs' folder
const pages = fse
  .readdirSync("./docs")
  .filter(function (file) {
    return file.endsWith(".html");
  })
  .map(function (page) {
    return new HtmlWebpackPlugin({
      filename: page,
      template: `./docs/${page}`, // Adjust the template path
    });
  });

const config = {
  entry: "./app/assets/scripts/app.js",
  plugins: pages.concat(commonPlugins),
  module: {
    rules: [cssConfig],
  },
  optimization: {
    splitChunks: { chunks: "all" },
  },
  output: {
    path: path.resolve(__dirname, "docs"), // Output to the 'docs' folder
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
  },
};

if (process.env.npm_lifecycle_event == "dev") {
  config.output.path = path.resolve(__dirname, "app"); // Output to the 'app' folder in dev mode
  config.devServer = {
    watchFiles: {
      paths: ["./docs/**/*.html"], // Watch HTML files in the 'docs' folder
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
  config.output = {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
  };
  config.output.path = path.resolve(__dirname, "docs"); // Output to the 'docs' folder in production
  config.mode = "production";
}

module.exports = config;
