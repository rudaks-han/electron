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
        console.log('jiraClient constructor')
        this.ipcMainListener.on('findList', (event, data) => {
            console.log('jiraClient.on.. findList')
            this.findList();
        });
    }

    findList() {
        console.log('findList...')
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
                console.log('error')
                console.log(error)
            })
            .then(function () {
                // always executed
            });
    }

}

module.exports = JiraClient;