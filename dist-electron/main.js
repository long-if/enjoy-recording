import { app as i, BrowserWindow as l, ipcMain as f } from "electron";
import { createRequire as m } from "node:module";
import { fileURLToPath as w } from "node:url";
import o from "node:path";
m(import.meta.url);
const d = o.dirname(w(import.meta.url));
process.env.APP_ROOT = o.join(d, "..");
const t = process.env.VITE_DEV_SERVER_URL, v = o.join(process.env.APP_ROOT, "dist-electron"), c = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = t ? o.join(process.env.APP_ROOT, "public") : c;
let e;
function p() {
  if (e = new l({
    icon: o.join(process.env.VITE_PUBLIC, "logo.png"),
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 650,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: o.join(d, "preload.mjs")
    },
    ...process.platform !== "darwin" ? {
      titleBarOverlay: {
        color: "#ffffff",
        symbolColor: "#fb6b3f",
        height: 48
      }
    } : {},
    darkTheme: !0
  }), e.webContents.on(
    "did-fail-load",
    (n, r, s) => {
      console.error("Failed to load:", r, s);
    }
  ), e.webContents.on("did-finish-load", () => {
    console.log("Window loaded successfully"), e == null || e.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  }), t)
    console.log("Loading development URL:", t), e.loadURL(t), e.setMenuBarVisibility(!1);
  else {
    const n = o.join(c, "index.html");
    console.log("Loading production file:", n), e.loadFile(n);
  }
}
i.on("window-all-closed", () => {
  process.platform !== "darwin" && (i.quit(), e = null);
});
i.on("activate", () => {
  l.getAllWindows().length === 0 && p();
});
i.whenReady().then(() => {
  p(), f.on("setTitleBarOverlay", h);
});
function h(n, r) {
  const s = n.sender, a = l.fromWebContents(s);
  a && process.platform !== "darwin" && a.setTitleBarOverlay(r);
}
export {
  v as MAIN_DIST,
  c as RENDERER_DIST,
  t as VITE_DEV_SERVER_URL
};
