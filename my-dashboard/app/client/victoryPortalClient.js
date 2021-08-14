const electron = require('electron');
const axios = require('axios');
const Store = require('electron-store');
const IpcMainListener = require('../lib/ipcMainListener');
const MainWindowSender = require('../lib/mainWindowSender');
const ShareUtil = require('../lib/shareUtil');

class VictoryPortalClient {
    constructor(mainWindow) {
        this.apiUrl = 'https://victory-portal.spectra.co.kr';
        this.token = 'a21oYW46THRzRCBmNm5GIHFIUGcgMFdXZCB2dWxjIHA5aVE=';
        this.mainWindow = mainWindow;
        this.store = new Store();
        this.ipcMainListener = new IpcMainListener('victoryPortal');
        this.mainWindowSender = new MainWindowSender(this.mainWindow, 'victoryPortal');
        this.bindIpcMainListener();
    }

    bindIpcMainListener() {
        //this.clearSsoCookie();
        this.ipcMainListener.on('findList', this.findList.bind(this));
        //this.ipcMainListener.on('login', this.login.bind(this));
    }

    findList() {
        console.log('jiraClient findList')
        const _this = this;
        axios.get(`${this.apiUrl}/wp-json/wp/v2/posts?per_page=10`, {
            headers: {
                Authorization: `Basic ${this.token}`
            }
        })
            .then(function (response) {
                console.log(response.data)

                _this.mainWindowSender.send('findListCallback', response.data);

            })
            .catch(function (error) {
                console.log('error')
            });
    }
}

module.exports = VictoryPortalClient;