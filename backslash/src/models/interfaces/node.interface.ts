import { MetadataI } from './metadata.interface';
import { VulnerabilityI } from './vulnerability.interface';

export interface NodeI{
    name: string;
    kind: string; 
    language?: string;
    path?: string;
    publicExposed?: boolean;
    vulnerabilities?: VulnerabilityI[];
    metadata?: MetadataI

}