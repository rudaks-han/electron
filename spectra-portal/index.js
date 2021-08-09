const electron = require('electron');
const axios = require('axios');
const { app, ipcMain } = electron;
const MainWindow = require('./app/mainWindow');
const DaouofficeClient = require('./app/client/daouofficeClient');
const JiraClient = require('./app/client/jiraClient');

let mainWindow;
let daouofficeClient;
let jiraClient;
app.on('ready', () => {
    mainWindow = new MainWindow(`file://${__dirname}/index.html`);
    daouofficeClient = new DaouofficeClient(mainWindow);
    jiraClient = new JiraClient(mainWindow);

    ipcMain.on(`logout`, (event, data) => {
        logout();
    });
});


function logout() {
    console.log('all logout');
}