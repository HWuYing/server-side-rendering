import { Observable } from '@fm/import-rxjs';
import { AppContextService as SharedAppContextService } from '@fm/shared/providers/app-context';
declare type MicroMiddleware = () => Observable<any>;
export declare class AppContextService extends SharedAppContextService {
    private pageFileSource;
    private microMiddlewareList;
    readStaticFile(url: string): Observable<any>;
    registryMicroMidder(middleware: MicroMiddleware): void;
    getPageFileSource(): string;
    getAllFileSource(): string;
    getpageMicroMiddleware(): MicroMiddleware[];
}
export {};
