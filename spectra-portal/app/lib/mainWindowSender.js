const electron = require('electron');
const { ipcMain } = electron;
const axios = require('axios');

class MainWindowSender {
    constructor(mainWindow, channelPrefix) {
        this.mainWindow = mainWindow;
        this.channelPrefix = channelPrefix;
    }

    send(name, data) {
        this.mainWindow.webContents.send(
            `${this.channelPrefix}.${name}`,
            data
        );
    }
}

module.exports = MainWindowSender;