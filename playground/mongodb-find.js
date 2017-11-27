const {
  MongoClient,
  ObjectID
} = require('mongodb');

const obj = new ObjectID();

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.error('Unable to connect to mongo server', err);
  }
  console.log('connected to mongo server');

  // db.collection('Todos').find({
  //   _id: new ObjectID('5a14fe0a81eb150e03e695c2')
  // }).toArray().then(docs => {
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, err => {
  //   console.error(err);
  // });

  db.collection('Users').find({
    name:'John'
  }).toArray().then(data => {
    console.log(data)
  }, err => {
    console.error(err);
  });



  db.close();
});
