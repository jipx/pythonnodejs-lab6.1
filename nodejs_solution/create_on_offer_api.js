const AWS = require('aws-sdk');

// Configure AWS SDK with your credentials and region
AWS.config.update({
   region: 'us-east-1',
});


// Create an API Gateway instance
const apiGateway = new AWS.APIGateway();

(async () => {
  try {
    const apiId = '4gqyc7oasi';
    const parentId = 'eblk1lr309';

    // Create a resource named 'on_offer'
    const createResourceResponse = await apiGateway.createResource({
      restApiId: apiId,
      parentId: parentId,
      pathPart: 'on_offer',
    }).promise();

    const productsResourceId = createResourceResponse.id;

    // Create a GET method for the 'on_offer' resource
    await apiGateway.putMethod({
      restApiId: apiId,
      resourceId: productsResourceId,
      httpMethod: 'GET',
      authorizationType: 'NONE',
    }).promise();

    // Configure method response
    await apiGateway.putMethodResponse({
      restApiId: apiId,
      resourceId: productsResourceId,
      httpMethod: 'GET',
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Origin': true,
        'method.response.header.Access-Control-Allow-Methods': true,
      },
      responseModels: {
        'application/json': 'Empty',
      },
    }).promise();

    // Configure integration
    await apiGateway.putIntegration({
      restApiId: apiId,
      resourceId: productsResourceId,
      httpMethod: 'GET',
      type: 'MOCK',
      requestTemplates: {
        'application/json': '{"statusCode": 200}',
      },
    }).promise();

    // Configure integration response
    await apiGateway.putIntegrationResponse({
      restApiId: apiId,
      resourceId: productsResourceId,
      httpMethod: 'GET',
      statusCode: '200',
      responseTemplates: {
        'application/json': JSON.stringify({
          product_item_arr: [
            {
              product_name_str: 'apple pie slice',
              product_id_str: 'a444',
              price_in_cents_int: 595,
              description_str: 'amazing taste',
              tag_str_arr: ['pie slice', 'on offer'],
              special_int: 1,
            },
          ],
        }),
      },
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
        'method.response.header.Access-Control-Allow-Methods': "'GET'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
      },
    }).promise();

    console.log('DONE');
  } catch (error) {
    console.error('Error:', error);
  }
})();

