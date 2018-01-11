require('../server/config/config');

const {
    mongoose
} = require('../server/db/mongoose');
const Toy = require('./toy');
const toy = new Toy({
    name: 'cat',
    price: 10,
    items: [
        {name: 'foo'},
        {name: 'foo', material: 'bar'},
        {name: 'foo', material: 'bar', weight: 3},
        {name: 'foo', material: 'bar', weight: 4, rows: [{foo: 1}]},
    ]
});

toy.save().then(doc => {
    console.log(doc);
}).catch(e => {
    console.error(e);
});

