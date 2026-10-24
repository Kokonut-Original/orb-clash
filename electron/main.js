const {app,BrowserWindow,Menu,ipcMain,shell}=require("electron");
const path=require("path");
const root=app.isPackaged?process.resourcesPath:path.join(__dirname,"..");
const HTML=path.join(root,"OrbClash-offline.html");
let win=null,server=null;

function createWindow(){
  win=new BrowserWindow({width:1280,height:800,minWidth:900,minHeight:600,backgroundColor:"#0B0814",title:"Orb Clash",
    icon:path.join(__dirname,"build","icon.png"),autoHideMenuBar:true,show:false,
    webPreferences:{preload:path.join(__dirname,"preload.js"),contextIsolation:true,nodeIntegration:false,sandbox:true}});
  win.removeMenu();
  win.once("ready-to-show",()=>win.show());
  win.loadFile(HTML);
  win.webContents.setWindowOpenHandler(({url})=>{if(/^https?:\/\//.test(url))shell.openExternal(url);return{action:"deny"}});
  win.webContents.on("will-navigate",(e,url)=>{if(!url.startsWith("file:")){e.preventDefault();if(/^https?:\/\//.test(url))shell.openExternal(url)}});
  win.webContents.on("before-input-event",(e,i)=>{
    if(i.type!=="keyDown")return;
    if(i.key==="F11"){win.setFullScreen(!win.isFullScreen());e.preventDefault()}
    else if(i.key==="Escape"&&win.isFullScreen()&&false){win.setFullScreen(false)}
    else if(i.key==="F12"&&!app.isPackaged)win.webContents.toggleDevTools();
  });
  win.on("closed",()=>{win=null});
}

/* Tournament server chạy ngay trong main process: host bấm "Tạo giải" là bật. */
ipcMain.handle("tour:start",async(_e,port)=>{
  if(server)return{port:server.port,ips:server.ips,already:true};
  const mod=require(path.join(root,"server","server.js"));
  try{const r=await mod.start(+port||8787);server={mod,port:r.port,ips:r.ips};return r}
  catch(e){return{error:e.code==="EADDRINUSE"?"Cổng đang bị dùng, thử cổng khác":String(e.message)}}
});
ipcMain.handle("tour:stop",async()=>{if(server){await server.mod.stop();server=null}return true});

const lock=app.requestSingleInstanceLock();
if(!lock)app.quit();
else{
  app.on("second-instance",()=>{if(win){if(win.isMinimized())win.restore();win.focus()}});
  app.whenReady().then(()=>{Menu.setApplicationMenu(null);createWindow();app.on("activate",()=>{if(!BrowserWindow.getAllWindows().length)createWindow()})});
  app.on("window-all-closed",async()=>{if(server)await server.mod.stop().catch(()=>{});app.quit()});
}
