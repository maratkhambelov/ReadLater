export class Http {
    constructor(url) {
        this.url = url;
    }

    getAll() {
        return fetch(this.url);
    }

    save(item) {
        return fetch(this.url, {
           body: JSON.stringify(item),
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           }
        });
    }

    removeById(id) {
        return fetch(`${this.url}/${id}`, {
            method: 'DELETE'
        });
    }
}
