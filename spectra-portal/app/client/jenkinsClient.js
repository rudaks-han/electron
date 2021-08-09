const electron = require('electron');
const axios = require('axios');
const Store = require('electron-store');
const IpcMainListener = require('../lib/ipcMainListener');
const MainWindowSender = require('../lib/mainWindowSender');
const ShareUtil = require('../lib/shareUtil');

class JenkinsClient {
    constructor(mainWindow) {
        this.apiUrl = 'http://211.63.24.41:8080';
        this.mainWindow = mainWindow;
        this.store = new Store();
        this.ipcMainListener = new IpcMainListener('jenkins');
        this.mainWindowSender = new MainWindowSender(this.mainWindow, 'jenkins');
        console.log('jenkinsClient constructor')
        this.ipcMainListener.on('findList', (event, data) => {
            console.log('jenkinsClient.on.. findList')
            this.findList();
        });
    }

    findList() {

    }

}

module.exports = JenkinsClient;