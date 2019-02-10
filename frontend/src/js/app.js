import {Http} from './http.js';

const http = new Http('http://localhost:7777/items');
const ulEl = document.querySelector('#tasks');
let cachedItems = [];

ulEl.addEventListener('click', async (evt) => {
    // evt.target -> EventTarget -> Object
    if (evt.target.getAttribute('data-action') === 'remove') {
        // Для упрощения -> while
        const id = evt.target.parentElement.getAttribute('data-id');
        await http.removeById(id);
        await loadData();
    }
});

ulEl.addEventListener('change', async (evt) => {
    if (evt.target.getAttribute('data-change') === 'done') {
        const id = Number(evt.target.parentElement.parentElement.getAttribute('data-id'));
        const item = cachedItems.find((value) => {
            return value.id === id;
        });
        item.done = evt.target.checked;
        await http.save(item);
        await loadData();
    }
});

loadData(); // -> Promise

async function loadData() {
    try {
        const response = await http.getAll(); // http.getAll() -> Promise (запоминает эту точку, чтобы вернуться сюда тогда, когда промис разрешится)
        cachedItems = await response.json(); // Promise ->
        console.log(cachedItems);

        ulEl.innerHTML = '';

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
            ulEl.appendChild(liEl);
        });

    } catch (e) {
        // e -> ошибка
        console.log(e);
    } finally {
        console.log('we finished');
    }
}
