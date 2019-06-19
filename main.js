const { app, BrowserWindow } = require('electron');
let win;
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600 });
    // and load the index.html of the app. 
    win.loadFile('./dist/ACCELULARES/index.html');
    // Open the DevTools.
    //win.webContents.openDevTools();

    // disable the default electron bar menu
    win.setMenu(null);
    // Emitted when the window is closed.
    win.on('closed', () => {
        win = null
    })
};
// This method will be called when Electron has finished   
// initialization and is ready to create browser windows.   
// Some APIs can only be used after this event occurs.   
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {

    // On macOS it is common for applications and their menu bar     
    // to stay active until the user quits explicitly with Cmd + Q     
    if (process.platform !== 'darwin') { app.quit() }
});
app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the     
    // dock icon is clicked and there are no other windows open.

    if (win === null) { createWindow() }
});  