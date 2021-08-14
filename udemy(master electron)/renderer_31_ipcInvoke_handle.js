const { ipcRenderer } = require('electron');

document.getElementById('ask').addEventListener('click', e => {
    /*ipcRenderer.send('ask-fruit', e)*/

    ipcRenderer.invoke('ask-fruit').then(answer => {
        console.log(answer)
    })
})
/*

ipcRenderer.on('answer-fruit', (e, answer) => {
    console.log(answer);
})*/
