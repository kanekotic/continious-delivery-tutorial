jest.mock("../../helpers/toggles", () => ({
    isActive: jest.fn()
}))
const request = require('supertest');
const app = require('../../server')();
const togglesMock = require("../../helpers/toggles");

describe("health route", () => {
    let server
    beforeAll(async () => {
        server = app.listen(3000)
    })
    afterAll(async () => {
        server.close()
    })
    
    it("should return 200 in the root path if the toggle is off", async() => {
        togglesMock.isActive.mockReturnValue(false)
        await request(app).get('/health').expect(200, "")
    })
    
    it("should return 200 with a json body in the root path if the toggle is on", async() => {
        togglesMock.isActive.mockReturnValue(true)
        await request(app).get('/health').expect(200, { general: true })
    })
})