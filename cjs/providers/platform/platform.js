"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
const di_1 = require("@fm/di");
const micro_1 = require("@fm/shared/micro");
const app_context_1 = require("@fm/shared/providers/app-context");
const json_config_1 = require("@fm/shared/providers/json-config");
const token_1 = require("@fm/shared/token");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const micro_2 = require("../../micro");
const token_2 = require("../../token");
const app_context_2 = require("../app-context");
const json_config_2 = require("../json-config");
class Platform {
    providers;
    rootInjector;
    constructor(providers = []) {
        this.providers = providers;
        this.rootInjector = (0, di_1.getProvider)(di_1.Injector);
    }
    bootstrapRender(render) {
        registryRender(this.proxyRender.bind(this, render));
    }
    async proxyRender(render, global, isMicro = false) {
        const { request, resource, ..._global } = global;
        const microConfig = { isMicro, request, resource: resource.cache, fetch: resource.proxyFetch, renderSSR: true };
        const injector = this.beforeBootstrapRender(microConfig, [
            { provide: token_2.RESOURCE, useValue: resource },
            { provide: token_1.HISTORY, useValue: { location: this.getLocation(request, isMicro), listen: () => () => void (0) } }
        ]);
        const { js = [], links = [] } = (0, micro_1.serializableAssets)(resource.readAssetsSync());
        const { html, styles } = await render(injector, { request, ..._global });
        const execlResult = await this.execlMicroMiddleware(injector, { html, styles, js, links, microTags: [], microFetchData: [] });
        injector.clear();
        return execlResult;
    }
    beforeBootstrapRender(context, providers = []) {
        const injector = new di_1.StaticInjector(this.rootInjector, { isScope: 'self' });
        const appContext = { useMicroManage: () => injector.get(micro_2.MicroManage), ...context };
        const _providers = [
            ...this.providers,
            { provide: app_context_1.APP_CONTEXT, useValue: appContext },
            { provide: json_config_1.JsonConfigService, useClass: json_config_2.JsonConfigService },
            { provide: app_context_1.AppContextService, useClass: app_context_2.AppContextService },
            ...providers
        ];
        _providers.forEach((provider) => injector.set(provider.provide, provider));
        return injector;
    }
    mergeMicroToSSR(middleware) {
        return ({ html = ``, styles = ``, js = [], links = [], microTags = [], microFetchData = [] }) => middleware().pipe((0, operators_1.map)(({ microName, microResult }) => ({
            html: html.replace(`<!-- ${microName} -->`, microResult.html),
            styles: styles + microResult.styles,
            js: js.concat(...microResult.js || []),
            links: links.concat(...microResult.links || []),
            microTags: microTags.concat(...microResult.microTags || []),
            microFetchData: microFetchData.concat(...microResult.microFetchData || [])
        })));
    }
    async execlMicroMiddleware(injector, options) {
        const appContext = injector.get(app_context_1.AppContextService);
        const fetchData = appContext.getAllFileSource();
        return (0, rxjs_1.lastValueFrom)(appContext.getpageMicroMiddleware().reduce((input, middleware) => (input.pipe((0, operators_1.switchMap)(this.mergeMicroToSSR(middleware)))), (0, rxjs_1.of)(options))).then((execlResult) => ({ ...execlResult, fetchData }));
    }
    getLocation(request, isMicro) {
        const { pathname = '' } = request.params;
        return { pathname: isMicro ? `${pathname}` : request.path, search: '?' };
    }
}
exports.Platform = Platform;
