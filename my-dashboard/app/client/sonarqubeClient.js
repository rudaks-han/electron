const electron = require('electron');
const axios = require('axios');
const Store = require('electron-store');
const IpcMainListener = require('../lib/ipcMainListener');
const MainWindowSender = require('../lib/mainWindowSender');
const ShareUtil = require('../lib/shareUtil');

class SonarqubeClient {
    constructor(mainWindow) {
        this.apiUrl = 'http://211.63.24.41:9000';
        this.mainWindow = mainWindow;
        this.store = new Store();
        this.ipcMainListener = new IpcMainListener('sonarqube');
        this.mainWindowSender = new MainWindowSender(this.mainWindow, 'sonarqube');
        this.bindIpcMainListener();
    }

    bindIpcMainListener() {
        //this.clearSsoCookie();
        console.error('aaa')
        this.ipcMainListener.on('findList', this.findList.bind(this));
    }

    getApiUrl(moduleName) {
        return `${this.apiUrl}/api/measures/component?component=${moduleName}&metricKeys=new_bugs,new_vulnerabilities,new_security_hotspots,new_code_smells,projects`;
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
                console.log(responses[0])
                responses.map(response => {
                    console.log(response)
                    /*const moduleName = this.extractModuleName(response.data.fullDisplayName);
                    const url = response.data.url;
                    const result = response.data.result;
                    const timestamp = response.data.timestamp;
                    const fullDisplayName = response.data.fullDisplayName;

                    buildResults.push({url, moduleName, result, timestamp, fullDisplayName})*/
                });

                //_this.mainWindowSender.send('findListCallback', buildResults);
            }))
            .catch(function (error) {
                console.error('error')
            });
    }
}

module.exports = SonarqubeClient;