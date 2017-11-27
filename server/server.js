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

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  console.log(req.body);

  const todo = new Todo({
    text: req.body.text
  });
  todo.save().then(doc => {
    res.send(doc);
  }).catch(e => {
    res.status(400).send(e);
  })

});

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
    res.send({
      todos
    });
  }).catch(e => {
    res.status(400).send(e);
  })
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  if (!ObjectID.isValid(id)) {
    return res.status(400).send({
      error: 'invalid id'
    });
  }
  Todo.findById(req.params.id).then(todo => {
    if (!todo) {
      todo = {};
    }
    res.send({
      todo
    });
  }).catch(e => {
    res.status(400).send(e)
  });
});

app.listen(3000, () => {
  console.log('app is listening on ', 3000);
});

module.exports = {
  app
};
// newTodo.save().then((doc) => {
//   console.log('saved', doc);
// }).catch(e => {
//   console.error('cannot save', e);
// });


// new User({
//   email: 'foo@bar.com'
// }).save().then(() => {
//   console.log('user saved');
// }).catch(err => {
//   console.error(err);
// });
