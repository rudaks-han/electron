

class Jenkins {
    constructor() {
        this.apiUrl = 'http://211.63.24.41:8080';
        this.ipcRender = new IpcRender('jenkins');

        this.initialize();
    }

    initialize() {
        console.error('send.. findList')
        this.ipcRender.send('findList');
    }

}

const jenkins = new Jenkins();