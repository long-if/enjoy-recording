"use strict";const o=require("electron");o.contextBridge.exposeInMainWorld("ipcRenderer",{on(...e){const[n,r]=e;return o.ipcRenderer.on(n,(s,...c)=>r(s,...c))},off(...e){const[n,...r]=e;return o.ipcRenderer.off(n,...r)},send(...e){const[n,...r]=e;return o.ipcRenderer.send(n,...r)},invoke(...e){const[n,...r]=e;return o.ipcRenderer.invoke(n,...r)}});o.contextBridge.exposeInMainWorld("versions",{node:()=>process.versions.node,chrome:()=>process.versions.chrome,electron:()=>process.versions.electron});
