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
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: "styles.[chunkhash].css",
  }),
];

const pages = fse
  .readdirSync("./app")
  .filter(function (file) {
    return file.endsWith(".html");
  })
  .map(function (page) {
    return new HtmlWebpackPlugin({
      filename: page,
      template: `./app/${page}`,
    });
  });

const config = {
  entry: "./app/assets/scripts/app.js",
  plugins: pages.concat(commonPlugins), // Merge plugins arrays
  module: {
    rules: [cssConfig],
  },
  optimization: {
    splitChunks: { chunks: "all" },
  },
  output: {
    // Common output settings for both dev and build
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
  },
};

if (process.env.npm_lifecycle_event == "dev") {
  config.output.path = path.resolve(__dirname, "app");
  config.devServer = {
    watchFiles: {
      paths: ["./app/**/*.html"],
    },
    static: path.join(__dirname, "app"),
    hot: true,
    port: 3000,
    host: "0.0.0.0",
  };
  config.mode = "development";
}

if (process.env.npm_lifecycle_event == "build") {
  postCSSPlugins.push(require("cssnano")); // Apply cssnano for production
  config.output = {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
  };
  config.output.path = path.resolve(__dirname, "dist");
  config.mode = "production";
}

module.exports = config;
