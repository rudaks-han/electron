const electron = require('electron');
const axios = require('axios');
const { app, ipcMain } = electron;
const MainWindow = require('./app/mainWindow');
const DaouofficeModule = require('./app/module/daouofficeModule');
const JiraModule = require('./app/module/jiraModule');

let mainWindow;
let daouofficeModule;
let jiraModule;
app.on('ready', () => {
    mainWindow = new MainWindow(`file://${__dirname}/index.html`);
    daouofficeModule = new DaouofficeModule(mainWindow);
    jiraModule = new JiraModule(mainWindow);
});
/*
ipcMain.on('daouoffice:findList', (event, path) => {
    //getDaouoffice();
    loginDaouoffice();
});*/
/*


function loginDaouoffice() {
    const username = '';
    const password = '';

    axios.post('https://spectra.daouoffice.com/api/login', {
        username,
        password
    })
        .then(function (response) {
            console.log(response.headers['set-cookie']);
            const cookies = response.headers['set-cookie'];
            let ssoCookie = '';
            for (let i in cookies) {
                //console.log(cookies[i]);
                if (cookies[i].indexOf('GOSSOcookie') > -1) {
                    ssoCookie = cookies[i].substring(cookies[i].indexOf('=')+1, cookies[i].indexOf(';'));
                }
            }

            console.log('ssoCookie : ' + ssoCookie);

            getDaouoffice(ssoCookie);
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}
function getDaouoffice(ssoCookie) {

    axios.get('https://spectra.daouoffice.com/api/board/2302/posts?offset=5&page=0', {
        headers: {
            Cookie: `GOSSOcookie=${ssoCookie}; IsCookieActived=true;`
        }
    })
        .then(function (response) {
            mainWindow.webContents.send(
                'daouoffice:getDaouoffice_callback',
                response.data
            );
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}
*/
