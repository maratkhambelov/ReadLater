import {Http} from './http.js';
import {Book} from './lib.js';
 import {LocalStorage} from './storage.js';
 import {BookList} from './lib.js';


const http = new Http('http://localhost:7777/items');
const booksToReadEl = document.querySelector('#bookstoread');
const booksReadedEl = document.querySelector('#booksreaded')
const addBookEl = document.querySelector('#addbook');
const nameBookEl = document.querySelector('#namebook');
const bookListEl = document.querySelector('#booklist');
const searchBookEl = document.querySelector('#searchbook');
const linkBookEl = document.querySelector('#linkbook');
const tagBookEl = document.querySelector('#tagbook');
const searchedBooksEl = document.querySelector('#searchedbooks');
// const statusEl = document.querySelector('#bookstatus')

 let  cachedItems = []
const bookList  = new BookList(new LocalStorage());


loadData();




searchBookEl.addEventListener('click', () => {
    searchedBooksEl.innerHTML = '';

    const nameBook = nameBookEl.value;
    const linkBook = linkBookEl.value;
    const tagBook = tagBookEl.value;


    function filterBy(item) {
        if (item.name === nameBook
            || item.link === linkBook
            || item.tag === tagBook) {
            return true
        }
        return false;
    }
    const cachedItemsFiltered = cachedItems.filter(filterBy)
    // console.log(cachedItemsFiltered)

    cachedItemsFiltered.forEach((item) => {

        const liFilteredEl = document.createElement('li');
        liFilteredEl.innerHTML = `
        <span>${item.name} ${item.link} ${item.tag}</span>
        `
            searchedBooksEl.appendChild(liFilteredEl);
    });

    });


addBookEl.addEventListener('click', async() => {

    const nameBook = nameBookEl.value;
    const linkBook = linkBookEl.value;
    const tagBook = tagBookEl.value;

    const book = new Book(nameBook, linkBook, tagBook);
    bookList.add(book);

    await http.save(book);
    await loadData();
});

bookListEl.addEventListener('click', async (evt) => {
    // evt.target -> EventTarget -> Object



    if (evt.target.getAttribute('data-action') === 'remove') {
        // Для упрощения -> while
        const id = evt.target.parentElement.getAttribute('data-id');
        // function isThatItem(item) {
        //     return item.id === id;
        // }
        // console.log(bookList);
        // const deletedItem = bookList.items.find(isThatItem)
        // console.log(deletedItem);
        // bookList.remove(deletedItem);
        bookList.remove(id);
        await http.removeById(id);
        await loadData();
    }
});



bookListEl.addEventListener('change', async (evt) => {
    if (evt.target.getAttribute('data-change') === 'done') {
        const id = Number(evt.target.parentElement.parentElement.getAttribute('data-id'));
        console.log(evt.target.parentElement.parentElement.getAttribute('data-id'));
        const item = cachedItems.find((value) => {
            return value.id === id;
        });
        item.done = evt.target.checked;
        await http.save(item);

        await loadData();
    }
});




// loadData(); // -> Promise

async function loadData() {
    try {
        const response = await http.getAll(); // http.getAll() -> Promise (запоминает эту точку, чтобы вернуться сюда тогда, когда промис разрешится)

        cachedItems = await response.json(); // Promise ->



        booksToReadEl.innerHTML = '';
        booksReadedEl.innerHTML = '';

        cachedItems.forEach((item) => {
            const liEl = document.createElement('li');
            // liEl.item = item;
            liEl.setAttribute('data-id', item.id);
            liEl.innerHTML = `
                 <label><input data-change="done" type="checkbox"> ${item.name}</label>
                 <button data-action="remove">Remove</button>
              `;
            const checkboxEl = liEl.querySelector('[data-change=done]');
            checkboxEl.checked = item.done;

            console.log(item.done);
            if(item.done === false) {
                booksToReadEl.appendChild(liEl);
            } else {
                booksReadedEl.appendChild(liEl);
            }

        });

    } catch (e) {
        // e -> ошибка
        console.log(e);
    } finally {
        console.log('we finished');
    }
}
