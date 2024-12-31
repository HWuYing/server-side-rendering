import { InjectorToken } from '@hwy-fm/di';
import { Fetch, ResourceInterface } from './type-api';
export declare const PUBLIC_PATH = "static";
export declare const MICRO_RENDER_PATH = "micro-ssr";
export declare const SSR_FETCH: InjectorToken;
export declare const SSR_STATIC_FOLDER: InjectorToken;
export declare class Resource implements ResourceInterface {
    config: Record<string, any>;
    ssrFetch: Fetch;
    staticFolder: string;
    private assetsConfig;
    private htmlTemplate;
    private filesCache;
    isDevelopment: boolean;
    protected staticResolve(_path: string, ...other: string[]): string;
    protected readFileSync(filePath?: string): string;
    protected fetch(url: RequestInfo | URL, init: RequestInit): Promise<Response>;
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
    get innerHeadFlag(): any;
    get innerHtmlFlag(): any;
}
