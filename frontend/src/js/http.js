export class Http {
    constructor(url) {
        this.url = url;
    }

    getAll(callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.url);
        xhr.addEventListener('load', () => {
            const data = JSON.parse(xhr.responseText);
            callback(data);
        });
        xhr.send();
    }

    save(item, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.url);
        xhr.addEventListener('load', () => {
            callback();
        });
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(item));
    }

    removeById(id, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `${this.url}/${id}`);
        xhr.addEventListener('load', () => {
            callback();
        });
        xhr.send();
    }
}
