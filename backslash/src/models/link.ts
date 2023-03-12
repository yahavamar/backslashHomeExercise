import { Node } from "./interfaces/node.interface";

export class Link {
    source: Node;
    dest: Node;

    constructor(source: Node, dest: Node){
        this.source = source;
        this.dest = dest;
    }
}