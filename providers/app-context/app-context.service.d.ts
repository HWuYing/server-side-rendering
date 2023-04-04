import { AppContextService as SharedAppContextService } from '@fm/core';
import { Fetch } from '@fm/core/common/http';
import { Injector } from '@fm/di';
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
    registryMicroMidder(middleware: MicroMiddleware): void;
    getPageFileSource(): string;
    getAllFileSource(): string;
    getpageMicroMiddleware(): MicroMiddleware[];
    get fetch(): Fetch;
}
export {};
