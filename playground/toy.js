const {
    mongoose
} = require('../server/db/mongoose');


const Toy = mongoose.model('Toy', {
    name: {
        type: String
    },
    price: {
        type: Number
    },
    items: [
        {
            name: {
                type: String
            },
            material: {
                type: String
            },
            weight: {
                type: Number
            },
            rows: {
                type: [],
                default: void 0
            }
        }
    ]
});

module.exports = Toy;
