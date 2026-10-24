const {contextBridge,ipcRenderer}=require("electron");
contextBridge.exposeInMainWorld("orbDesktop",{
  startServer:port=>ipcRenderer.invoke("tour:start",port),
  stopServer:()=>ipcRenderer.invoke("tour:stop")
});
