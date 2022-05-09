import { AppContextService as SharedAppContextService } from '@fm/shared/providers/app-context';
import { Observable } from 'rxjs';
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
