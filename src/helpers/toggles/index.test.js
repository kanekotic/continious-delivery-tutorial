jest.mock('../configcat', () => ({
    getValueAsync: jest.fn()
}))
const toggles = require('./')
const configcatMock = require('../configcat')
const { faker } = require('@faker-js/faker');

describe("toggles", () => {
    it("should call configcat with email if user is on the header", async () => {
        const toggleName = faker.random.word()
        const user = faker.internet.email()
        configcatMock.getValueAsync.mockReturnValue(true)
        const result = await toggles.isActive(toggleName, { user })
        expect(configcatMock.getValueAsync).toHaveBeenCalledWith(toggleName, false, {email: user})
        expect(result).toEqual(true)
    })
})