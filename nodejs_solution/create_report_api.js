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

    // Get resources and find the root resource ID
    const getResourcesResponse = await apiGateway.getResources({ restApiId: apiId }).promise();
    const rootResource = getResourcesResponse.items.find(resource => resource.path === '/');
    const rootResourceId = rootResource.id;

    // Create a resource named 'create_report'
    const createResourceResponse = await apiGateway.createResource({
      restApiId: apiId,
      parentId: rootResourceId,
      pathPart: 'create_report',
    }).promise();

    const reportResourceId = createResourceResponse.id;

    // Create a POST method for the 'create_report' resource
    await apiGateway.putMethod({
      restApiId: apiId,
      resourceId: reportResourceId,
      httpMethod: 'POST',
      authorizationType: 'NONE',
    }).promise();

    // Configure method response
    await apiGateway.putMethodResponse({
      restApiId: apiId,
      resourceId: reportResourceId,
      httpMethod: 'POST',
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': false,
        'method.response.header.Access-Control-Allow-Origin': false,
        'method.response.header.Access-Control-Allow-Methods': false,
      },
      responseModels: {
        'application/json': 'Empty',
      },
    }).promise();

    // Configure integration
    await apiGateway.putIntegration({
      restApiId: apiId,
      resourceId: reportResourceId,
      httpMethod: 'POST',
      type: 'MOCK',
      requestTemplates: {
        'application/json': '{"statusCode": 200}',
      },
    }).promise();

    // Configure integration response
    await apiGateway.putIntegrationResponse({
      restApiId: apiId,
      resourceId: reportResourceId,
      httpMethod: 'POST',
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
        'method.response.header.Access-Control-Allow-Methods': '\'POST\'',
        'method.response.header.Access-Control-Allow-Origin': '\'*\'',
      },
      responseTemplates: {
        'application/json': JSON.stringify({
          msg_str: 'report requested, check your phone shortly',
        }),
      },
    }).promise();

    console.log('DONE');
  } catch (error) {
    console.error('Error:', error);
  }
})();
