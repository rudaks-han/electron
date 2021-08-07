const electron = require('electron');
const { BrowserWindow, shell } = electron;

class MainWindow extends BrowserWindow {
    constructor(url) {
        super({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation : false
            }
        });

        this.loadURL(url);
        this.webContents.openDevTools();
        this.webContents.on('new-window', function(e, url) {
            e.preventDefault();
            shell.openExternal(url);
        });
    }
}

module.exports = MainWindow;

