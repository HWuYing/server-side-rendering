import { Injector } from '@fm/di';
import { HttpClient } from '@fm/shared/common/http';
import { MicroManageInterface } from '@fm/shared/micro';
import { Observable, Subject } from 'rxjs';
export declare class MicroManage implements MicroManageInterface {
    private http;
    private injector;
    sharedData: any;
    private proxy;
    private microCache;
    private microStaticCache;
    private appContext;
    loaderStyleSubject?: Subject<HTMLStyleElement> | undefined;
    constructor(http: HttpClient, injector: Injector);
    bootstrapMicro(microName: string): Observable<any>;
    private reeadLinkToStyles;
    private getLinkCache;
    private createMicroTag;
}
