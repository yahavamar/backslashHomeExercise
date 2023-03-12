import neo4j, { Driver, Session } from 'neo4j-driver';
import { Edge } from '../models/interfaces/edge.interface';
import { Node } from '../models/interfaces/node.interface';
import {GraphPath} from '../models/graphPath'
import { Link } from '../models/link';

class GraphManager {
    private static instance: GraphManager;
    private readonly driver: Driver;
    
    private constructor() {
        // Create a new Neo4j driver instance
        // A better approach would be to store these sensitive information in a configuration file
        // For the purpose of the task I left it hardcoded
        this.driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'newpassword'));
    }

    public static getInstance(): GraphManager {
        // Create a new instance of GraphManager if one does not already exist
        if (!GraphManager.instance) {
        GraphManager.instance = new GraphManager();
        }
        return GraphManager.instance;
    }

    /**
    * Executes a Neo4j query using the current instance's driver and returns the results as an array of objects.
    * @param query - The query to execute in Neo4j.
    * @param params - An optional parameter object to pass into the query. Defaults to an empty object if not provided.
    * @returns A promise that resolves with an array of objects representing the query results.
    */
    public async runQuery(query: string, params?: Record<string, any>): Promise<any> {
        const session: Session = this.driver.session();
        try {
            const result = await session.run(query, params ? params: {});
            return result.records.map((record) => record.toObject());
        } finally {
            session.close();
        }
    }
  
    public async createNodes(nodes: Node[]): Promise<void> {
        const session = this.driver.session();

        for (const node of nodes) {
            const query = `
            CALL apoc.create.node(['Node'], {
            name: $name,
            kind: $kind,
            language: $language,
            path: $path,
            publicExposed: $publicExposed,
            vulnerabilities: apoc.convert.toJson($vulnerabilities),
            metadata: apoc.convert.toJson($metadata)
        })
        YIELD node
        RETURN node
        `;
        
            const params = {
                name: node.name,
                kind: node.kind,
                language: node.language ?? null,
                path: node.path ?? null,
                publicExposed: node.publicExposed ?? null,
                vulnerabilities: node.vulnerabilities ?? null,
                metadata: node.metadata ?? null,
            };
    
            await this.runQuery(query, params);
        }
  
       await session.close();
    }
  
    public async createEdges(edges: Edge[]): Promise<void> {
        const session = this.driver.session();
    
        for (const edge of edges) {
            const query = `
            MATCH (from:Node {name: $from})
            UNWIND $to AS toName
            MATCH (to:Node {name: toName})
            CREATE (from)-[:connectedTo]->(to)
            `;
      
            for (const dest of edge.targets) {
                const params = {
                    from: edge.source,
                    to: dest,
                };
            
                await this.runQuery(query, params);
            }
        }
    }

    public async getAllRoutesEndsInSinkOfKind(params: string[]): Promise<GraphPath[]> {
        const session = this.driver.session();
        const paths: GraphPath[] = [];
        
        const query = `
        MATCH p=(root)-[*0..]->(m:Node {kind: $kind})
        WHERE NOT ()-->(root)
        RETURN p;
        `;
        
        for (const param of params){
            const records = await this.runQuery(query, {kind: param});
            paths.push(...GraphManager.createGraphPathsFromRecords(records));
        }
        
        await session.close();
      
        return paths;
    }

    public async getAllRoutesContainsVulnerabilities(): Promise<GraphPath[]> {
        const session = this.driver.session();
        
        // Get names of all vulnerability nodes in the graph
        const vulnerabilitiesNodes: string[] = await this.getAllVulnerabilitiesNodesNames();
        const paths: GraphPath[] = [];
        
        // Find all paths to and from each vulnerability node, and merge them into a single path
        for (let name of vulnerabilitiesNodes){
            const pathsToDest = GraphManager.createGraphPathsFromRecords(await this.getAllPathsToDestNode({name: name}));
            const pathsFromSource = GraphManager.createGraphPathsFromRecords(await this.getAllPathsFromSourceNode({name: name}));

            for (const pathToNode of pathsToDest) {
                for (const pathFromNode of pathsFromSource) {
                    const source: string = pathToNode.source;
                    const dest: string = pathFromNode.dest;
                    const links: Link[] = [...pathToNode.segments, ...pathFromNode.segments];
                    paths.push(new GraphPath(source, dest, links));
                }
            }
        }
        await session.close();

        return paths;
    }

    public async getAllVulnerabilitiesNodesNames(): Promise<string[]>{
        const session = this.driver.session();
        const query = `
        MATCH (n)
        WHERE n.vulnerabilities <> "null"
        RETURN n
        `;

        const records = await this.runQuery(query);
      
        const names: string[] = GraphManager.createNameListOfNodes(records);
      
        await session.close();

        return names;
      
    }

    public async getAllPathsFromPublicExposedToSink(publicExposed: boolean, kindList: string[]): Promise<GraphPath[]> {
        // Retrieve the names of all nodes of the given kinds
        const targetNodes: string[] = await this.getAllNodesNamesOfKind(kindList);
        const session = this.driver.session();
        const paths: GraphPath[] = [];
        const query = `
        MATCH p=(:Node {publicExposed: $publicExposed})-[*]->(end_node:Node {name: $name})
        WHERE end_node.name = $name
        RETURN p
        `;
        
        // For each sink node, find all paths from any public exposed node to it
        for (const name of targetNodes) {
            const params = {
                publicExposed: publicExposed,
                name: name,
            };
            const records = await this.runQuery(query, params);
            paths.push(...GraphManager.createGraphPathsFromRecords(records));
        }

        await session.close();

        return paths;
    }
    
    public async getAllPathsToDestNode(params: Record<string, any>): Promise<any[]>{
        const session = this.driver.session();
        const query = `
        MATCH p=(root)-[*0..]->(m:Node {name: $name})
        WHERE NOT ()-->(root)
        RETURN p;
        `;
        
        const records = await this.runQuery(query, params);
      
        await session.close();

        return records;
    }

    public async getAllPathsFromSourceNode(params: Record<string, any>): Promise<any[]> {
        const session = this.driver.session();
        const query = `
        MATCH p=(m:Node {name: $name})-[*0..]->(root)
        WHERE NOT (root)-->()
        RETURN p;
        `;

        const records = await this.runQuery(query, params);
      
        await session.close();

        return records;
    }

    public async getAllNodesNamesOfKind(kinds: string[]): Promise<string[]>{
        const names: string[] = [];
        const session = this.driver.session();
        
        const query = `
        MATCH (n:Node {kind: $kind})
        RETURN n
        `;

        for (const kind of kinds) {
            
            const records = await this.runQuery(query, {kind: kind});
            names.push(... GraphManager.createNameListOfNodes(records));
        }

        await session.close();

        return names;
    }

    public async deleteGraph(): Promise<void>{
        const session = this.driver.session();
        const query = `MATCH (n) DETACH DELETE n`;
        await this.runQuery(query);
    }
      
    public static createGraphPathsFromRecords(records: any[]): GraphPath[] {
        return records.map((record) => {
          const source: string = record.p.start.properties.name;
          const dest: string = record.p.end.properties.name;
          const links: Link[] = record.p.segments.map((segment) => {
            const sourceNode: Node = {...segment.start.properties};
            const destNode: Node = {...segment.end.properties};
            return new Link(sourceNode, destNode);
          });
          return new GraphPath(source, dest, links);
        });
      }
    
    public static createNameListOfNodes(records: any[]): string[] {
        return records.map((record) => {
            return record.n.properties.name;
        });
    }
    
    public close(): void {
        this.driver.close();
    }
}


export default GraphManager.getInstance();
