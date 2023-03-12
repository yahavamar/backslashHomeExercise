import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import graphManager from './managers/graph.manager'
import * as path from 'path';
import { GraphData } from './models/interfaces/graph-data.interface';
import RootQueryType from './models/schemas/root-query';

const dataFile = path.resolve('./src/data/train-ticket-be.json');

const { GraphQLSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');     

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const jsonData = fs.readFileSync(dataFile, 'utf-8');
const data: GraphData = JSON.parse(jsonData);

// fix edges data where is not list
const fixedEdgesData = data.edges.map((edge) => {
  if (Array.isArray(edge.targets)) {
    return edge;
  } else {
    return {
      source: edge.source,
      targets: [edge.targets],
    };
  }
});

async function buildGraph() {
  try {
    await graphManager.deleteGraph();
    await graphManager.createNodes(data.nodes);
    await graphManager.createEdges(fixedEdgesData);
  } catch (error) {
    console.error(error);
  }
}

buildGraph();

const schema = new GraphQLSchema({
  query: RootQueryType
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
