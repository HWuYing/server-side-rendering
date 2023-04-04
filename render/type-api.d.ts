import { Request } from 'express';
export type Fetch = (url: RequestInfo | URL, init: RequestInit) => Promise<Response>;
export interface ResourceInterface {
    getMicroPath(microName: string, pathname: string): string;
    proxyFetch(url: string, init?: RequestInit): Promise<any>;
    readStaticFile(url: string): {
        type: string;
        source: any;
    };
}
export interface RenderInterface {
    render(request: Request): Promise<{
        html: string;
        status: any;
        redirectUrl: any;
    }>;
    renderMicro(request: Request): Promise<{
        status: any;
        redirectUrl: any;
        html: any;
        styles: any;
        links: any;
        microTags: any;
        microFetchData: any;
    }>;
}
export interface ResourceOptions {
    proxyHost: string;
    microName: string;
    readonly fetch: Fetch;
    readonly innerHeadFlag: string;
    readonly innerHtmlFlag: string;
    vmContext?: {
        [key: string]: any;
    };
    getIndexPath(): string;
    getEntryPath(): string;
    getManifestFilePath(): string;
    getStaticPath(url: string): string;
    getMicroPath(microName: string, pathname: string): string;
}
