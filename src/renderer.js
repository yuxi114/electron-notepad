const { ipcRenderer, remote } = require('electron');
const { Menu, MenuItem, dialog } = remote;
const fs = require('fs');   // Node.js内置的fs模块是文件系统模块，负责读写文件
import { contextMenuTemplate } from './rightKeyMenu.js';

let currentFile = null; //当前文档保存的路径
let isSaved = true;     //当前文档是否已保存
let txtEditor = document.getElementById('txtEditor'); //获得TextArea文本框的引用

document.title = "Notepad - Untitled"; //设置文档标题，影响窗口标题栏名称

const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);

txtEditor.addEventListener('contextmenu', e => {
    e.preventDefault();
    contextMenu.popup(remote.getCurrentWindow());
});

//监控文本框内容是否改变
txtEditor.oninput = e => {
    if (isSaved) document.title += " *";
    isSaved = false;
};

//监听与主进程的通信
ipcRenderer.on('action', (event, arg) => {
    switch (arg) {
        case 'new': //新建文件
            askSaveIfNeed();
            newFile();
            break;
        case 'open': //打开文件
            askSaveIfNeed();
            openDoc();
            break;
        case 'save': //保存文件
            saveCurrentDoc();
            break;
        case 'exiting': // 结束
            askSaveIfNeed();
            ipcRenderer.sendSync('reqaction', 'exit');
            break;
    }
});

//读取文本文件
function readText(file) {
    let readFile = null;
    try {
        readFile = fs.readFileSync(file, 'utf8');
    } catch (error) {
        console.log(error, 'readFile');
        return;
    }
    return readFile;
}
//保存文本内容到文件
function saveText(text, file) {
    let writeFile = null;
    try {
        writeFile = fs.writeFileSync(file, text);
    } catch (error) {
        console.log(error, 'writeFile');
        return;
    }
    return writeFile;
}

// 新建文件
function newFile() {
    currentFile = null;
    txtEditor.value = '';
    document.title = "Notepad - Untitled";
    isSaved = true;
}
// 打开文档
function openDoc() {
    const files = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        filters: [
            { name: "Text Files", extensions: ['txt', 'js', 'html', 'md'] },
            { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
    });
    if (files) {
        currentFile = files[0];
        const txtRead = readText(currentFile);
        txtEditor.value = txtRead;
        document.title = "Notepad - " + currentFile;
        isSaved = true;
    }
}

//保存当前文档
function saveCurrentDoc() {
    if (!currentFile) {
        const file = remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
            filters: [
                { name: "Text Files", extensions: ['txt', 'js', 'html', 'md'] },
                { name: 'All Files', extensions: ['*'] }]
        });
        if (file) currentFile = file;
    }
    if (currentFile) {
        const txtSave = txtEditor.value;
        saveText(txtSave, currentFile);
        isSaved = true;
        document.title = "Notepad - " + currentFile;
    }
}

//如果需要保存，弹出保存对话框询问用户是否保存当前文档
function askSaveIfNeed() {
    if (isSaved) return;
    const response = dialog.showMessageBox(remote.getCurrentWindow(), {
        message: 'Do you want to save the current document?',
        type: 'question',
        buttons: ['Yes', 'No']
    });
    if (response == 0) saveCurrentDoc(); //点击Yes按钮后保存当前文档
}