const expect = require('expect');
const request = require('supertest');

const {
    ObjectID
} = require('mongodb');
const {
    app
} = require('../server');
const Todo = require('../models/todo');
const User = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Text from test';
        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({
                    text
                }).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should not create todo with invalid body data', done => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2);
            }).end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should validate id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });

    it('should return 400 if todo not found', done => {
        request(app)
            .get('/todos/abc')
            .expect(400)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const id = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(id)
            })
            .end((err, res) => {
                if (err) {
                    return doen(err);
                }

                Todo.findById(id).then(todo => {
                    expect(todo).toBe(null);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should return 404 if todo not found', done => {
        const id = new ObjectID();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});


describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        const id = todos[0]._id.toHexString();
        const text = 'New text';
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id).then(todo => {
                    expect(todo.text).toBe(text);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should clear completed flag', done => {
        const id = todos[1]._id.toHexString();
        const completed = false;
        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end((err, res) => {
                if (err) {
                    return doen(err);
                }

                Todo.findById(id).then(todo => {
                    expect(todo.completed).toBe(false);
                    expect(todo.completedAt).toBe(null);
                    done();
                }).catch(e => done(e));
            });
    });
});


describe('GET /users/me', () => {
    it('should return user if authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email)
            }).end(done);
    });

    it('should return 401 if not authenticated', done => {
        request(app)
            .get('/users/me')
            .expect(401)
            .end(done);
    });
});


describe('POST /users', () => {
    it('should create a user', done => {
        const email = 'example@example.com';
        const password = '123abcd123';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeDefined();
                expect(expect(res.body._id)).toBeDefined();
                expect(res.body.email).toBe(email);
            }).end(err => {
            if (err) {
                return done(err);
            }
            User.findOne({email}).then(user => {
                expect(user).toBeDefined();
                expect(user.password).not.toBe(password);
                done();
            }).catch(e => done(e));
        });
    });

    it('should return validation errors if request invalid', done => {
        request(app)
            .post('/users')
            .send({email: 'abc', password: '123'})
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', done => {
        const email = users[0].email;
        const password = '123abcd123';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe('POST /uses/login', () => {
    it('should login user and return auth token', done => {
        const email = users[1].email;
        const password = users[1].password;
        request(app).post('/users/login')
            .send({
                email, password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
            }).end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then(user => {
                expect(user.tokens[0].token).toBe(res.headers['x-auth']);
                done();
            }).catch(e => done(e));
        });
    });

    it('should not login with wrong email/password', done => {
        const email = users[1].email;
        const password = users[1].password + '123';
        request(app).post('/users/login')
            .send({email, password})
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).toBeFalsy();
            }).end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then(user => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch(e => done(e));
        });
    });
});


describe('DELETE /users/me/token', () => {
    it('should logout', done => {
        request(app).delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should not do anything when no token given in the header', done => {
        request(app).delete('/users/me/token')
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});