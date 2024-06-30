import { Provider } from '@fm/di';
export declare class Platform {
    private platformInjector;
    bootstrapRender(providers?: Provider[]): void;
    private proxyRender;
    private beforeBootstrapRender;
    private mergeMicroToSSR;
    private executeMicroMiddleware;
    private runRender;
    private getLocation;
}
