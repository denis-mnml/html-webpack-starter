const uAgent = navigator.userAgent || '';

const browser = {
  browserName: {
    opera: /opera/i.test(uAgent),
    msie: /msie/i.test(uAgent) && !/opera/i.test(uAgent),
    mozilla: /firefox/i.test(uAgent),
    chrome: /chrome/i.test(uAgent),
    safari: !/chrome/i.test(uAgent) && /webkit|safari|khtml/i.test(uAgent),
  },
  version: (uAgent.match(/.+(?:me|ox|on|rv|it|era|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
};

document.documentElement.classList.add(getBrowserName());

export function getBrowserVersion() {
  return browser.version;
}

export function getBrowserName() {
  return Object.keys(browser.browserName).find((key) => browser.browserName[key]);
}
