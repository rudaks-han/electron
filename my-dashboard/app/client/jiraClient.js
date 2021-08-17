const { BrowserWindow, session } = require('electron');
const axios = require('axios');
const Store = require('electron-store');
const IpcMainListener = require('../lib/ipcMainListener');
const MainWindowSender = require('../lib/mainWindowSender');
const ShareUtil = require('../lib/shareUtil');

class JiraClient {
    constructor(mainWindow) {
        this.apiUrl = 'https://enomix.atlassian.net';
        this.mainWindow = mainWindow;
        this.store = new Store();
        this.ipcMainListener = new IpcMainListener('jira');
        this.mainWindowSender = new MainWindowSender(this.mainWindow, 'jira');
        this.bindIpcMainListener();
    }

    bindIpcMainListener() {
        //this.clearSsoCookie();
        this.ipcMainListener.on('findList', this.findList.bind(this));
        this.ipcMainListener.on('login', this.login.bind(this));
    }

    findList() {
        console.log('jiraClient findList')
        const _this = this;
        //const data = {"groups":[{"types":["boards","dashboards","projects","filters","issues"],"limit":20}]};
        const data = {"operationName":"jira_NavigationActivity","query":"\nfragment NavigationActivityItem on ActivitiesItem {\n  id\n  timestamp\n  object {\n    id\n    name\n    localResourceId\n    type\n    url\n    iconUrl\n    containers {\n      name\n      type\n    }\n    extension {\n      ... on ActivitiesJiraIssue {\n        issueKey\n      }\n    }\n  }\n}\n\nquery jira_NavigationActivity($first: Int, $cloudID: ID!) {\n  activities {\n    myActivities {\n      workedOn(first: $first, filters: [{type: AND, arguments: {cloudIds: [$cloudID], products: [JIRA, JIRA_BUSINESS, JIRA_SOFTWARE, JIRA_OPS]}}]) {\n        nodes {\n          ...NavigationActivityItem\n        }\n      }\n    }\n  }\n}\n\n","variables":{"first":10,"cloudID":"431d1acd-ee73-4c56-b41f-d9cfeb440064"}};


        const cloudSessionToken = '';
        axios.post(`${this.apiUrl}/gateway/api/graphql`, data, {
            headers: {
                Cookie: `cloud.session.token=${cloudSessionToken};`
            }
        })
            .then(function (response) {
                console.log('response')
                //console.log(response.data.data)
                //console.log(response.data.data.activities.myActivities.workedOn.nodes)
                const items = response.data.data.activities.myActivities.workedOn.nodes;
                items.map(item => {
                    //console.log(item)
                })
                /*const items = response.data[0].items;
                //const sortStringKeys = (a, b) => String(a.viewTimeAge).localeCompare(b.viewTimeAge);
                items./!*filter(v => v.type === 'issues').sort(sortStringKeys).*!/map(item => {
                    //console.log(item);
                    console.log('>> ' + item.title);
                })*/
            })
            .catch(function (error) {
                console.log('error requireAuth')
                _this.openLoginPage()
                _this.mainWindowSender.send('requireAuth');
            });
    }


    openLoginPage() {
        let ses = session.defaultSession;

        let getCookies = () => {
            ses.cookies.get({'name': 'cloud.session.token'})
                .then(cookies => {
                    console.log(cookies)
                })
                .catch( errors => {
                    console.log(errors)
                })
        }

        let loginWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation : false
            },
            width: 1280,
            height: 800
        })

        loginWindow.loadURL('https://id.atlassian.com/login');
        loginWindow.webContents.on('did-finish-load', e => {
            ses.cookies.get({'name': 'cloud.session.token', 'domain': 'id.atlassian.com'})
                .then(cookies => {
                    //console.error(cookies)
                    cookies.map(cookie => {
                        const cloudSessionToken = cookie.value;
                        console.error('cloudSessionToken : ' + cloudSessionToken)
                        if (cloudSessionToken) {

                            loginWindow.close();
                            loginWindow = null;
                        }
                    })
                });
        })
        loginWindow.webContents.openDevTools();

    }

    login(e, data) {

        console.log('login')
        //const { username, password } = data;
        const username = '';
        const password = '';
        const _this = this;

        axios.post(`https://auth.atlassian.com/co/authenticate?application=jira`,
            { username, password }, {
                headers: {

                }
            })
            .then(function (response) {
                //_this.setSsoCookie(response);
                /*_this.setSsoCookie(response);
                _this.saveUserId();
                _this.findList();*/

                console.log('jira login')
                console.log(response)

                let loginWindow = new BrowserWindow({
                    webPreferences: {
                        nodeIntegration: true,
                        contextIsolation : false
                    },
                    width: 1280,
                    height: 800
                })

                loginWindow.loadURL()
                this.webContents.openDevTools();


            })
            .catch(function (error) {
                console.log('login error')
                console.log(error)
                _this.mainWindowSender.send('showLoginPage');
            });
    }

    setSsoCookie(response) {
        const cookies = response.headers['set-cookie'];
        let ssoCookie = '';
        //console.log('cookies : ' + cookies)

        for (let i in cookies) {
            if (cookies[i].indexOf('cloud.session.token') > -1) {
                ssoCookie = cookies[i].substring(cookies[i].indexOf('=')+1, cookies[i].indexOf(';'));
            }
        }

        //console.log('ssoCookie : ' + ssoCookie)
        this.store.set(this.ssoCookieName, ssoCookie);
    }

}

module.exports = JiraClient;