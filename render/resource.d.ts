import { RequestInit } from 'node-fetch';
import { ResourceInterface, ResourceOptions } from './type-api';
export declare class Resource implements ResourceInterface {
    private host;
    private index;
    private staticDir;
    private manifestFile;
    private microPrePath;
    private assetsConfig;
    private htmlTemplate;
    private cache;
    private _isDevelopment;
    constructor({ index, microPrePath, manifestFile, staticDir, proxyTarget }: ResourceOptions);
    generateMicroPath(microName: string, pathname: string): string;
    generateMicroStaticpath(url: string): string;
    generateHtmlTemplate(): string;
    proxyFetch(url: string, init?: RequestInit): Promise<import("node-fetch").Response>;
    readAssetsSync(): any;
    readStaticFile(url: string): any;
    get isDevelopment(): boolean;
    get innerHeadFlag(): string;
    get innerHtmlFlag(): string;
}
