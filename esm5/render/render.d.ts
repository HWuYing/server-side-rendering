import { Request, Response } from 'express';
import { SSROptions } from './type-api';
export declare class Render {
    private entryFile;
    private host;
    private index;
    private microName;
    private manifestFile;
    private _compiledRender;
    private vmContext;
    private microSSRPathPrefix;
    private staticDir;
    private isDevelopment;
    constructor(entryFile: string, options: SSROptions);
    private microSSRPath;
    private get global();
    private proxyFetch;
    private readHtmlTemplate;
    private readStaticFile;
    private readAssetsSync;
    private readAssets;
    private factoryVmScript;
    private _render;
    private createScriptTemplate;
    renderMicro(request: Request, response: Response): Promise<void>;
    render(request: Request, response: Response): Promise<void>;
    private get innerHeadFlag();
    private get innerHtmlFlag();
}
