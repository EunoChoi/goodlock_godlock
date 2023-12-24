import { create } from "zustand";

interface Props {
  browser: string;

  setBrowser: () => void;
}

export const useBrowserCheck = create<Props>((set) => ({
  browser: "",
  setBrowser: () =>
    set(() => {
      let browser;
      const browsers = [
        "Chrome",
        "Opera",
        "WebTV",
        "Whale",
        "Beonex",
        "Chimera",
        "NetPositive",
        "Phoenix",
        "Firefox",
        "Safari",
        "SkipStone",
        "Netscape",
        "Mozilla"
      ];

      const userAgent = window.navigator.userAgent.toLowerCase();
      // console.log(userAgent);
      if (userAgent.includes("edg")) {
        browser = "Edge";
      }
      if (userAgent.includes("trident") || userAgent.includes("msie")) {
        browser = "Internet Explorer";
      }
      browser = browsers.find((browser) => userAgent.includes(browser.toLowerCase())) || "Other";
      return { browser };
    })
}));
