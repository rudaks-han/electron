const electron = require('electron');
const { ipcMain } = electron;
const axios = require('axios');

class IpcMainListener {
    constructor(channelPrefix) {
        this.channelPrefix = channelPrefix;
    }

    on(name, callback) {
        ipcMain.on(`${this.channelPrefix}.${name}`, (event, data) => {
            callback(event, data);
        });
    }
}

module.exports = IpcMainListener;