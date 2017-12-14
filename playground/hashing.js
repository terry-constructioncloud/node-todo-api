const {
    SHA256
} = require('crypto-js');

const bcrypt = require('bcryptjs');

const password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(salt, hash);
//     });
// });

const hashedPassword = '$2a$10$amh2OwqCtfNrMu9HHoahMONpWxgoW73SDlos78yKcG.GRrKL.3/dW';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});


// const jwt = require('jsonwebtoken');
// const data = {
//     id: 10
// };
//
// const token = jwt.sign(data, '123abc');
// console.log(token);
// const decoded = jwt.verify(token, '123abc');
// console.log(decoded);
// const message = 'I am user number 3, and I will be going to somewhere in the south';
//
// const hash = SHA256(message).toString();
// console.log(message, hash);
//
// const data = {
//   id: 4
// };
//
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data)).toString()
// };
//
// const resultHash = SHA256(JSON.stringify(token.data))


