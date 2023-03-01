jest.mock("../../repository/clients", () => ({
    getAllClients: jest.fn(),
    addClients: jest.fn(),
}))
const request = require('supertest');
const app = require('../../server')();
const { faker } = require('@faker-js/faker');
const mockClientRepository = require("../../repository/clients")

describe("users route", () => {
    let server
    beforeAll(async () => {
        server = app.listen(3000)
    })
    afterAll(async () => {
        server.close()
    })
    beforeEach(() => {
        mockClientRepository.getAllClients.mockClear()
        mockClientRepository.addClients.mockClear()
    })
    
    it("should return 200 in the root path with a list of users", async() => {
        mockClientRepository.getAllClients.mockReturnValue([{"IsTest": 0, "UserName": "1", "data": "222"}])
        await request(app).get('/users').expect(200, {users: [{"IsTest": 0, "UserName": "1", "data": "222"}]})
    })

    it("allows to add non test users that we can recover", async() => {
        const name = faker.random.word()
        mockClientRepository.getAllClients.mockReturnValue([{"IsTest": 0, "UserName": name}])
        await request(app)
        .post('/users')
        .send({ name })
        .set('Accept', 'application/json')
        .expect(201)
        expect(mockClientRepository.addClients).toHaveBeenCalledWith(name, false)
        await request(app)
        .get('/users')
        .expect(200, {users: [{"IsTest": 0, "UserName": name}]})
    })


    it("allows to add non test users that we can recover", async() => {
        const name = faker.random.word()
        mockClientRepository.getAllClients.mockReturnValue([{"IsTest": 0, "UserName": name}])
        await request(app)
        .post('/users')
        .send({ name })
        .set('Accept', 'application/json')
        .set('X-Test', false)
        .expect(201)
        expect(mockClientRepository.addClients).toHaveBeenCalledWith(name, false)
        await request(app)
        .get('/users')
        .expect(200, {users: [{"IsTest": 0, "UserName": name}]})
    })

    it("allows to add test users that we can recover", async() => {
        const name = faker.random.word()
        mockClientRepository.getAllClients.mockReturnValue([{"IsTest": 1, "UserName": name}])
        await request(app)
        .post('/users')
        .send({ name })
        .set('Accept', 'application/json')
        .set('X-Test', true)
        .expect(201)
        expect(mockClientRepository.addClients).toHaveBeenCalledWith(name, true)
        await request(app)
        .get('/users')
        .expect(200, {users: [{"IsTest": 1, "UserName": name}]})
    })
    
})