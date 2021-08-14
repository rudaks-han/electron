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
        this.userId = 'kmhan';
        this.token = '1124f95f1ddfe9a55649bef93257a1c896';
        this.ipcMainListener = new IpcMainListener('jenkins');
        this.mainWindowSender = new MainWindowSender(this.mainWindow, 'jenkins');
        this.bindIpcMainListener();
    }

    bindIpcMainListener() {
        this.ipcMainListener.on('findList', this.findList.bind(this));
    }

    getAxiosConfig() {
        return {
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        };
    }

    getApiUrl(moduleName) {
        return `http://${this.userId}:${this.token}@211.63.24.41:8080/view/victory/job/${moduleName}/job/master/lastBuild/api/json?pretty=true`;
    }

    findList() {
        const _this = this;

        let urls = [
            axios.get(this.getApiUrl('talk-api-mocha')),
            axios.get(this.getApiUrl('talk-api-shop')),
            axios.get(this.getApiUrl('talk-api-crema')),
            axios.get(this.getApiUrl('talk-api-insight')),
            axios.get(this.getApiUrl('talk-api-share'))
        ];


        axios.all(urls)
            .then(axios.spread((...responses) => {
                let buildResults = [];
                responses.map(response => {
                    const moduleName = this.extractModuleName(response.data.fullDisplayName);
                    const url = response.data.url;
                    const result = response.data.result;
                    const timestamp = response.data.timestamp;
                    const fullDisplayName = response.data.fullDisplayName;

                    buildResults.push({url, moduleName, result, timestamp, fullDisplayName})
                });

                _this.mainWindowSender.send('findListCallback', buildResults);
            }))
            .catch(function (error) {
                console.error('error')
            });

    }

    extractModuleName(fullDisplayName) {
        return fullDisplayName.substring(0, fullDisplayName.indexOf(' '));
    }

}

module.exports = JenkinsClient;