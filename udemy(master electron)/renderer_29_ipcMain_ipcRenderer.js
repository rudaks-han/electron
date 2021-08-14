const { ipcRenderer } = require('electron')

let i = 1;
setInterval(() => {
    console.log(i);
    i++;
}, 1000)
document.getElementById('talk').addEventListener('click', e => {
    //ipcRenderer.send('channel1', 'Hello from main window')
    let reponse = ipcRenderer.sendSync('sync-message', 'Waiting for response')
    console.log(reponse)
})

ipcRenderer.on('channel1-response', (e, args) => {
    console.log(args)
})

ipcRenderer.on('mailbox', (e, args) => {
    console.log(args)
})