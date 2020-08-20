import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.tableName,
        // Partition and sort key
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            recipeId: event.pathParameters.id
        },
        // Define what should be updated
        UpdateExpression: "SET directions = :directions, ingredients = :ingredients, #recipeName = :name",
        ExpressionAttributeValues: {
            ":directions": data.directions || null,
            ":ingredients": data.ingredients || null,
            ":name": data.name || null
        },
        ExpressionAttributeNames: {
            "#recipeName": "name"
        },
        ReturnValues: "ALL_NEW"
    };

    await dynamoDb.update(params);
    return {status: true};
});