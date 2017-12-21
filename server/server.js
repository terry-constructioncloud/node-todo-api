require('./config/config.js');
const _ = require('lodash');
const {
    ObjectID
} = require('mongodb');
const {
    mongoose
} = require('./db/mongoose');
const User = require('./models/user');
const Todo = require('./models/todo');
const newTodo = new Todo({
    text: ' Edit this   '
});
const express = require('express');
const bodyParser = require('body-parser');
const {authenticate} = require('./middleware/authenticate');
const app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then(doc => {
        res.send(doc);
    }).catch(e => {
        res.status(400).send(e);
    })

});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({_creator: req.user._id}).then(todos => {
        res.send({
            todos
        });
    }).catch(e => {
        res.status(400).send(e);
    })
});

app.get('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({
            error: 'invalid id'
        });
    }
    Todo.findOne({_id: req.params.id, _creator: req.user._id}).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({
            todo
        });
    }).catch(e => {
        res.status(400).send(e)
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({
            error: 'invalid id'
        });
    }
    Todo.findOneAndRemove({_id: req.params.id, _creator: req.user._id}).then(todo => {
        if (!todo) {
            return res.status(404).send({
                error: 'not found'
            });
        }
        res.send({
            todo
        });
    }).catch(e => {
        res.status(400).send(e)
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(400).send({
            error: 'invalid id'
        });
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = Date.now();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {
        $set: body
    }, {
        new: true
    }).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({
            todo
        });
    }).catch(err => {
        res.status(400).send()
    });
});

app.post('/users/', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user.toJSON());
    }).catch(e => {
        res.status(400).send(e);
    });
});

app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then(user => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send({});
    }).catch(e => {
        res.sendStatus(400);
    });
});
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch(() => {
        res.status(400).send();
    });
});

app.get('/users/me', authenticate, async (req, res) => {
    res.send(req.user);
});

app.listen(process.env.PORT, () => {
    console.log('app is listening on ', process.env.PORT);
});

module.exports = {
    app
};
