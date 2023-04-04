import { ResourceInterface, ResourceOptions } from './type-api';
export declare class Resource implements ResourceInterface {
    private options;
    private assetsConfig;
    private htmlTemplate;
    private filesCache;
    isDevelopment: boolean;
    constructor(options: ResourceOptions);
    getMicroPath(microName: string, pathname: string): string;
    generateHtmlTemplate(): string;
    proxyFetch(req: RequestInfo | string, init?: RequestInit): Promise<Response>;
    readAssetsSync(): any;
    readStaticFile(url: string): any;
    get vmContext(): {
        [key: string]: any;
    };
    get entryFile(): string;
    get microName(): string;
    get innerHeadFlag(): string;
    get innerHtmlFlag(): string;
}
