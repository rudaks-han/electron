const electron = require('electron');

const { app, BrowserWindow, shell } = electron;

let mainWindow;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation : false
        }
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });
});

