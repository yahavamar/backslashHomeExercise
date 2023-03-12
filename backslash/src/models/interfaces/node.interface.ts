import { Metadata } from './metadata.interface';
import { Vulnerability } from './vulnerability.interface';

export interface Node{
    name: string;
    kind: string; 
    language?: string;
    path?: string;
    publicExposed?: boolean;
    vulnerabilities?: Vulnerability[];
    metadata?: Metadata

}