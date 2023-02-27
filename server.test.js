const request = require('supertest');
const app = require('./server')();

describe("", () => {
    let server
    afterAll(async () => {
        server = app.listen(3000)
    })
    afterAll(async () => {
        server.close()
    })
    
    it("/health should return 200", async() => {
        await request(app).get('/health').expect(200, "")
    })
})