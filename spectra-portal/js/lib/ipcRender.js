const electron = require('electron');
const { ipcRenderer } = electron;

class IpcRender {
    constructor(channelPrefix) {
        this.channelPrefix = channelPrefix;
    }

    on(name, callback) {
        ipcRenderer.on(`${this.channelPrefix}.${name}`, callback);
    }

    send(name, data) {
        console.log('[ipcRenderer.send]' + `${this.channelPrefix}.${name}`);
        ipcRenderer.send(`${this.channelPrefix}.${name}`, data);
    }
}

module.exports = IpcRender;