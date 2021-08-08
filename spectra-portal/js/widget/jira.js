

class Jira {
    constructor() {
        this.apiUrl = 'https://enomix.atlassian.net';
        this.ipcRender = new IpcRender('jira');

        this.initialize();
    }

    initialize() {
        console.error('send.. findList')
        this.ipcRender.send('findList');
    }

}

const jira = new Jira();