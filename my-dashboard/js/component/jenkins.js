class Jenkins {
    constructor() {
        this.ipcRender = new IpcRender('jenkins');
        this.layerSelector = '#jenkins-layer';

        this.bindIpcRenderer();
        this.initialize();
    }

    initialize() {
        this.ipcRender.send('findList');
    }

    bindIpcRenderer() {
        this.ipcRender.on('findListCallback', this.findListCallback.bind(this));
    }

    findListCallback(event, response) {
        let html = '';

        response.map(item => {
            let style = 'background: #8cc04f;';
            if (item.result !== 'SUCCESS') {
                style = 'background: #d54c53;';
            }

            html += `<div class="ui inverted segment" style="${style}">
                        <span>${item.moduleName}</span>
                        <span style="float:right">${this.toDate(item.timestamp)}</span>
                    </div>`;

        });

        $(`${this.layerSelector} .list`).html(html);
    }

    toDate(timestamp) {
        return timeSince(timestamp) + ' ago';
    }
}

const jenkins = new Jenkins();