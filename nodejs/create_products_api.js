const AWS = require('aws-sdk');

// Configure AWS SDK with your credentials and region
AWS.config.update({
  region: 'us-east-1',
});

// Create an API Gateway instance
const apiGateway = new AWS.APIGateway();

(async () => {
  try {
    const service = '<FMI>';

    // Create a REST API named 'ProductsApi'
    const createRestApiResponse = await apiGateway.createRestApi({
      name: 'ProductsApi',
      description: 'API to get all the food products.',
      minimumCompressionSize: 123,
      endpointConfiguration: {
        types: ['REGIONAL'],
      },
    }).promise();

    const apiId = createRestApiResponse.id;

    // Get resources and find the root resource ID
    const getResourcesResponse = await apiGateway.getResources({ restApiId: apiId }).promise();
    const rootResource = getResourcesResponse.items.find(resource => resource.path === '/');
    const rootResourceId = rootResource.id;

    // Create a resource named 'products'
    const createResourceResponse = await apiGateway.createResource({
      restApiId: apiId,
      parentId: rootResourceId,
      pathPart: 'products',
    }).promise();

    const productsResourceId = createResourceResponse.id;

    // Create a GET method for the 'products' resource
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
            {
              product_name_str: 'chocolate cake slice',
              product_id_str: 'a445',
              price_in_cents_int: 595,
              description_str: 'chocolate heaven',
              tag_str_arr: ['cake slice', 'on offer'],
            },
            {
              product_name_str: 'chocolate cake',
              product_id_str: 'a446',
              price_in_cents_int: 4095,
              description_str: 'chocolate heaven',
              tag_str_arr: ['whole cake', 'on offer'],
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
