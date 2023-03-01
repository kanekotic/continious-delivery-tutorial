const request = require('supertest');
const app = require('../../server')();
const { faker } = require('@faker-js/faker');

describe("health route", () => {
    let server
    afterAll(async () => {
        server = app.listen(3000)
    })
    afterAll(async () => {
        server.close()
    })
    
    it("should return 200 in the root path with a list of users", async() => {
        await request(app).get('/users').expect(200, {users: []})
    })

    it("allows to add users that we can recover", async() => {
        const name = faker.random.word()
        await request(app)
        .post('/users')
        .send({ name })
        .set('Accept', 'application/json')
        .expect(201)
        await request(app)
        .get('/users')
        .expect(200, {users: [{name}]})
    })
    
})