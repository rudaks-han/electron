const electron = require('electron');
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
                //Cookie: `cloud.session.token=${cloudSessionToken};`
               // Cookie: `cloud.session.token=eyJraWQiOiJzZXNzaW9uLXNlcnZpY2VcL3Byb2QtMTU5Mjg1ODM5NCIsImFsZyI6IlJTMjU2In0.eyJhc3NvY2lhdGlvbnMiOltdLCJzdWIiOiI1ZDZkZGMxOGM3MDAyZDBkOWRjMjliMGYiLCJlbWFpbERvbWFpbiI6InNwZWN0cmEuY28ua3IiLCJpbXBlcnNvbmF0aW9uIjpbXSwiY3JlYXRlZCI6MTYyODYzNDM2MCwicmVmcmVzaFRpbWVvdXQiOjE2Mjg2MzQ5NjAsInZlcmlmaWVkIjp0cnVlLCJpc3MiOiJzZXNzaW9uLXNlcnZpY2UiLCJzZXNzaW9uSWQiOiJkM2ZiNTA4Yi0xZmEwLTQ1ZmUtYTJjYi1jOWIyMjAzN2M5NDEiLCJhdWQiOiJhdGxhc3NpYW4iLCJuYmYiOjE2Mjg2MzQzNjAsImV4cCI6MTYzMTIyNjM2MCwiaWF0IjoxNjI4NjM0MzYwLCJlbWFpbCI6ImttaGFuQHNwZWN0cmEuY28ua3IiLCJqdGkiOiJkM2ZiNTA4Yi0xZmEwLTQ1ZmUtYTJjYi1jOWIyMjAzN2M5NDEifQ.s_6pzC2HxXykywLMrmtdwON1d7XjUDJGJzHAbNIIwR1cT74B6pKyrtchDPzPPb8oe0kA_5Ao8Vkm4KO2c3Gvo16_8jufH63SOmojDADMYvM5_iMVOMccp-n1Hz0Sjt42KczeQY3iybmd7Z0Un5TO3o7LHOi9kq6VIsC5GV-CqIwJdA171lsxKhK6LVIM9EaR5tMquyM7OnDb_SFIaOWRbJbroGK9WH9bwD3gh6WWeFFe57g9mEJv35JpRHA73s4x8HFKBrJwN60ASuWDb9FIkuuNdiMhXjs_clNIimm9kd2AVqme5W3mxDsfeOMsoLtygmRSsSlZvwzJ_PWIPaZwGQ;`
            }
        })
            .then(function (response) {
                console.log('response')
                console.log(response.data.data)
                console.log(response.data.data.activities.myActivities.workedOn.nodes)
                const items = response.data.data.activities.myActivities.workedOn.nodes;
                items.map(item => {
                    console.log(item)
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
                _this.mainWindowSender.send('requireAuth');
            });
    }

    login(e, data) {
        console.log('login')
        const { username, password } = data;
        const _this = this;
        axios.post(`https://auth.atlassian.com/co/authenticate?application=jira`,
            { username, password })
            .then(function (response) {
                //_this.setSsoCookie(response);
                /*_this.setSsoCookie(response);
                _this.saveUserId();
                _this.findList();*/


            })
            .catch(function (error) {
                console.log()
                _this.mainWindowSender.send('showLoginPage');
            });
    }

    setSsoCookie(response) {
        const cookies = response.headers['set-cookie'];
        let ssoCookie = '';
        console.log('cookies : ' + cookies)

        for (let i in cookies) {
            if (cookies[i].indexOf('cloud.session.token') > -1) {
                ssoCookie = cookies[i].substring(cookies[i].indexOf('=')+1, cookies[i].indexOf(';'));
            }
        }

        console.log('ssoCookie : ' + ssoCookie)
        this.store.set(this.ssoCookieName, ssoCookie);
    }

}

module.exports = JiraClient;