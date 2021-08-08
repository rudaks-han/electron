const electron = require('electron');
const axios = require('axios');
const Store = require('electron-store');
const IpcMainListener = require('../lib/ipcMainListener');
const MainWindowSender = require('../lib/mainWindowSender');
const ShareUtil = require('../lib/shareUtil');

class DaouofficeModule {
    constructor(mainWindow) {
        this.apiUrl = 'https://spectra.daouoffice.com';
        this.ssoCookieName = 'daouoffice_ssoCookie';
        this.daouofficeUserId = 'daouoffice_userId'; // 7667
        this.mainWindow = mainWindow;
        this.store = new Store();
        this.ipcMainListener = new IpcMainListener('daouoffice');
        this.mainWindowSender = new MainWindowSender(this.mainWindow, 'daouoffice');

        //this.clearSsoCookie();
        this.ipcMainListener.on('findList', this.findList.bind(this));
        this.ipcMainListener.on('login', this.login.bind(this));
        this.ipcMainListener.on('clockIn', this.clockIn.bind(this));
    }

    getUserId() {
        return this.store.get(this.daouofficeUserId);
    }

    getSsoCookie() {
        return this.store.get(this.ssoCookieName);
    }

    clearSsoCookie() {
        this.store.set(this.ssoCookieName, '');
    }

    setSsoCookie(response) {
        const cookies = response.headers['set-cookie'];
        let ssoCookie = '';
        for (let i in cookies) {
            if (cookies[i].indexOf('GOSSOcookie') > -1) {
                ssoCookie = cookies[i].substring(cookies[i].indexOf('=')+1, cookies[i].indexOf(';'));
            }
        }

        this.store.set(this.ssoCookieName, ssoCookie);
    }

    login(e, data) {
        if (!data) return;
        const { username, password } = data;
        const _this = this;
        axios.post(`${this.apiUrl}/api/login`, { username, password})
            .then(function (response) {
                _this.setSsoCookie(response);
                _this.saveUserId();
                _this.findList();
            })
            .catch(function (error) {
                _this.mainWindowSender.send('showLoginPage');
            });
    }

    saveUserId() {
        const _this = this;
        axios.get(`${this.apiUrl}/api/user/session`, {
            headers: {
                Cookie: `GOSSOcookie=${_this.getSsoCookie()}; IsCookieActived=true;`
            }
        })
            .then(function (response) {
                const userId = response.data.data.repId;
                _this.store.set(_this.daouofficeUserId, userId);
            })
            .catch(function (error) {
                console.error(' session error')
            });
    }

    findList() {
        const _this = this;
        axios.get(`${this.apiUrl}/api/board/2302/posts?offset=5&page=0`, {
            headers: {
                Cookie: `GOSSOcookie=${_this.getSsoCookie()}; IsCookieActived=true;`
            }
        })
            .then(function (response) {
                _this.mainWindowSender.send('findListCallback', response.data);
            })
            .catch(function (error) {
                _this.mainWindowSender.send('showLoginPage');
            });
    }

    clockIn() {
        const _this = this;

        axios.post(
            `${this.apiUrl}/api/ehr/timeline/status/clockIn?userId=${this.getUserId()}&baseDate=${ShareUtil.getCurrDate()}`,
            {"checkTime":`${ShareUtil.getCurrDate()}T${ShareUtil.getCurrTime()}.000Z`,"timelineStatus":{},"isNightWork":false,"workingDay":`${ShareUtil.getCurrDate()}`},
            {
                headers: {
                    Cookie: `GOSSOcookie=${_this.getSsoCookie()}; IsCookieActived=true;`,
                    TimeZoneOffset: '540'
                }
            })
            .then(function (response) {
                let msg = '';
                console.error(response.status);

            })
            .catch(function (error) {
                console.log('error');
                const message = error.response.data.message; // 출근이 중복하여 존재합니다.
                console.log(message);
            });
    }

    clockOut() {
        const _this = this;

        axios.post(
            `${this.apiUrl}/api/ehr/timeline/status/clockOut?userId=${this.getUserId()}&baseDate=${ShareUtil.getCurrDate()}`,
            {"checkTime":`${ShareUtil.getCurrDate()}T${ShareUtil.getCurrTime()}.000Z`,"timelineStatus":{},"isNightWork":false,"workingDay":`${ShareUtil.getCurrDate()}`},
            {
                headers: {
                    Cookie: `GOSSOcookie=${_this.getSsoCookie()}; IsCookieActived=true;`,
                    TimeZoneOffset: '540'
                }
            })
            .then(function (response) {
                let msg = '';
                console.error(response.status);

            })
            .catch(function (error) {
                console.log('error');
                const message = error.response.data.message; // 출근이 중복하여 존재합니다.
                console.log(message);
            });
    }
}

module.exports = DaouofficeModule;