import { Request, Response } from 'express';
import { SSROptions } from './type-api';
export declare class Render {
    private entryFile;
    private microName;
    private _compiledRender;
    private vmContext;
    private resource;
    private isDevelopment;
    constructor(entryFile: string, options: SSROptions);
    private factoryVmScript;
    private _render;
    private createScriptTemplate;
    renderMicro(request: Request, response: Response): Promise<void>;
    render(request: Request, response: Response): Promise<void>;
}
