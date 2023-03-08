import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import graphManager from './managers/graph.manager'
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger/swagger';
import routes from './routers/routes';
import * as path from 'path';
import { GraphData } from './models/interfaces/graph-data.interface';

const dataFile = path.resolve('./src/data/train-ticket-be.json');

const app = express();
const port = 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const jsonData = fs.readFileSync(dataFile, 'utf-8');
const data: GraphData = JSON.parse(jsonData);

// fix edges data 
const edges2 = data.edges.map((edge) => {
  if (Array.isArray(edge.to)) {
    return edge;
  } else {
    return {
      from: edge.from,
      to: [edge.to],
    };
  }
});

async function buildGraph() {
  try {
    await graphManager.deleteGraph();
    await graphManager.createNodes(data.nodes);
    await graphManager.createEdges(edges2);
  } catch (error) {
    console.error(error);
  }
}

buildGraph();

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
