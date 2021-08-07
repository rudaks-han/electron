ipcRenderer.send('daouoffice:getDaouoffice');

ipcRenderer.on('daouoffice:getDaouoffice_callback', (event, response) => {
    let html = '';
    response.data.map(item => {
        console.log(item)

        html += `<div class="item">
                        <a class="header">${item.title}</a>
                        <div class="description">
                            ${item.createdAt}
                        </div>
                    </div>`;
    });

    $('#daouoffice-list').html(html);
});