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
        //this.ipcRender.send('logout');
        this.ipcRender.send('findList');
    }

    bindIpcRenderer() {
        this.ipcRender.on('findListCallback', this.findListCallback.bind(this));
        this.ipcRender.on('requireAuth', this.showLoginPage.bind(this));
    }

    addEventListener() {
        document.querySelector(`${this.layerSelector} .btn-login`).addEventListener('click', this.onClickLogin.bind(this));
        document.querySelector(`${this.layerSelector} .btn-logout`).addEventListener('click', this.onClickLogout.bind(this));
    }

    showLoginPage(e) {
        this.displayLoginLayer(true);
    }

    displayLoginLayer(showFlag) {
        if (showFlag) {
            document.querySelector(`${this.layerSelector} .login-layer`).style.display = 'flex';
        } else {
            document.querySelector(`${this.layerSelector} .login-layer`).style.display = 'none';
        }
    }

    onClickLogin(e) {
        this.ipcRender.send('openLoginPage');
    }

    onClickLogout(e) {
        this.ipcRender.send('logout');
    }

    findListCallback(event, data) {
        if (data.length === 0) {
            this.emptyList();
            return;
        }

        this.addList(data);
        this.displayLoginLayer(false);
    }

    addList(data) {
        let html = '';

        data.map(item => {
            const issueKey = item.object.extension.issueKey;
            const name = item.object.name;
            const containerName = item.object.containers[1].name;

            html += `<div class="item">
                        <i class="large middle aligned icon"></i>
                        <div class="content">
                            <a href="https://enomix.atlassian.net/browse/${issueKey}" class="header" target="_blank">${name}</a>
                            <div class="description">${issueKey} | ${containerName}</div>
                        </div>
                    </div>`;
        });

        $(`${this.layerSelector} .list`).html(html);
    }

    emptyList() {
        $(`${this.layerSelector} .list`).html('');
    }
}

const jira = new Jira();