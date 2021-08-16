let items = document.getElementById('items');

exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage));
}

exports.addItem = (item, isNew = false) => {
    let itemNode = document.createElement('div');

    itemNode.setAttribute('class', 'read-item');

    itemNode.innerHTML = `<img width="60" height="40" src="${item.screenshot}"><h2>${item.title}></h2>"`

    items.appendChild(itemNode);

    if (isNew) {
        this.storage.push(item)
        this.save();
    }

}

this.storage.forEach(item => {
    this.addItem(item)
})