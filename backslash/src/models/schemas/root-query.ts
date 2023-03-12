import { GraphQLList, GraphQLObjectType } from "graphql";
import graphManager from "../../managers/graph.manager";
import GraphPathType from "./graph-path-schema";

const sinkKind: string[] = ['rds', 'sqs'];
const isPublicExposed: boolean = true;

const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => ({
      returnAllRoutesEndsInSink: {
        type: GraphQLList(GraphPathType),
        description: 'Returns all graph paths',
        resolve: async () => {
          const paths = await graphManager.getAllRoutesEndsInSinkOfKind(sinkKind);
          return paths.map(mapPathToGraphPath);
        }
      },
      returnRoutesContainsVulnerabilities: {
        type: GraphQLList(GraphPathType),
        description: 'Returns all graph paths',
        resolve: async () => {
          const paths = await graphManager.getAllRoutesContainsVulnerabilities();
          return paths.map(mapPathToGraphPath);
        }
      },
      returnAllPathsFromPublicExposedToSink: {
        type: GraphQLList(GraphPathType),
        description: 'Returns all graph paths',
        resolve: async () => {
          const paths = await graphManager.getAllPathsFromPublicExposedToSink(isPublicExposed, sinkKind);
          return paths.map(mapPathToGraphPath);
        }
      }
    })
  });
  
  function mapPathToGraphPath(path: any) {
    return {
      source: path.source,
      dest: path.dest,
      segments: path.segments.map(mapSegmentToGraphSegment)
    };
  }
  
  function mapSegmentToGraphSegment(segment: any) {
    return {
      source: segment.source,
      dest: segment.dest
    };
  }

export default RootQueryType;