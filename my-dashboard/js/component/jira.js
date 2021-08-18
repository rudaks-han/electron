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
    }

    addEventListener() {
        document.querySelector(`${this.layerSelector} .btn-login`).addEventListener('click', this.onClickLogin.bind(this));

    }

    onClickLogin(e) {

    }

    findListCallback(event, item) {
        let html = '';
        item.map(item => {
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
}

const jira = new Jira();