const {MongoClient, ObjectID} = require('mongodb');

const obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.error('Unable to connect to mongo server', err);
  }

  console.log('connected to mongo server');
  // db.collection('Todos').insertOne({
  //   text: 'something',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.error('Unable to insert data', err);
  //   }
  //   console.log('Added data', JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'john',
  //   age: 20,
  //   location:'AU'
  // }, (err, result) => {
  //   if (err) {
  //     return console.error('Unable to insert data', err);
  //   }
  //   console.log('Added data', JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id.getTimestamp());
  // });

  db.close();
});
