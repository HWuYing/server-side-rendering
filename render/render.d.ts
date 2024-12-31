import { Request } from 'express';
import { Resource } from './resource';
import { RenderInterface } from './type-api';
export declare class Render implements RenderInterface {
    private resource;
    private _compiledRender;
    constructor(resource: Resource);
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
