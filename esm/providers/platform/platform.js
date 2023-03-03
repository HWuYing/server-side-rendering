import { __awaiter, __rest } from "tslib";
import { Injector, INJECTOR_SCOPE } from '@fm/di';
import { APP_CONTEXT, AppContextService, HISTORY, HttpHandler, HttpInterceptingHandler, JsonConfigService } from '@fm/shared';
import { serializableAssets } from '@fm/shared/micro';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { History } from '../../common';
import { MicroManage } from '../../micro';
import { RESOURCE } from '../../token';
import { AppContextService as ServerAppContextService } from '../app-context';
import { JsonConfigService as ServerJsonConfigService } from '../json-config';
export class Platform {
    constructor(platformInjector) {
        this.platformInjector = platformInjector;
    }
    bootstrapRender(additionalProviders, render) {
        const [providers, _render] = this.parseParams(additionalProviders, render);
        registryRender(this.proxyRender.bind(this, providers, _render));
    }
    proxyRender(providers, render, global, isMicro = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const { request, resource } = global, _global = __rest(global, ["request", "resource"]);
            const microConfig = { isMicro, request, resource: resource.cache, renderSSR: true, location: this.getLocation(request, isMicro) };
            const injector = this.beforeBootstrapRender(microConfig, [
                ...providers,
                { provide: RESOURCE, useValue: resource },
                { provide: HISTORY, useClass: History }
            ]);
            const history = injector.get(HISTORY);
            const { js = [], links = [] } = serializableAssets(resource.readAssetsSync());
            const { html, styles } = yield render(injector, Object.assign({ request }, _global));
            const execlResult = yield this.execlMicroMiddleware(injector, { html, styles, js, links, microTags: [], microFetchData: [] });
            execlResult.fetchData = injector.get(AppContextService).getPageFileSource();
            injector.destory();
            return history.redirect ? { status: '302', redirectUrl: history.redirect.url } : execlResult;
        });
    }
    beforeBootstrapRender(context, providers = []) {
        const injector = Injector.create([
            { provide: INJECTOR_SCOPE, useValue: 'root' },
            { provide: APP_CONTEXT, useValue: Object.assign({ useMicroManage: () => injector.get(MicroManage) }, context) },
            { provide: HttpHandler, useExisting: HttpInterceptingHandler },
            { provide: JsonConfigService, useExisting: ServerJsonConfigService },
            { provide: AppContextService, useExisting: ServerAppContextService },
            ...providers
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
    execlMicroMiddleware(injector, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const appContext = injector.get(AppContextService);
            return lastValueFrom(appContext.getpageMicroMiddleware().reduce((input, middleware) => (input.pipe(switchMap(this.mergeMicroToSSR(middleware)))), of(options)));
        });
    }
    parseParams(providers, render) {
        return typeof providers === 'function' ? [[], providers] : [[...providers], render];
    }
    getLocation(request, isMicro) {
        const { pathname = '' } = request.params;
        return { pathname: isMicro ? `${pathname}` : request.path, search: '?' };
    }
}
