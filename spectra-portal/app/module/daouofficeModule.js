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
        this.ipcMainListener.on('findList', (event, data) => {
            this.findList();
        });

        this.ipcMainListener.on('login', (event, data) => {
            if (data) {
                this.login(data);
            }
        });

        this.ipcMainListener.on('clockIn', (event, data) => {
            this.clockIn();
        });
    }

    getSsoCookie() {
        return this.store.get(this.ssoCookieName);
    }

    getUserId() {
        return this.store.get(this.daouofficeUserId);
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
                _self.findSession();

                _self.findList();
            })
            .catch(function (error) {
                _self.mainWindowSender.send('showLoginPage');
            })
            .then(function () {
                // always executed
            });
    }

    findSession() {
        const _self = this;
        axios.get(`${this.apiUrl}/api/user/session`, {
            headers: {
                Cookie: `GOSSOcookie=${_self.getSsoCookie()}; IsCookieActived=true;`
            }
        })
            .then(function (response) {
                const userId = response.data.data.repId;
                _self.store.set(_self.daouofficeUserId, userId);
            })
            .catch(function (error) {
                console.error(' session error')
            });
    }

    findList() {
        const _self = this;
        axios.get(`${this.apiUrl}/api/board/2302/posts?offset=5&page=0`, {
            headers: {
                Cookie: `GOSSOcookie=${_self.getSsoCookie()}; IsCookieActived=true;`
            }
        })
            .then(function (response) {
                _self.mainWindowSender.send('findListCallback', response.data);
            })
            .catch(function (error) {
                _self.mainWindowSender.send('showLoginPage');
            })
            .then(function () {
                // always executed
            });
    }

    clockIn() {
        const _self = this;

        const userId = this.store.get(this.daouofficeUserId);
        const url = `${this.apiUrl}/api/ehr/timeline/status/clockIn?userId=${userId}&baseDate=${ShareUtil.getCurrDate()}`;
        const data = {"checkTime":`${ShareUtil.getCurrDate()}T${ShareUtil.getCurrTime()}.000Z`,"timelineStatus":{},"isNightWork":false,"workingDay":`${ShareUtil.getCurrDate()}`}
        const config = {
            headers: {
                Cookie: `GOSSOcookie=${_self.getSsoCookie()}; IsCookieActived=true;`
            }
        };

        /*axios.post(url, data, config)
            .then(function (response) {
                let msg = '';
                console.error(response);
                if (response.code == 200) {
                    // 출근도장 OK
                    msg = `${sessionUserName}님, ${currDate} ${currTime}에 출근시간으로 표시되었습니다.`;
                    showBgNotification('출근도장', msg, true);
                    saveLocalStorage('CLOCK_IN_DATE', currDate);
                } else {
                    // 출근 실패
                }
            })
            .catch(function (error) {
                // 출근 실패
            });*/
/*

        let options = {
            method: 'post',
            url: url,
            headers: {'TimeZoneOffset': '540'},
            param: param,
            success : (res) => {
                let msg = '';
                if (res.code == 200)
                {
                    // 출근도장 OK
                    msg = `${sessionUserName}님, ${currDate} ${currTime}에 출근시간으로 표시되었습니다.`;
                    showBgNotification('출근도장', msg, true);
                    saveLocalStorage('CLOCK_IN_DATE', currDate);

                    const firebaseKey = `${firebaseApp.worktime_checker}/${getCurrDateToMonth()}/${getCurrDay()}/${sessionUserName}/출근시간`;
                    const firebaseValue = currTime;

                    firebaseApp.set(firebaseKey, firebaseValue);
                    logger.info('>>> [' + currDate + '] 출근도장 OK.')
                }
                else
                {
                    // 실패
                    msg = `${sessionUserName}님, 출근시간 등록 실패!!!. ==> ${res.message}`;
                    showBgNotification('출근도장', msg);
                    logger.info('>>> [' + currDate + '] 출근도장 Fail.')
                }

                firebaseApp.log(sessionUserName, msg);
            },
            error : (xhr, e) => {
                console.error(e);
                let responseText = JSON.parse(xhr.responseText);

                this.handleError(responseText);

                firebaseApp.log(sessionUserName, responseText);
            },
            complete : function(res) {
            }*/
    }
}

module.exports = DaouofficeModule;