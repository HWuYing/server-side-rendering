import { LocatorStorage } from '@fm/di';
import { Observable, Subject } from '@fm/import-rxjs';
import { HttpClient } from '@fm/shared/common/http';
import { MicroManageInterface } from '@fm/shared/micro';
export declare class MicroManage implements MicroManageInterface {
    private http;
    private ls;
    sharedData: any;
    private proxy;
    private microCache;
    private microStaticCache;
    private appContext;
    loaderStyleSubject?: Subject<HTMLStyleElement> | undefined;
    constructor(http: HttpClient, ls: LocatorStorage);
    bootstrapMicro(microName: string): Observable<any>;
    private reeadLinkToStyles;
    private getLinkCache;
    private createMicroTag;
}
