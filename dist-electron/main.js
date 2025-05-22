import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "logo.png"),
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 650,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    },
    ...process.platform !== "darwin" ? {
      titleBarOverlay: {
        color: "#ffffff",
        symbolColor: "#fb6b3f",
        height: 48
      }
    } : {},
    darkTheme: true
  });
  win.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      console.error("Failed to load:", errorCode, errorDescription);
    }
  );
  win.webContents.on("did-finish-load", () => {
    console.log("Window loaded successfully");
    win == null ? void 0 : win.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  });
  if (VITE_DEV_SERVER_URL) {
    console.log("Loading development URL:", VITE_DEV_SERVER_URL);
    win.loadURL(VITE_DEV_SERVER_URL);
    win.setMenuBarVisibility(false);
  } else {
    const indexPath = path.join(RENDERER_DIST, "index.html");
    console.log("Loading production file:", indexPath);
    win.loadFile(indexPath);
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  ipcMain.on("setTitleBarOverlay", handleSetTitleBarOverlay);
});
function handleSetTitleBarOverlay(event, options) {
  const webContents = event.sender;
  const win2 = BrowserWindow.fromWebContents(webContents);
  if (win2) win2.setTitleBarOverlay(options);
}
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
