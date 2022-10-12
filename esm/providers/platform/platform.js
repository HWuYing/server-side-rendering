import { __awaiter, __rest } from "tslib";
import { getProvider, Injector, StaticInjector } from '@fm/di';
import { serializableAssets } from '@fm/shared/micro';
import { APP_CONTEXT, AppContextService } from '@fm/shared/providers/app-context';
import { JsonConfigService } from '@fm/shared/providers/json-config';
import { HISTORY } from '@fm/shared/token';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MicroManage } from '../../micro';
import { RESOURCE } from '../../token';
import { AppContextService as ServerAppContextService } from '../app-context';
import { JsonConfigService as ServerJsonConfigService } from '../json-config';
export class Platform {
    constructor(providers = []) {
        this.providers = providers;
        this.rootInjector = getProvider(Injector);
    }
    bootstrapRender(render) {
        registryRender(this.proxyRender.bind(this, render));
    }
    proxyRender(render, global, isMicro = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const { request, resource } = global, _global = __rest(global, ["request", "resource"]);
            const microConfig = { isMicro, request, resource: resource.cache, renderSSR: true };
            const injector = this.beforeBootstrapRender(microConfig, [
                { provide: RESOURCE, useValue: resource },
                { provide: HISTORY, useValue: { location: this.getLocation(request, isMicro), listen: () => () => void (0) } }
            ]);
            const { js = [], links = [] } = serializableAssets(resource.readAssetsSync());
            const { html, styles } = yield render(injector, Object.assign({ request }, _global));
            const execlResult = yield this.execlMicroMiddleware(injector, { html, styles, js, links, microTags: [], microFetchData: [] });
            execlResult.fetchData = injector.get(AppContextService).getPageFileSource();
            injector.clear();
            return execlResult;
        });
    }
    beforeBootstrapRender(context, providers = []) {
        const injector = new StaticInjector(this.rootInjector, { isScope: 'self' });
        const appContext = Object.assign({ useMicroManage: () => injector.get(MicroManage) }, context);
        const _providers = [
            ...this.providers,
            { provide: APP_CONTEXT, useValue: appContext },
            { provide: JsonConfigService, useClass: ServerJsonConfigService },
            { provide: AppContextService, useClass: ServerAppContextService },
            ...providers
        ];
        _providers.forEach((provider) => injector.set(provider.provide, provider));
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
    getLocation(request, isMicro) {
        const { pathname = '' } = request.params;
        return { pathname: isMicro ? `${pathname}` : request.path, search: '?' };
    }
}
