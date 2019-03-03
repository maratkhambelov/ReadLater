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
    set items(value) {
        this.storage.items = value;
        this.storage.save();
    }

    add(item) {
        this.storage.add(item);

    }
    removeById(id) {
        this.storage.removeById(id);

    }
}
