import { RequestInit } from 'node-fetch';
export type ProxyMicroUrl = (microName: string, pathname: string) => string;
export declare abstract class ResourceInterface {
    readonly innerHeadFlag: string;
    readonly innerHtmlFlag: string;
    readonly isDevelopment: boolean;
    abstract generateHtmlTemplate(): string;
    abstract generateMicroStaticpath(url: string): string;
    abstract generateMicroPath(microName: string, pathname: string): string;
    abstract proxyFetch(url: string, init?: RequestInit): Promise<any>;
    abstract readAssetsSync(): {
        [key: string]: any;
    };
    abstract readStaticFile(url: string): {
        type: string;
        source: any;
    };
}
export interface ResourceOptions {
    index?: string;
    staticDir?: string;
    proxyTarget?: string;
    manifestFile: string;
    microPrePath?: string;
}
export interface SSROptions {
    microName?: string;
    resource: ResourceInterface;
    vmContext?: {
        [key: string]: any;
    };
}
