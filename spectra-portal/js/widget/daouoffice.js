class Daouoffice {
    constructor() {
        this.apiUrl = 'https://spectra.daouoffice.com';
        this.ipcRender = new IpcRender('daouoffice');

        this.initialize();
    }

    initialize() {
        this.ipcRender.send('findList');
        this.ipcRender.on('findListCallback', this.findListCallback.bind(this));
        this.ipcRender.on('showLoginPage', this.showLoginPage.bind(this));
        document.querySelector('#btnDaouofficeLogin').addEventListener('click', this.onClickDaouofficeLogin.bind(this));
        document.querySelector('#btnClockIn').addEventListener('click', this.onClickClockIn.bind(this));
        document.querySelector('#btnClockOut').addEventListener('click', this.onClickClockOut.bind(this));
    }

    findListCallback(event, response) {
        this.displayLoginLayer(false);
        let html = '';
        let link = `${this.apiUrl}/app/board/2302/post`;
        response.data.map(item => {
            //console.log(item)
            let createdAt = item.createdAt.substring(0, 16);
            createdAt = createdAt.replace(/T/, ' ');

            html += `<div class="item">
                        <a class="header" href="${link}/${item.id}" target="_blank">${item.title}</a>
                        <div class="description" style="color: #919191!important; size:8px;">
                            ${createdAt} ${item.writer.name} ${item.writer.positionName}
                        </div>
                    </div>`;
        });

        $('#daouoffice-list').html(html);
    }

    showLoginPage() {
        this.displayLoginLayer(true);
    }

    displayLoginLayer(showFlag) {
        if (showFlag) {
            $('#daouofficeLoginLayer').show();
        } else {
            $('#daouofficeLoginLayer').hide();
        }
    }

    onClickDaouofficeLogin(e) {
        const username = document.querySelector('#daouofficeLoginLayer input[name="username"]').value;
        const password = document.querySelector('#daouofficeLoginLayer input[name="password"]').value;
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