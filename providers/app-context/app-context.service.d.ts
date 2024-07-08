import { AppContextService as SharedAppContextService } from '@hwy-fm/core';
import type { Fetch } from '@hwy-fm/core/common/http';
import { Injector } from '@hwy-fm/di';
import { Observable } from 'rxjs';
type MicroMiddleware = () => Observable<any>;
export declare class AppContextService extends SharedAppContextService {
    private resource;
    request: any;
    private pageFileSource;
    private microMiddlewareList;
    constructor(injector: Injector);
    private setPageSource;
    private cacheToArray;
    private proxyFetch;
    readStaticFile(url: string): any;
    registryMicroMiddler(middleware: MicroMiddleware): void;
    getPageFileSource(): string;
    getAllFileSource(): string;
    getPageMicroMiddleware(): MicroMiddleware[];
    get fetch(): Fetch;
}
export {};
