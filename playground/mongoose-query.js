const {
  mongoose
} = require('../server/db/mongoose');
const Todo = require('../server/models/todo');
const User = require('../server/models/user');

const {
  ObjectID
} = require('mongodb');
const id = '5a1795b32c03e11938f8a2da';

// console.log(ObjectID.isValid('123456'));
// Todo.find({
//   _id: id
// }).then(res => {
//   console.log(res);
// });

// Todo.findOne().then(res => {
//   console.log(res);
// });


// Todo.findById(id).then(res => {
//   console.log(res);
// });

User.findById('5a16568c74b17013927aa97f').then(res=>{
  console.log(res);
}).catch(err=>console.error(err));
