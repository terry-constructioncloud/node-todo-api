const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
console.log('connect mongoose')
mongoose.connect(process.env.MONGODB_URI);
module.exports = {
  mongoose
};
