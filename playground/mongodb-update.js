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

  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5a14fe0a81eb150e03e695c2')
  }, {
    $unset: {
      test2: 'test2'
    }
  }, {
    returnOriginal: false
  }).then(result => {
    console.log(result);
  })


  db.close();
});
