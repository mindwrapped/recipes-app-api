import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
    // Get the data from the request body
    const data = JSON.parse(event.body);

    const params = {
        TableName: process.env.tableName,
        // 'Item' contains the attributes of the item to be created
        // - 'userId': user identities are federated through the
        //             Cognito Identity Pool, we will use the identity id
        //             as the user id of the authenticated user
        // - 'recipeId': a unique uuid
        // - 'name': parsed from request body
        // - 'ingredients': parsed from request body
        // - 'directions': parsed from request body
        // - 'createdAt': current Unix timestamp
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            recipeId: uuid.v1(),
            name: data.name,
            ingredients: data.ingredients,
            directions: data.directions,
            createdAt: Date.now()
        }
    };

    await dynamoDb.put(params);
    return params.Item;
});