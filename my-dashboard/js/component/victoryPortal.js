class VictoryPortal {
    constructor() {
        this.apiUrl = 'https://enomix.atlassian.net';
        this.ipcRender = new IpcRender('victoryPortal');
        this.layerSelector = '#victory-portal-layer';

        this.bindIpcRenderer();
        this.addEventListener();
        this.initialize();
    }

    initialize() {
        this.ipcRender.send('findList');
    }

    bindIpcRenderer() {
        this.ipcRender.on('findListCallback', this.findListCallback.bind(this));
    }

    addEventListener() {
    }

    findListCallback(event, response) {
        let html = '';
        response.map(item => {
            const date = item.date;
            const link = item.link;
            const title = item.title.rendered;

            //html += `<a href="${link}" class="item" target="_blank">${title} <span>${date.substring(0, 10)}</span></a>`;

            html += `<div class="item">
                        <img class="ui avatar image" src="./img/elliot.jpg">
                        <div class="content">
                          <a class="header" href="${link}" target="_blank">${title} <span>${date.substring(0, 10)}</span></a>
                        </div>
                      </div>`;
        });

        
        $(`${this.layerSelector} .list`).html(html);
    }
}

const victoryPortal = new VictoryPortal();