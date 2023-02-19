import { Injector } from '@fm/di';
import { AppContextService as SharedAppContextService } from '@fm/shared';
import { Fetch } from '@fm/shared/common/http';
import { Observable } from 'rxjs';
declare type MicroMiddleware = () => Observable<any>;
export declare class AppContextService extends SharedAppContextService {
    private resource;
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
