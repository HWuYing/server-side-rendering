import { AppContextService } from '../../providers/app-context';
export declare class History {
    private appContext;
    private _redirect;
    constructor(appContext: AppContextService);
    push(): void;
    replace(url: string): void;
    listen(): () => void;
    get location(): any;
    get redirect(): any;
}
