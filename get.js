import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  console.log('__event__', event);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId, // The id of the author
      noteId: event.pathParameters.id, // The id of the note from the path
    },
  };
  // Keep in mind that the userId above is the Federated Identity id (or Identity Pool user id). This is not the user id that is assigned in our User Pool
  const result = await dynamoDb.get(params);
  if (!result.Item) {
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return result.Item;
});
