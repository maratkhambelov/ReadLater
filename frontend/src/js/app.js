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
const statusEl = document.querySelector('#bookstatus')
const inputInfoEl = document.querySelector('#inputinfo')

let cachedItems = [];
let cachedItemsFiltered = [];

const bookList  = new BookList(new LocalStorage());

loadData();

searchBookEl.addEventListener('click', (evt) => {

    searchedBooksEl.innerHTML = '';
    const nameBook = nameBookEl.value;
    const linkBook = linkBookEl.value;
    const tagBook = tagBookEl.value;
    let status = statusEl.value;



    const filterByName = cachedItems.filter(item => item.name === nameBook);
    console.log('filterByName');
    console.log(filterByName);
    const filterByLink = cachedItems.filter(item => item.link === linkBook);
    console.log('filterByLink');
    console.log(filterByLink);
    const filterByTag = cachedItems.filter(item => item.tag === tagBook);
    console.log('filterByTag');
    console.log(filterByTag);
    let filteredArrThree = filterByName.concat(filterByLink, filterByTag);
    console.log('filteredArrThree')
    console.log(filteredArrThree);
    let filteredArr = filteredArrThree;

    console.log(filteredArr);
    for(let v = 0; v < filteredArr.length; v++) {
        console.log('filteredArr[v] ' + filteredArr[v].id);
        for(let i = 0; i < filteredArr.length; i++) {
            console.log('filteredArr[i] ' + filteredArr[i].id);
            if(filteredArr[v].id === filteredArr[i].id) {
                console.log('filteredArr.splice ' + filteredArr[i].id);
                filteredArr.splice(i, 1);
            }
        }
    }
    console.log(filteredArr);
    filteredByStatus(status, filteredArr);

    function filteredByStatus (statusValue, statusFilteredArray) {

        if(statusValue !== '') {
            if (statusValue === 'Readed') {
                const filterByTrue = statusFilteredArray.filter(item => item.done === true);
                console.log(filterByTrue);
                // filterByName.concat(filterByTrue, filterByLink, filterByTag);
            }
            if (statusValue === 'Unreaded') {
                const filterByFalse = statusFilteredArray.filter(item => item.done === false);
                console.log(filterByFalse);
            }
        }
    }

    //TODO: соединить в едино массивы (возможно concat)


    });



addBookEl.addEventListener('click', async() => {

    const nameBook = nameBookEl.value;
    const linkBook = linkBookEl.value;
    const tagBook = tagBookEl.value;

    const book = new Book(nameBook, linkBook, tagBook);
    const filterLink = cachedItems.filter(item =>  item.link === linkBook);
    if(filterLink.length >= 1) {
        console.log('Такая ссылка уже существует')
        return ;
    }
    bookList.add(book);
    await http.save(book);
    await loadData();
});

bookListEl.addEventListener('click', async (evt) => {
    if (evt.target.getAttribute('data-action') === 'remove') {
        const id = Number(evt.target.parentElement.getAttribute('data-id'));
        await http.removeById(id);
        bookList.removeById(id);
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
                 <label><input data-change="done" type="checkbox"> ${item.name} ${item.link} ${item.tag} </label>
                 <button data-action="remove">Remove</button>
              `;
            const checkboxEl = liEl.querySelector('[data-change=done]');
            checkboxEl.checked = item.done;

            if(item.done === false) {
                booksToReadEl.appendChild(liEl);
            } else {
                booksReadedEl.appendChild(liEl);
            }

        });
        bookList.items = cachedItems;
        cachedItemsFiltered = cachedItems;




    } catch (e) {
        // e -> ошибка
        console.log(e);
    } finally {
        console.log('we finished');
    }
}





// function filterByStatusUnreaded(item) {
//     if (item.done === false) {
//         return true
//     }
//     return false
// }
// function  filterByStatusReaded(item) {
//     if (item.done === true) {
//         return true
//     }
//     return false
// }
// if(status === 'Unreaded') {
//     const cachedItemsFilteredByFalse = cachedItemsFiltered.filter(filterByStatusUnreaded);
//     cachedItemsFilteredByFalse.forEach((item) => {
//
//         const liFilteredEl = document.createElement('li');
//         liFilteredEl.innerHTML = `
//         <span>${item.name} ${item.link} ${item.tag}</span>`
//         searchedBooksEl.appendChild(liFilteredEl);
//     });
// }
// if (status === 'Readed') {
//     const cachedItemsFilteredByTrue = cachedItemsFiltered.filter(filterByStatusReaded)
//     cachedItemsFilteredByTrue.forEach((item) => {
//
//         const liFilteredEl = document.createElement('li');
//         liFilteredEl.innerHTML = `
//         <span>${item.name} ${item.link} ${item.tag}</span>`
//         searchedBooksEl.appendChild(liFilteredEl);
//     });
// }


// if(nameBook === '' && linkBook === '' && tagBook === '' && status === '') {
//     createItemsFiltered();
// } else {
//     if(status === 'Readed') {
//         const statusBook = true;
//         commonFilter(statusBook);
//     } if (status === 'Unreaded') {
//         const statusBook = false;
//         commonFilter(statusBook);
//     }
//
//     function commonFilter (stBook) {
//         function filterBy(item) {
//             if (item.name === nameBook
//                 && item.link === linkBook
//                 && item.tag === tagBook
//                 && item.done === stBook) {
//                 return true
//             }
//             return false;
//         }
//
//         cachedItemsFiltered = cachedItems.filter(filterBy)
//         createItemsFiltered();
//     }
// }
// cachedItemsFiltered = cachedItems.filter(filterBy)
// createItemsFiltered();
// function createItemsFiltered () {
//     cachedItemsFiltered.forEach((item) => {
//         const liFilteredEl = document.createElement('li');
//         liFilteredEl.innerHTML = `
//             <span>${item.name} ${item.link} ${item.tag}</span>`
//         searchedBooksEl.appendChild(liFilteredEl);
//     });
// }