const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
import * as path from 'path';

const yamlFilePath = path.resolve('swagger.yaml');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Home Exercise - Backslash',
    version: '1.0.0',
    description: '',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [yamlFilePath],
};

export const swaggerSpec = swaggerJSDoc(options);
