const { app, BrowserWindow } = require('electron');
// -----------------------------------------------------------------
// 热加载
require('electron-reload')(__dirname, {
  electron: require("electron-prebuilt")
});
const { Menu, MenuItem, dialog, ipcMain } = require('electron');
import { appMenuTemplate } from './appmenu.js';
//是否可以安全退出
let safeExit = false;
// -----------------------------------------------------------------

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // 创建BrowserWindow的时候指定nodeIntegration为false。 这样在electron内置浏览器里面不会有module和require全局变量。
    webPreferences: {
        nodeIntegration: true
      }
  }); 

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.openDevTools();

  // -----------------------------------------------------------------
  // 增加主菜单（在开发测试时会有一个默认菜单，但打包后这个菜单是没有的，需要自己增加）
  const menu = Menu.buildFromTemplate(appMenuTemplate); // 从模板创建主菜单
  // 在File菜单下添加名为New的子菜单
  menu.items[1].submenu.append(new MenuItem({ // menu.items获取是的主菜单一级菜单的菜单数组，menu.items[1]在这里就是第1个File菜单对象，在其子菜单submenu中添加新的子菜单
    label: "New",
    click() {
      mainWindow.webContents.send('action', 'new'); // 点击后向主页渲染进程发送“新建文件”的命令
    },
    accelerator: 'CmdOrCtrl+N' //快捷键：Ctrl+N
  }));
  // 添加名为Open的同级菜单
  menu.items[1].submenu.append(new MenuItem({
    label: "Open",
    click() {
      mainWindow.webContents.send('action', 'open'); // 点击后向主页渲染进程发送“打开文件”的命令
    },
    accelerator: 'CmdOrCtrl+O' //快捷键：Ctrl+O
  }));
  // 添加名为Save的同级菜单
  menu.items[1].submenu.append(new MenuItem({
    label: "Save",
    click() {
      mainWindow.webContents.send('action', 'save'); // 点击后向主页渲染进程发送“保存文件”的命令
    },
    accelerator: 'CmdOrCtrl+S' //快捷键：Ctrl+S
  }));
  // 添加一个分隔符
  menu.items[1].submenu.append(new MenuItem({
    type: 'separator'
  }));
  // 添加名为Exit的同级菜单
  menu.items[1].submenu.append(new MenuItem({
    role: 'quit'
  }));

  // 注意：这个代码要放到菜单添加完成之后，否则会造成新增菜单的快捷键无效
  Menu.setApplicationMenu(menu); 

  mainWindow.on('close', (e) => {
    if (!safeExit) {
      e.preventDefault();
      mainWindow.webContents.send('action', 'exiting');
    }
  });
  // -----------------------------------------------------------------

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// -----------------------------------------------------------------
// 监听与渲染进程的通信
ipcMain.on('reqaction', (event, arg) => {
  switch (arg) {
    case 'exit':
      safeExit = true;
      app.quit(); // 退出程序
      break;
  }
});
// -----------------------------------------------------------------