class Sonarqube {
    constructor() {
        this.ipcRender = new IpcRender('sonarqube');
        this.layerSelector = '#sonarqube-layer';

        this.bindIpcRenderer();
        this.initialize();
    }

    initialize() {
        console.log('sonar findList')
        this.ipcRender.send('findList');
    }

    bindIpcRenderer() {
        this.ipcRender.on('findListCallback', this.findListCallback.bind(this));
    }

    findListCallback(event, response) {
        let html = '';
        html += '<div class="ui divided items">';

        response.map(item => {
            const moduleName = item.moduleName;
            const measures = item.measures;
            let codeSmellValue, codeSmellBestValue;
            let vulnerabilitiesValue, vulnerabilitiesBestValue;
            let bugsValue, bugsBestValue;
            let securityHopspotsValue, securityHopspotsBestValue;

            /*if (moduleName !== 'talk-api-mocha')
                return;*/

            measures.map(measure => {
                let bestValue = measure.periods[0]['bestValue'];
                let value = measure.periods[0]['value'];
                if (measure.metric === 'new_security_hotspots') {
                    securityHopspotsBestValue = bestValue;
                    securityHopspotsValue = value;
                } else if (measure.metric === 'new_vulnerabilities') {
                    vulnerabilitiesBestValue = bestValue;
                    vulnerabilitiesValue = value;
                } else if (measure.metric === 'new_code_smells') {
                    codeSmellBestValue = bestValue;
                    codeSmellValue = value;
                } else if (measure.metric === 'new_bugs') {
                    bugsBestValue = bestValue;
                    bugsValue = value;
                } else {
                    console.log(`"${measure.metric}" is not defined.`)
                }
            });

            html += `<div class="item">
                        <div class="content">
                            <a class="header">${moduleName}</a>
                            <div class="extra">
                                <span>
                                    <a class="ui right pointing basic label">Bugs</a>
                                    <a class="ui ${bugsBestValue? 'green' : 'red'} circular label">${bugsBestValue? 'A' : 'E'}</a>
                                </span>
                                <span>
                                    <a class="ui right pointing basic label">Vulnerabilities</a>
                                    <a class="ui ${vulnerabilitiesBestValue? 'green' : 'red'} circular label">${vulnerabilitiesBestValue? 'A' : 'E'}</a>
                                </span>
                                <span>
                                    <a class="ui right pointing basic label">Code Smells</a>
                                    <a class="ui ${codeSmellBestValue? 'green' : 'red'} circular label">${codeSmellBestValue? 'A' : 'E'}</a>
                                </span>
                                
                            </div>
                        </div>
                    </div>`;
        });

        html += '</div>';

        $(`${this.layerSelector} .list`).html(html);
    }

    toDate(timestamp) {
        return timeSince(timestamp) + ' ago';
    }
}

const sonarqube = new Sonarqube();