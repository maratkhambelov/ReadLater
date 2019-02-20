export class Book {
    constructor(name, link, tag) {
        this.id = 0;
        this.name = name;
        this.link = link;
        this.tag = tag;
        this.done = false;
    }
}
export class BookList {

    constructor(storage) {
        this.storage = storage;
    }
    get items() {
        return this.storage.items;
    }

    add(item) {
        this.storage.add(item);

    }
    remove(item) {
        this.storage.remove(item);

    }
}
