jest.mock("../../helpers/configcat", () => ({
    getValueAsync: jest.fn()
}))
const request = require('supertest');
const app = require('../../server')();
const configcatMock = require("../../helpers/configcat");

describe("health route", () => {
    let server
    afterAll(async () => {
        server = app.listen(3000)
    })
    afterAll(async () => {
        server.close()
    })
    
    it("should return 200 in the root path if the toggle is off", async() => {
        configcatMock.getValueAsync.mockReturnValue(false)
        await request(app).get('/health').expect(200, "")
    })
    
    it("should return 200 with a json body in the root path if the toggle is on", async() => {
        configcatMock.getValueAsync.mockReturnValue(true)
        await request(app).get('/health').expect(200, { general: true })
    })
})