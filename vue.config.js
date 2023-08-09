const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const webUrl = process.env.VUE_APP_WEB_URL;

function getConfigureWebpack() {
  const plugins = [];

  if (!isProduction) {
    return { plugins };
  }

  const ENABLE_OBFUSCATION = process.env.OBFUSCATION || false;
  const isObfuscationEnabled = ENABLE_OBFUSCATION.toString().toLowerCase();

  if (JSON.parse(isObfuscationEnabled)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const WebpackObfuscator = require('webpack-obfuscator');
    plugins.push(
      new WebpackObfuscator(
        {
          compact: true,
          controlFlowFlattening: false,
          deadCodeInjection: false,
          debugProtection: false,
          debugProtectionInterval: false,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          renameGlobals: false,
          rotateStringArray: true,
          selfDefending: true,
          shuffleStringArray: true,
          sourceMap: true,
          splitStrings: false,
          stringArray: true,
          stringArrayEncoding: [],
          stringArrayThreshold: 0.75,
          unicodeEscapeSequence: false,
        },
        ['**/chunk-vendors.*.js', '**/*.*.css']
      )
    );
  }

  return { plugins };
}

module.exports = {
  configureWebpack: (config) => {
    if (isProduction) {
      config.output.filename = `[name].[contenthash].${new Date().getTime()}.js`;
      config.output.chunkFilename = `[name].[contenthash].${new Date().getTime()}.js`;
      config.output.clean = true;
    }

    return getConfigureWebpack();
  },
  productionSourceMap: true,
  parallel: true,
  devServer: {
    proxy: process.env.VUE_APP_API_URL,
  },
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');

    config.plugin('html').tap((args) => {
      args[0].label = '';

      return args;
    });

    config.resolve.plugin('tsconfig-paths').use(TsconfigPathsWebpackPlugin);
  },
  pluginOptions: {
    i18n: {
      locale: 'he',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
  css: {
    loaderOptions: {
      scss: {
        // TODO: Fix validation sass loader issue
        additionalData: `@import "~@/styles/_variables.scss";
           @import "~@/styles/_mixins.scss";
           @import "~@/styles/_colors.scss";
           @import "~@/styles/_fonts.scss";`,
      },
    },
  },
  pwa: {
    manifestOptions: {
      name: 'Production Book',
      short_name: 'Production Book',
      theme_color: '#ffffff',
      background_color: '#111111',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      prefer_related_applications: true,
    },
    name: 'Production Book',
    themeColor: '#ffffff',
    msTileColor: '#111111',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    related_applications: [
      {
        platform: 'webapp',
        url: `${webUrl}/manifest.json`,
      },
    ],
  },
};
