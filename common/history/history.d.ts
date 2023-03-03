import { Injector } from '@fm/di';
export declare class History {
    private injector;
    private _redirect;
    private appContext;
    constructor(injector: Injector);
    push(): void;
    replace(url: string): void;
    listen(): () => void;
    get location(): any;
    get redirect(): any;
}
