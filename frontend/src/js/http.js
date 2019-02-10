export class Http {
    constructor(url) {
        this.url = url;
    }

    getAll(callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.url);
        xhr.addEventListener('load', () => {
            // когда был отправлен запрос и получен ответ
            // 404, 405
            console.log('loaded');
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                callback(data);
            }
        });
        xhr.addEventListener('error', () => {
           // когда ответ не получен, не удалось отправить запрос и т.д.
        });
        xhr.addEventListener('loadend', () => {
           console.log('request completed');
        });
        xhr.send();
    }

    save(item, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.url);
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                callback();
            }
        });
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(item));
    }

    removeById(id, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `${this.url}/${id}`);
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                callback();
            }
        });
        xhr.send();
    }
}
