const {GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLBoolean } = require('graphql');

const GraphPathType = new GraphQLObjectType({
  name: 'GraphPath',
  description: 'A path between two nodes in a graph',
  fields: () => ({
    source: { type: GraphQLNonNull(GraphQLString), description: 'Source node of the path' },
    dest: { type: GraphQLNonNull(GraphQLString), description: 'Destination node of the path' },
    segments: { type: GraphQLList(LinkType), description: 'Segments of the path' }
  })
});

const LinkType = new GraphQLObjectType({
  name: 'Link',
  description: 'A link between two nodes in a graph',
  fields: () => ({
    source: { type: GraphQLNonNull(NodeIType), description: 'Source node of the link' },
    dest: { type: GraphQLNonNull(NodeIType), description: 'Destination node of the link' }
  })
});

const NodeIType = new GraphQLObjectType({
  name: 'NodeI',
  description: 'An item in a graph',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString), description: 'Name of the node' },
    kind: { type: GraphQLNonNull(GraphQLString), description: 'Kind of the node' },
    language: { type: GraphQLString, description: 'Language of the node' },
    path: { type: GraphQLString, description: 'Path of the node' },
    publicExposed: { type: GraphQLBoolean, description: 'Whether the node is publicly exposed' },
    vulnerabilities: { type: VulnerabilityIType, description: 'Vulnerabilities of the node' },
    metadata: { type: MetadataIType, description: 'Metadata of the node' }
  })
});

const VulnerabilityIType = new GraphQLObjectType({
  name: 'VulnerabilityI',
  description: 'A vulnerability in a node',
  fields: () => ({
    file: { type: GraphQLNonNull(GraphQLString), description: 'File with vulnerability' },
    severity: { type: GraphQLNonNull(GraphQLString), description: 'Severity of the vulnerability' },
    message: { type: GraphQLNonNull(GraphQLString), description: 'Description of the vulnerability' },
    metadata: { type: GraphQLNonNull(MetadataIType), description: 'Metadata of the vulnerability' }
  })
});

const MetadataIType = new GraphQLObjectType({
  name: 'MetadataI',
  description: 'Metadata of a node or vulnerability',
  fields: () => ({
    cwe: { type: GraphQLString, description: 'CWE of the metadata' },
    cloud: { type: GraphQLString, description: 'Cloud of the metadata' },
    engine: { type: GraphQLString, description: 'Engine of the metadata' },
    version: { type: GraphQLString, description: 'Version of the metadata' }
  })
});

export default GraphPathType;