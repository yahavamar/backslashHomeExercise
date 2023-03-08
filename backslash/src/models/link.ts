import { NodeI } from "./interfaces/node.interface";

export class Link {
    source: NodeI;
    dest: NodeI;

    constructor(source: NodeI, dest: NodeI){
        this.source = source;
        this.dest = dest;
    }
}