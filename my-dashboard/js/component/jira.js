class Jira {
    constructor() {
        this.apiUrl = 'https://enomix.atlassian.net';
        this.ipcRender = new IpcRender('jira');
        this.layerSelector = '#jira-layer';

        this.bindIpcRenderer();
        this.addEventListener();
        this.initialize();
    }

    initialize() {
        //this.ipcRender.send('findList');
    }

    bindIpcRenderer() {
        this.ipcRender.on('findListCallback', this.findListCallback.bind(this));
        this.ipcRender.on('requireAuth', this.showLoginPage.bind(this));
    }

    addEventListener() {
        document.querySelector(`${this.layerSelector} .btn-login`).addEventListener('click', this.onClickLogin.bind(this));
    }

    showLoginPage() {
        console.error('showLoginPage')
        this.displayLoginLayer(true);
    }

    displayLoginLayer(showFlag) {
        if (showFlag) {
            document.querySelector(`${this.layerSelector} .login-layer`).style.display = 'block';
        } else {
            document.querySelector(`${this.layerSelector} .login-layer`).style.display = 'none';
        }
    }

    onClickLogin(e) {
        const username = document.querySelector(`${this.layerSelector} .login-layer input[name="username"]`).value;
        const password = document.querySelector(`${this.layerSelector} .login-layer input[name="password"]`).value;
        this.ipcRender.send('login', {username, password});
    }

    findListCallback(event, response) {

    }
}

const jira = new Jira();