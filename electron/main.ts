import { app, BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, "public")
    : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC, "logo.png"),
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 650,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
        ...(process.platform !== "darwin"
            ? {
                  titleBarOverlay: {
                      color: "#ffffff",
                      symbolColor: "#fb6b3f",
                      height: 48,
                  },
              }
            : {}),
        darkTheme: true,
    });

    // 添加错误处理
    win.webContents.on(
        "did-fail-load",
        (event, errorCode, errorDescription) => {
            console.error("Failed to load:", errorCode, errorDescription);
        }
    );

    // 添加加载完成事件处理
    win.webContents.on("did-finish-load", () => {
        console.log("Window loaded successfully");
        win?.webContents.send(
            "main-process-message",
            new Date().toLocaleString()
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

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
        win = null;
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(() => {
  createWindow();
    ipcMain.on("setTitleBarOverlay", handleSetTitleBarOverlay);
});

function handleSetTitleBarOverlay(event: IpcMainEvent, options: object) {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    if (win) win.setTitleBarOverlay(options);
}
