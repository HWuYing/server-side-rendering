import { __awaiter, __decorate, __metadata, __rest } from "tslib";
import { HttpHandler, HttpInterceptingHandler } from '@fm/core/common/http';
import { serializableAssets } from '@fm/core/micro';
import { APP_CONTEXT, AppContextService } from '@fm/core/providers/app-context';
import { JsonConfigService } from '@fm/core/providers/json-config';
import { APPLICATION_TOKEN, HISTORY } from '@fm/core/token';
import { Inject, Injector } from '@fm/di';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { History } from '../common';
import { MicroManage } from '../micro';
import { AppContextService as ServerAppContextService } from '../providers/app-context';
import { JsonConfigService as ServerJsonConfigService } from '../providers/json-config';
import { RESOURCE } from '../token';
export class Platform {
    bootstrapRender(providers = []) {
        registryRender(this.proxyRender.bind(this, providers));
    }
    proxyRender(providers_1, global_1) {
        return __awaiter(this, arguments, void 0, function* (providers, global, isMicro = false) {
            const { request, resource } = global, _global = __rest(global, ["request", "resource"]);
            const context = { isMicro, request, renderSSR: true, location: this.getLocation(request, isMicro) };
            const injector = this.beforeBootstrapRender(context, [
                ...providers,
                { provide: RESOURCE, useValue: resource },
                { provide: HISTORY, useClass: History }
            ]);
            const history = injector.get(HISTORY);
            const { js = [], links = [] } = serializableAssets(resource.readAssetsSync());
            const { html, styles } = yield this.runRender(injector, Object.assign({ request }, _global));
            const executeResult = yield this.executeMicroMiddleware(injector, { html, styles, js, links, microTags: [], microFetchData: [] });
            executeResult.fetchData = injector.get(AppContextService).getPageFileSource();
            injector.destroy();
            return history.redirect ? { status: '302', redirectUrl: history.redirect.url } : executeResult;
        });
    }
    beforeBootstrapRender(context, providers = []) {
        const injector = Injector.create([
            { provide: APP_CONTEXT, useValue: Object.assign({ useMicroManage: () => injector.get(MicroManage) }, context) },
            { provide: HttpHandler, useExisting: HttpInterceptingHandler },
            { provide: JsonConfigService, useExisting: ServerJsonConfigService },
            { provide: AppContextService, useExisting: ServerAppContextService },
            providers
        ], this.platformInjector);
        return injector;
    }
    mergeMicroToSSR(middleware) {
        return ({ html = ``, styles = ``, js = [], links = [], microTags = [], microFetchData = [] }) => middleware().pipe(map(({ microName, microResult }) => ({
            html: html.replace(`<!-- ${microName} -->`, microResult.html),
            styles: styles + microResult.styles,
            js: js.concat(...microResult.js || []),
            links: links.concat(...microResult.links || []),
            microTags: microTags.concat(...microResult.microTags || []),
            microFetchData: microFetchData.concat(...microResult.microFetchData || [])
        })));
    }
    executeMicroMiddleware(injector, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const appContext = injector.get(AppContextService);
            return lastValueFrom(appContext.getPageMicroMiddleware().reduce((input, middleware) => (input.pipe(switchMap(this.mergeMicroToSSR(middleware)))), of(options)));
        });
    }
    runRender(injector, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const application = yield injector.get(APPLICATION_TOKEN);
            return (_a = application.main) === null || _a === void 0 ? void 0 : _a.call(application, injector, options);
        });
    }
    getLocation(request, isMicro) {
        const { params: { pathname = '' }, query } = request;
        const search = `?${Object.keys(query).map((key) => `${key}=${query[key]}`).join('&')}`;
        return { pathname: isMicro ? `${pathname}` : request.path, search };
    }
}
__decorate([
    Inject(Injector),
    __metadata("design:type", Injector)
], Platform.prototype, "platformInjector", void 0);
