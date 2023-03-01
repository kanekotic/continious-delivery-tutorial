const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
let dbclient = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const initialize = (client) => {
    dbclient = client
}
const getAllClients = async (isTest) => {
    const params = {
        TableName: 'lambda_db',
        FilterExpression: "IsTest = :IsTest",
        ExpressionAttributeValues: {
            ":IsTest": isTest ? 1 : 0
        }
    }

    return (await dbclient.scan(params).promise()).Items
}

module.exports = {
    initialize,
    getAllClients
}