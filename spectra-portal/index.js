const electron = require('electron');
const axios = require('axios');
const { app, ipcMain } = electron;
const MainWindow = require('./app/mainWindow');
const DaouofficeClient = require('./app/client/daouofficeClient');
const JiraClient = require('./app/client/jiraClient');
const JenkinsClient = require('./app/client/jenkinsClient');

let mainWindow;
let daouofficeClient;
let jiraClient;
let jenkinsClient;
app.on('ready', () => {
    mainWindow = new MainWindow(`file://${__dirname}/index.html`);
    daouofficeClient = new DaouofficeClient(mainWindow);
    jiraClient = new JiraClient(mainWindow);
    jenkinsClient = new JenkinsClient(mainWindow);

    ipcMain.on(`logout`, (event, data) => {
        logout();
    });
});


function logout() {
    console.log('all logout');
}