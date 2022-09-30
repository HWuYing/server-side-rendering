import { Provider } from '@fm/di';
declare type Render = (...args: any[]) => Promise<{
    html: string;
    styles: string;
}>;
export declare class Platform {
    private providers;
    private rootInjector;
    constructor(providers?: Provider[]);
    bootstrapRender(render: Render): void;
    private proxyRender;
    private beforeBootstrapRender;
    private mergeMicroToSSR;
    private execlMicroMiddleware;
    private getLocation;
}
export {};
