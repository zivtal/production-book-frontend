/* eslint-disable no-useless-escape */
type Browser = Record<string, number | boolean | string>;

const getMatch = (userAgent: string, platformMatch: RegExpExecArray | []) => {
  const match =
    [
      /(edg|edge|edga|edgios)\/([\w.]+)/,
      /(opr)[\/]([\w.]+)/,
      /(vivaldi)[\/]([\w.]+)/,
      /(chrome|crios)[\/]([\w.]+)/,
      /(version)(applewebkit)[\/]([\w.]+).*(safari)[\/]([\w.]+)/,
      /(webkit)[\/]([\w.]+).*(version)[\/]([\w.]+).*(safari)[\/]([\w.]+)/,
      /(firefox|fxios)[\/]([\w.]+)/,
      /(webkit)[\/]([\w.]+)/,
      /(opera)(?:.*version|)[\/]([\w.]+)/,
    ]
      .find((regex: RegExp) => regex.exec(userAgent))
      ?.exec(userAgent) || [];

  return {
    browser: match[5] || match[3] || match[1] || '',
    version: match[2] || match[4] || '0',
    versionNumber: match[4] || match[2] || '0',
    platform: platformMatch[0] || '',
  };
};

const getPlatformIdentify = (userAgent: string) => {
  return (
    [
      /(ipad)/,
      /(ipod)/,
      /(windows phone)/,
      /(iphone)/,
      /(kindle)/,
      /(silk)/,
      /(android)/,
      /(win)/,
      /(mac)/,
      /(linux)/,
      /(cros)/,
      /(playbook)/,
      /(bb)/,
      /(blackberry)/,
    ]
      .find((regex: RegExp) => regex.exec(userAgent))
      ?.exec(userAgent) || []
  );
};

const isTablet = (userAgent: string) =>
  /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);

const getAndroidOSVer = (userAgent: string) => (userAgent.match(/android\s([0-9\.]*)/) || [])[1] || false;

const hasTouch = 'ontouchstart' in window || window.navigator.maxTouchPoints > 0;

function getPlatform(userAgentInput: string) {
  const userAgent = userAgentInput.toLowerCase();
  const platformIdentify = getPlatformIdentify(userAgent);
  const matched = getMatch(userAgent, platformIdentify);
  const browser: Browser = {};

  if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
    browser.versionNumber = parseInt(matched.versionNumber, 10);
  }

  if (matched.platform) {
    browser[matched.platform] = true;
  }

  const knownMobiles =
    browser.android ||
    browser.ios ||
    browser.bb ||
    browser.blackberry ||
    browser.ipad ||
    browser.iphone ||
    browser.ipod ||
    browser.kindle ||
    browser.playbook ||
    browser.silk ||
    browser['windows phone'];

  // These are all considered mobile platforms, meaning they run a mobile browser
  if (knownMobiles) {
    if (userAgent.indexOf('mobile') > -1) {
      browser.mobile = true;
    } else if (isTablet(userAgent)) {
      browser.tablet = true;

      if (browser.android) {
        browser.androidVersion = getAndroidOSVer(userAgent);
      }
    }

    if (browser.edga || browser.edgios) {
      browser.edge = true;
      matched.browser = 'edge';
    } else if (browser.crios) {
      browser.chrome = true;
      matched.browser = 'chrome';
    } else if (browser.fxios) {
      browser.firefox = true;
      matched.browser = 'firefox';
    }
  }
  // If it's not mobile we should consider it's desktop platform, meaning it runs a desktop browser
  // It's a workaround for anonymized user agents
  // (browser.cros || browser.mac || browser.linux || browser.win)
  else {
    browser.desktop = true;
  }

  // Set iOS if on iPod, iPad or iPhone
  if (browser.ipod || browser.ipad || browser.iphone) {
    browser.ios = true;
  }

  if (browser['windows phone']) {
    browser.winphone = true;
    delete browser['windows phone'];
  }

  // Chrome, Opera 15+, Vivaldi and Safari are webkit based browsers
  if (
    browser.chrome ||
    browser.opr ||
    browser.safari ||
    browser.vivaldi ||
    // we expect unknown, non iOS mobile browsers to be webkit based
    ((browser.mobile || browser.tablet) && !browser.ios && !knownMobiles)
  ) {
    browser.webkit = true;
  }

  if (browser.edg) {
    matched.browser = 'edgechromium';
    browser.edgeChromium = true;
  }

  // Blackberry browsers are marked as Safari on BlackBerry
  if ((browser.safari && browser.blackberry) || browser.bb) {
    matched.browser = 'blackberry';
    browser.blackberry = true;
  }

  // Playbook browsers are marked as Safari on Playbook
  if (browser.safari && browser.playbook) {
    matched.browser = 'playbook';
    browser.playbook = true;
  }

  // Opera 15+ are identified as opr
  if (browser.opr) {
    matched.browser = 'opera';
    browser.opera = true;
  }

  // Stock Android browsers are marked as Safari on Android.
  if (browser.safari && browser.android) {
    matched.browser = 'android';
    browser.android = true;
  }

  // Kindle browsers are marked as Safari on Kindle
  if (browser.safari && browser.kindle) {
    matched.browser = 'kindle';
    browser.kindle = true;
  }

  // Kindle Silk browsers are marked as Safari on Kindle
  if (browser.safari && browser.silk) {
    matched.browser = 'silk';
    browser.silk = true;
  }

  if (browser.vivaldi) {
    matched.browser = 'vivaldi';
    browser.vivaldi = true;
  }

  // Assign the name and platform variable
  browser.name = matched.browser;
  browser.platform = matched.platform;

  if (userAgent.indexOf('electron') > -1) {
    browser.electron = true;
  } else if (document.location.href.indexOf('-extension://') > -1) {
    browser.bex = true;
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (window.Capacitor !== void 0) {
      browser.capacitor = true;
      browser.nativeMobile = true;
      browser.nativeMobileWrapper = 'capacitor';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    } else if (window._cordovaNative !== void 0 || window.cordova !== void 0) {
      browser.cordova = true;
      browser.nativeMobile = true;
      browser.nativeMobileWrapper = 'cordova';
    }

    if (
      hasTouch &&
      browser.mac &&
      ((browser.desktop && browser.safari) || (browser.nativeMobile && !browser.android && !browser.ios && !browser.ipad))
    ) {
      const platform = 'ipad/iphone';

      Object.assign(browser, { mobile: true, ios: true, platform, [platform]: true, mac: undefined, desktop: undefined });
    }
  }

  return browser;
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const userAgent = navigator.userAgent || navigator.vendor || window.opera;

export const client = {
  ...getPlatform(userAgent),
  userAgent,
  hasTouch,
  isEmbedded: window.self !== window.top,
};

export type Client = typeof client;
export default client;
