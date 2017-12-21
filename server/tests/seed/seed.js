const Todo = require('../../models/todo');
const User = require('../../models/user');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const todos = [
    {
        _id: new ObjectID(),
        text: 'first',
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: 'second',
        completed: true,
        completedAt: 123,
        _creator: userTwoId
    }
];


const users = [
    {
        _id: userOneId,
        email: 'foo@bar.com',
        password: 'userOnePass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
            }
        ]
    }, {
        _id: userTwoId,
        email: 'foo2@bar.com',
        password: 'userTwoPass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
            }
        ]
    }
];
const populateTodos = done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = done => {
    User.remove({}).then(() => {
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};


module.exports = {
    todos, populateTodos, users, populateUsers
};