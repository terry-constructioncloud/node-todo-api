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

  db.collection('Todos').findOneAndDelete({
    text: 'walk'
  }).then(result => {
    console.log(result);
  });


  db.close();
});
