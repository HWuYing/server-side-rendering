import { Request } from 'express';
import { SSROptions } from './type-api';
export declare class Render {
    private entryFile;
    private microName;
    private _compiledRender;
    private resource;
    private vmContext;
    private isDevelopment;
    constructor(entryFile: string, options: SSROptions);
    private factoryVmScript;
    private _render;
    private createScriptTemplate;
    renderMicro(request: Request): Promise<{
        status: any;
        redirectUrl: any;
        html: any;
        styles: any;
        links: any;
        microTags: any;
        microFetchData: any;
    }>;
    render(request: Request): Promise<{
        html: string;
        status: any;
        redirectUrl: any;
    }>;
}
