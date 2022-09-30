import { RequestInit } from 'node-fetch';
import { ResourceInterface, ResourceOptions } from './type-api';
export declare class Resource implements ResourceInterface {
    private options;
    private host;
    private manifestFile;
    private microPrePath;
    private staticDir;
    private cache;
    private isDevelopment;
    constructor(options: ResourceOptions);
    generateMicroPath(microName: string, pathname: string): string;
    generateMicroStaticpath(url: string): string;
    generateHtmlTemplate(): string;
    proxyFetch(url: string, init?: RequestInit): Promise<import("node-fetch").Response>;
    readAssetsSync(): any;
    serializableAssets(): any;
    readStaticFile(url: string): {
        type: string;
        source: any;
    };
    get innerHeadFlag(): string;
    get innerHtmlFlag(): string;
}
