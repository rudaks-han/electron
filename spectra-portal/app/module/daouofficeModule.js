const electron = require('electron');
const axios = require('axios');
const Store = require('electron-store');
const IpcMainListener = require('../lib/ipcMainListener');
const MainWindowSender = require('../lib/mainWindowSender');

class DaouofficeModule {
    constructor(mainWindow) {
        this.apiUrl = 'https://spectra.daouoffice.com';
        this.ssoCookieName = 'daouoffice_ssoCookie';
        this.mainWindow = mainWindow;
        this.store = new Store();
        this.ipcMainListener = new IpcMainListener('daouoffice');
        this.mainWindowSender = new MainWindowSender(this.mainWindow, 'daouoffice');

        this.ipcMainListener.on('getList', (event, data) => {
            this.findList(this.getSsoCookie());
        });

        this.ipcMainListener.on('login', (event, data) => {
            if (data) {
                this.login(data);
            }
        });
    }

    getSsoCookie() {
        return this.store.get(this.ssoCookieName);
    }

    clearSsoCookie() {
        this.store.set(this.ssoCookieName, '');
    }

    login(data) {
        const { username, password } = data;
        const _self = this;
        axios.post(`${this.apiUrl}/api/login`, {
            username,
            password
        })
            .then(function (response) {
                const cookies = response.headers['set-cookie'];
                let ssoCookie = '';
                for (let i in cookies) {
                    if (cookies[i].indexOf('GOSSOcookie') > -1) {
                        ssoCookie = cookies[i].substring(cookies[i].indexOf('=')+1, cookies[i].indexOf(';'));
                    }
                }

                _self.store.set(_self.ssoCookieName, ssoCookie);

                _self.findList(ssoCookie);
            })
            .catch(function (error) {
                _self.mainWindowSender.send('showLoginPage');
            })
            .then(function () {
                // always executed
            });
    }

    findList(ssoCookie) {
        const _self = this;
        axios.get(`${this.apiUrl}/api/board/2302/posts?offset=5&page=0`, {
            headers: {
                Cookie: `GOSSOcookie=${ssoCookie}; IsCookieActived=true;`
            }
        })
            .then(function (response) {
                _self.mainWindowSender.send(
                    'findListCallback',
                    response.data
                );
            })
            .catch(function (error) {
                console.log(error);
                _self.mainWindowSender.send(
                    'showLoginPage'
                );
            })
            .then(function () {
                // always executed
            });
    }
}

module.exports = DaouofficeModule;