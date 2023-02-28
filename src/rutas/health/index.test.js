const request = require('supertest');
const app = require('../../server')();

describe("health route", () => {
    let server
    afterAll(async () => {
        server = app.listen(3000)
    })
    afterAll(async () => {
        server.close()
    })
    
    it("should return 200 in the root path", async() => {
        await request(app).get('/health').expect(200, "")
    })
})