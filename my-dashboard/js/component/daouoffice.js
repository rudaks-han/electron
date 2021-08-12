class Daouoffice {
    constructor() {
        this.ipcRender = new IpcRender('daouoffice');
        this.layerSelector = '#daouoffice-layer';

        this.bindIpcRenderer();
        this.addEventListener();
        this.initialize();
    }

    initialize() {
        this.ipcRender.send('findList');
    }

    bindIpcRenderer() {
        this.ipcRender.on('findListCallback', this.findListCallback.bind(this));
        this.ipcRender.on('requireAuth', this.showLoginPage.bind(this));
    }

    addEventListener() {
        document.querySelector(`${this.layerSelector} .btn-login`).addEventListener('click', this.onClickLogin.bind(this));
        document.querySelector(`${this.layerSelector} .btn-clock-in`).addEventListener('click', this.onClickClockIn.bind(this));
        document.querySelector(`${this.layerSelector} .btn-clock-out`).addEventListener('click', this.onClickClockOut.bind(this));
    }

    findListCallback(event, response) {
        this.displayLoginLayer(false);
        let html = '';
        response.data.map(item => {
            let createdAt = item.createdAt.substring(0, 16);
            createdAt = createdAt.replace(/T/, ' ');
            html += `<div class="item">
                        <a class="header" href="https://spectra.daouoffice.com/app/board/2302/post/${item.id}" target="_blank">${item.title}</a>
                        <div class="description" style="color: #919191!important; size:8px;">
                            ${createdAt} ${item.writer.name} ${item.writer.positionName}
                        </div>
                    </div>`;
        });

        $(`${this.layerSelector} .list`).html(html);
    }

    showLoginPage() {
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

    onClickClockIn(e) {
        /*const username = document.querySelector('#daouofficeLoginLayer input[name="username"]').value;
        const password = document.querySelector('#daouofficeLoginLayer input[name="password"]').value;
        this.ipcRender.send('login', {username, password});*/
        this.ipcRender.send('clockIn');
    }

    onClickClockOut(e) {
    }
}

const daouoffice = new Daouoffice();