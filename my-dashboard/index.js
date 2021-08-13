const electron = require('electron');
const axios = require('axios');
const { app, ipcMain } = electron;
const MainWindow = require('./app/mainWindow');
const DaouofficeClient = require('./app/client/daouofficeClient');
const JiraClient = require('./app/client/jiraClient');
const JenkinsClient = require('./app/client/jenkinsClient');
const SonarqubeClient = require('./app/client/sonarqubeClient');

let mainWindow;
let daouofficeClient;
let jiraClient;
let jenkinsClient;
let sonarqubeClient;
app.on('ready', () => {
    mainWindow = new MainWindow(`index.html`);
    daouofficeClient = new DaouofficeClient(mainWindow);
    jiraClient = new JiraClient(mainWindow);
    jenkinsClient = new JenkinsClient(mainWindow);
    sonarqubeClient = new SonarqubeClient(mainWindow);

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