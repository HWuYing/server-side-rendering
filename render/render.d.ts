import { Request, Response } from 'express';
import { SSROptions } from './type-api';
export declare class Render {
    private entryFile;
    private host;
    private index;
    private microName;
    private microPrePath;
    private manifestFile;
    private _compiledRender;
    private vmContext;
    private staticDir;
    private isDevelopment;
    constructor(entryFile: string, options: SSROptions);
    private microSSRPath;
    private proxyFetch;
    private readAssets;
    private readStaticFile;
    private get global();
    private readHtmlTemplate;
    private readAssetsSync;
    private factoryVmScript;
    private _render;
    private createScriptTemplate;
    renderMicro(request: Request, response: Response): Promise<void>;
    render(request: Request, response: Response): Promise<void>;
    private get innerHeadFlag();
    private get innerHtmlFlag();
}
