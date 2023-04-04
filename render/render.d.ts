import { Request } from 'express';
import { RenderInterface, ResourceOptions } from './type-api';
export declare class Render implements RenderInterface {
    private _compiledRender;
    private resource;
    constructor(options: ResourceOptions);
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
