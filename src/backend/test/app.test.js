const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../app');
const { createDatabase } = require('../db');

function setup() {
  const database = createDatabase();
  const instance = createApp({ database, jwtSecret: 'test-secret-that-is-long-enough' });
  return { ...instance, client: request(instance.app) };
}

async function register(client, email) {
  const response = await client
    .post('/api/auth/register')
    .send({ email, password: 'correct horse battery staple' });
  assert.equal(response.status, 201);
  return response.body.token;
}

test('registers and logs in a user', async () => {
  const { client, database } = setup();
  const token = await register(client, 'ALICE@example.com');
  assert.ok(token);

  const login = await client
    .post('/api/auth/login')
    .send({ email: 'alice@example.com', password: 'correct horse battery staple' });
  assert.equal(login.status, 200);
  assert.equal(login.body.user.email, 'alice@example.com');

  const me = await client.get('/api/auth/me').set('Authorization', `Bearer ${token}`);
  assert.equal(me.status, 200);
  assert.equal(me.body.user.email, 'alice@example.com');
  database.close();
});

test('enforces private and public todo visibility and owner-only mutations', async () => {
  const { client, database } = setup();
  const aliceToken = await register(client, 'alice@example.com');
  const bobToken = await register(client, 'bob@example.com');

  const privateTodo = await client
    .post('/api/todos')
    .set('Authorization', `Bearer ${aliceToken}`)
    .send({ title: 'Private task' });
  const publicTodo = await client
    .post('/api/todos')
    .set('Authorization', `Bearer ${aliceToken}`)
    .send({ title: 'Public task', isPublic: true });
  assert.equal(privateTodo.status, 201);
  assert.equal(publicTodo.status, 201);

  const bobTodos = await client.get('/api/todos').set('Authorization', `Bearer ${bobToken}`);
  assert.equal(bobTodos.status, 200);
  assert.deepEqual(bobTodos.body.todos.map((todo) => todo.title), ['Public task']);

  const privateRead = await client
    .get(`/api/todos/${privateTodo.body.todo.id}`)
    .set('Authorization', `Bearer ${bobToken}`);
  assert.equal(privateRead.status, 404);

  const forbiddenUpdate = await client
    .patch(`/api/todos/${publicTodo.body.todo.id}`)
    .set('Authorization', `Bearer ${bobToken}`)
    .send({ title: 'Changed by Bob' });
  assert.equal(forbiddenUpdate.status, 404);

  const publicFeed = await client.get('/api/todos/public');
  assert.equal(publicFeed.status, 200);
  assert.equal(publicFeed.body.todos[0].title, 'Public task');
  const publicRead = await client.get(`/api/todos/${publicTodo.body.todo.id}`);
  assert.equal(publicRead.status, 200);
  database.close();
});

test('supports todo CRUD with validation', async () => {
  const { client, database } = setup();
  const token = await register(client, 'owner@example.com');
  const unauthenticated = await client.post('/api/todos').send({ title: 'No token' });
  assert.equal(unauthenticated.status, 401);

  const invalid = await client
    .post('/api/todos')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: '' });
  assert.equal(invalid.status, 400);

  const created = await client
    .post('/api/todos')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Write tests', description: 'Cover the API' });
  assert.equal(created.status, 201);

  const updated = await client
    .put(`/api/todos/${created.body.todo.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Write better tests', isPublic: true });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.todo.isPublic, true);

  const removed = await client
    .delete(`/api/todos/${created.body.todo.id}`)
    .set('Authorization', `Bearer ${token}`);
  assert.equal(removed.status, 204);
  database.close();
});
