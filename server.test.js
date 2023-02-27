const request = require('supertest');
const { app, server } = require('./server')();

describe("", () => {
    afterAll(async () => {
        server.close()
    })
    it("/health should return 200", async() => {
        await request(app).get('/health').expect(200, JSON.stringify({ general: true }))
    })
})