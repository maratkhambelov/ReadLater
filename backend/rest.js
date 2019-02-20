const restify = require('restify');
const { BadRequestError, NotFoundError } = require('restify-errors');

const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.pre((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // * - разрешаем всем
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { // Preflight
        res.send();
        next(false);
        return;
    }

    next();
});

let nextId = 1;
const items = [
    {id: nextId++, name: 'harryPotter', link: 'a', tag: 'b', done: false},
    {id: nextId++, name: 'wiki', link: 'a', tag: 'c', done: false},
    {id: nextId++, name: '12', link: 'a', tag: 'd', done: false},
    {id: nextId++, name: '13', link: 'a', tag: 'e', done: false},
    {id: nextId++, name: '12', link: 'a', tag: 'f', done: false}
];

server.get('/items', (req, res, next) => {
    res.send(items);
    next();
});



server.post('/items', (req, res, next) => {

    const {id} = req.body;
    console.log({id});
    if (typeof id !== 'number') {
        next(new BadRequestError('Invalid JSON, must contain id'));
        return;
    }

    if (id === 0) {
        req.body.id = nextId++;
        items.push(req.body);

    }

    else {
        const index = items.findIndex((value) => {

            console.log('value.id ' + value.id);
            console.log('value.name ' + value.name);
            return value.id === id;
        });


        if (index === -1) {
            next(new NotFoundError('Item not found'));
            return;
        }

        items[index] = req.body;
    }
    res.send();
    next();
});

server.del('/items/:id', (req, res, next) => {
    const id = Number(req.params.id);
    console.log(id);
    if (isNaN(id)) {
        return next(new BadRequestError('Invalid id'));
    }

    const index = items.findIndex((value) => {
        return value.id === id;
    });

    if (index === -1) {
        next(new NotFoundError('Item not found'));
        return;
    }

    items.splice(index, 1);
    res.send();
    next();
});

server.listen(7777, () => {
    console.log('server started');
});
