const electron = require('electron');
const { ipcMain } = electron;
const axios = require('axios');

class MainWindowSender {
    constructor(mainWindow, channelPrefix) {
        this.mainWindow = mainWindow;
        this.channelPrefix = channelPrefix;
    }

    send(name, data) {
        console.log(`[MainWindowSender] ${this.channelPrefix}.${name}`);
        this.mainWindow.webContents.send(
            `${this.channelPrefix}.${name}`,
            data
        );
    }
}

module.exports = MainWindowSender;