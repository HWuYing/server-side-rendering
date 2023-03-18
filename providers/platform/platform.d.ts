import { Injector, Provider } from '@fm/di';
type Render = (...args: any[]) => Promise<{
    html: string;
    styles: string;
}>;
export declare class Platform {
    private platformInjector;
    constructor(platformInjector: Injector);
    bootstrapRender(additionalProviders: Provider[] | Render, render?: Render): void;
    private proxyRender;
    private beforeBootstrapRender;
    private mergeMicroToSSR;
    private execlMicroMiddleware;
    private parseParams;
    private getLocation;
}
export {};
