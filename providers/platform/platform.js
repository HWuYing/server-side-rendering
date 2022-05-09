"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
const di_1 = require("@fm/di");
const app_context_1 = require("@fm/shared/providers/app-context");
const json_config_1 = require("@fm/shared/providers/json-config");
const token_1 = require("@fm/shared/token");
const import_rxjs_1 = require("@fm/import-rxjs");
const import_rxjs_2 = require("@fm/import-rxjs");
const micro_1 = require("../../micro");
const app_context_2 = require("../app-context");
const json_config_2 = require("../json-config");
class Platform {
    providers;
    rootInjector;
    resource = {};
    constructor(providers = []) {
        this.providers = providers;
        this.rootInjector = (0, di_1.getProvider)(di_1.Injector);
    }
    bootstrapRender(render) {
        exports.render = this.proxyRender.bind(this, render);
    }
    async proxyRender(render, global, isMicro = false) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { fetch, request, location, readAssets, readStaticFile, proxyHost, microSSRPath, ..._global } = global;
        const microConfig = { fetch, isMicro, request, proxyHost, microSSRPath, readStaticFile, renderSSR: true, resource: this.resource };
        const injector = this.beforeBootstrapRender(microConfig, [
            { provide: token_1.HISTORY, useValue: { location: this.getLocation(request, isMicro), listen: () => () => void (0) } }
        ]);
        const { js = [], links = [] } = readAssets();
        const { html, styles } = await render(injector, { request, ..._global });
        const execlResult = await this.execlMicroMiddleware(injector, { html, styles, js, links, microTags: [], microFetchData: [] });
        injector.clear();
        return execlResult;
    }
    beforeBootstrapRender(context, providers = []) {
        const injector = new di_1.StaticInjector(this.rootInjector, { isScope: 'self' });
        const appContext = { useMicroManage: () => injector.get(micro_1.MicroManage), ...context };
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
        return ({ html = ``, styles = ``, js = [], links = [], microTags = [], microFetchData = [] }) => middleware().pipe((0, import_rxjs_2.map)(({ microName, microResult }) => ({
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
        return appContext.getpageMicroMiddleware().reduce((input, middleware) => (input.pipe((0, import_rxjs_2.switchMap)(this.mergeMicroToSSR(middleware)))), (0, import_rxjs_1.of)(options))
            .toPromise()
            .then((execlResult) => ({ ...execlResult, fetchData }));
    }
    getLocation(request, isMicro) {
        const { pathname = '' } = request.params;
        return { pathname: isMicro ? `${pathname}` : request.path, search: '?' };
    }
}
exports.Platform = Platform;
