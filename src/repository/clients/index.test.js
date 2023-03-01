const clients = require("./")
const { DynamoDBContainer } = require("testcontainers-dynamodb/dist")

const expectTestItem = {"IsTest": 1, "UserName": "2", "data": "abc"}
const expectNonTestItem = {"IsTest": 0, "UserName": "1", "data": "222"}
const expectedItems = [expectTestItem, expectNonTestItem]
const initDataTest = [
    {
        table: {
            TableName: 'lambda_db',
            AttributeDefinitions: [
                {
                  AttributeName: 'UserName',
                  AttributeType: 'S',
                },
                {
                  AttributeName: 'IsTest',
                  AttributeType: 'N',
                },
              ],
              KeySchema: [
                {
                  AttributeName: 'UserName',
                  KeyType: 'HASH',
                },
                {
                  AttributeName: 'IsTest',
                  KeyType: 'RANGE',
                },
              ],

            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        },
        items: expectedItems
    }
]

describe("clients", () => {
    jest.setTimeout(120000)
    
    let startedContainer
    let dynamoDocumentClient
    beforeAll(async() => {
        startedContainer = await new DynamoDBContainer().start()
        dynamoDocumentClient = startedContainer.createDocumentClient()
        clients.initialize(dynamoDocumentClient)
    })

    beforeEach(async() => {
        await startedContainer.resetData(initDataTest)
    })

    afterAll (async () => {
        await startedContainer.stop()
    })

    describe("getClients", () => {
        it('should return all exisitng non test clients when test parameter is empty', async() => {
            await startedContainer.resetData(initDataTest)
            expect(await clients.getAllClients()).toEqual([expectNonTestItem])
        })
        it('should return all exisitng non test clients when test parameter is false', async() => {
            await startedContainer.resetData(initDataTest)
            expect(await clients.getAllClients(false)).toEqual([expectNonTestItem])
        })
        it('should return all exisitng non test clients when test parameter is true', async() => {
            await startedContainer.resetData(initDataTest)
            expect(await clients.getAllClients(true)).toEqual([expectTestItem])
        })
    })

})