const electron = require('electron');
const axios = require('axios');
const { app, ipcMain } = electron;
const MainWindow = require('./app/mainWindow');
const DaouofficeClient = require('./app/client/daouofficeClient');
const JiraClient = require('./app/client/jiraClient');
const JenkinsClient = require('./app/client/jenkinsClient');
const SonarqubeClient = require('./app/client/sonarqubeClient');
const VictoryPortalClient = require('./app/client/victoryPortalClient');

let mainWindow;
let daouofficeClient;
let jiraClient;
let jenkinsClient;
let sonarqubeClient;
let victoryPortalClient;
app.on('ready', () => {
    mainWindow = new MainWindow(`index.html`);
    daouofficeClient = new DaouofficeClient(mainWindow);
    jiraClient = new JiraClient(mainWindow);
    jenkinsClient = new JenkinsClient(mainWindow);
    sonarqubeClient = new SonarqubeClient(mainWindow);
    victoryPortalClient = new VictoryPortalClient(mainWindow);

    ipcMain.on(`logout`, (event, data) => {
        logout();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    })
});


function logout() {
    console.log('all logout');
}