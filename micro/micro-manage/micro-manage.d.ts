import { Injector } from '@fm/di';
import { MicroManageInterface } from '@fm/shared/micro';
import { Observable, Subject } from 'rxjs';
export declare class MicroManage implements MicroManageInterface {
    private injector;
    sharedData: any;
    private resource;
    private microCache;
    private microStaticCache;
    private appContext;
    loaderStyleSubject?: Subject<HTMLStyleElement> | undefined;
    constructor(injector: Injector);
    bootstrapMicro(microName: string): Observable<any>;
    private reeadLinkToStyles;
    private getLinkCache;
    private createMicroTag;
    private fetchRequire;
}
