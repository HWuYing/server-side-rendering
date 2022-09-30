import { RequestInit } from 'node-fetch';
export declare type ProxyMicroUrl = (microName: string, pathname: string) => string;
export declare abstract class ResourceInterface {
    readonly innerHeadFlag: string;
    readonly innerHtmlFlag: string;
    abstract generateHtmlTemplate(): string;
    abstract generateMicroStaticpath(url: string): string;
    abstract generateMicroPath(microName: string, pathname: string): string;
    abstract proxyFetch(url: string, init?: RequestInit): Promise<any>;
    abstract readAssetsSync(): {
        [key: string]: any;
    };
    abstract serializableAssets(): {
        js: [];
        css: [];
    };
    abstract readStaticFile(url: string): {
        type: string;
        source: any;
    };
}
export interface ResourceOptions {
    proxyTarget?: string;
    manifestFile: string;
    microPrePath?: string;
    staticDir?: string;
}
export interface SSROptions {
    microName?: string;
    proxyTarget?: string;
    vmContext?: {
        [key: string]: any;
    };
    resource: ResourceInterface;
}
