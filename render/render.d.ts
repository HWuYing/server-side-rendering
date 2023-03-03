import { Request } from 'express';
import { SSROptions } from './type-api';
export declare class Render {
    private entryFile;
    private microName;
    private _compiledRender;
    private isDevelopment;
    private resource;
    private vmContext;
    constructor(entryFile: string, { resource, microName, vmContext }: SSROptions);
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
