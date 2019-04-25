//给文本框增加右键菜单

export const contextMenuTemplate = [
    { role: 'undo' },       //Undo菜单项
    { role: 'redo' },       //Redo菜单项
    { type: 'separator' },  //分隔线
    { role: 'cut' },        //Cut菜单项
    { role: 'copy' },       //Copy菜单项
    { role: 'paste' },      //Paste菜单项
    { role: 'delete' },     //Delete菜单项
    { type: 'separator' },  //分隔线
    { role: 'selectall' }   //Select All菜单项
];