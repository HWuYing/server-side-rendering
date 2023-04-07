import { MicroManageInterface } from '@fm/core/micro';
import { Injector } from '@fm/di';
import { Observable } from 'rxjs';
export declare class MicroManage implements MicroManageInterface {
    private injector;
    sharedData: any;
    private resource;
    private microStaticCache;
    private appContext;
    constructor(injector: Injector);
    bootstrapMicro(microName: string): Observable<any>;
    private checkRedirect;
    private readLinkToStyles;
    private getLinkCache;
    private createMicroTag;
    private fetchRequire;
}
