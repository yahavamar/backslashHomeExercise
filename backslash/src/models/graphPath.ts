import { Link } from "./link";

export class GraphPath {
    public source: string;
    public dest: string;
    segments: Link[];

    constructor(source: string, dest: string, segments?: Link[]) {
        this.source = source;
        this.dest = dest;
        this.segments = segments || [];
    }
}