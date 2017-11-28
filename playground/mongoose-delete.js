const {
  mongoose
} = require('../server/db/mongoose');
const Todo = require('../server/models/todo');
const User = require('../server/models/user');

// Todo.remove({}).then(result => {
//   console.log(result);
// });

Todo.findByIdAndRemove('5a1ca89f23991810090c803clo').then(todo => {
  console.log(todo);
});
