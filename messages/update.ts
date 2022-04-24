import { Handler, APIGatewayEvent, Context } from 'aws-lambda'
import { dynamoDb } from '../util/dynamoHelper'
import { errorResponse, successResponse } from '../util/responseHelper';

export const update: Handler = async (event: APIGatewayEvent, context: Context) => {
  const timestamp = new Date().getTime();
  if (!event.body) return errorResponse(400, `Body is required`)
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.text !== 'string' || typeof data.isDeleted !== 'boolean') {
    console.error('Validation Failed');
    return errorResponse(400, `Couldn't update the message item`)
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Key: {
      id: event.pathParameters!.id,
    },
    ExpressionAttributeNames: {
      '#message_text': 'text',
    },
    ExpressionAttributeValues: {
      ':text': data.text,
      ':isDeleted': data.isDeleted,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #message_text = :text, isDeleted = :isDeleted, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the message in the database
  try {
    const res = await dynamoDb.update(params).promise()
    return successResponse(res.Attributes)
  } catch (error) {
    return errorResponse(error.statusCode || 501, `Couldn't fetch the message item`)
  }
};