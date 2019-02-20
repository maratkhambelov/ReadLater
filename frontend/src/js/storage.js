export class LocalStorage {
    constructor() {
        const savedItems = JSON.parse(localStorage.getItem('books'));
        if (savedItems !== null) {
            this.items = savedItems;
        } else {
            this.items = [];
        }
    }
    add(item) {
        this.items.push(item); // в конец
        this.save();
    }
    save() {
        localStorage.setItem('books', JSON.stringify(this.items));
    }
    remove(item) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
        this.save();
    }

}




