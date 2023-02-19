import { __assign, __awaiter, __generator, __rest, __spreadArray } from "tslib";
import { Injector, INJECTOR_SCOPE } from '@fm/di';
import { APP_CONTEXT, AppContextService, HISTORY, HttpHandler, HttpInterceptingHandler, JsonConfigService, MockHistory } from '@fm/shared';
import { serializableAssets } from '@fm/shared/micro';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MicroManage } from '../../micro';
import { RESOURCE } from '../../token';
import { AppContextService as ServerAppContextService } from '../app-context';
import { JsonConfigService as ServerJsonConfigService } from '../json-config';
var Platform = /** @class */ (function () {
    function Platform(platformInjector) {
        this.platformInjector = platformInjector;
    }
    Platform.prototype.bootstrapRender = function (additionalProviders, render) {
        var _a = this.parseParams(additionalProviders, render), providers = _a[0], _render = _a[1];
        registryRender(this.proxyRender.bind(this, providers, _render));
    };
    Platform.prototype.proxyRender = function (providers, render, global, isMicro) {
        if (isMicro === void 0) { isMicro = false; }
        return __awaiter(this, void 0, void 0, function () {
            var request, resource, _global, microConfig, injector, history, _a, _b, js, _c, links, _d, html, styles, execlResult;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        request = global.request, resource = global.resource, _global = __rest(global, ["request", "resource"]);
                        microConfig = { isMicro: isMicro, request: request, resource: resource.cache, renderSSR: true, location: this.getLocation(request, isMicro) };
                        injector = this.beforeBootstrapRender(microConfig, __spreadArray(__spreadArray([], providers, true), [
                            { provide: RESOURCE, useValue: resource },
                            { provide: HISTORY, useClass: MockHistory }
                        ], false));
                        history = injector.get(HISTORY);
                        _a = serializableAssets(resource.readAssetsSync()), _b = _a.js, js = _b === void 0 ? [] : _b, _c = _a.links, links = _c === void 0 ? [] : _c;
                        return [4 /*yield*/, render(injector, __assign({ request: request }, _global))];
                    case 1:
                        _d = _e.sent(), html = _d.html, styles = _d.styles;
                        return [4 /*yield*/, this.execlMicroMiddleware(injector, { html: html, styles: styles, js: js, links: links, microTags: [], microFetchData: [] })];
                    case 2:
                        execlResult = _e.sent();
                        execlResult.fetchData = injector.get(AppContextService).getPageFileSource();
                        injector.destory();
                        return [2 /*return*/, history.redirect ? { status: '302', redirectUrl: history.redirect.url } : execlResult];
                }
            });
        });
    };
    Platform.prototype.beforeBootstrapRender = function (context, providers) {
        if (providers === void 0) { providers = []; }
        var injector = Injector.create(__spreadArray([
            { provide: INJECTOR_SCOPE, useValue: 'root' },
            { provide: APP_CONTEXT, useValue: __assign({ useMicroManage: function () { return injector.get(MicroManage); } }, context) },
            { provide: HttpHandler, useExisting: HttpInterceptingHandler },
            { provide: JsonConfigService, useExisting: ServerJsonConfigService },
            { provide: AppContextService, useExisting: ServerAppContextService }
        ], providers, true), this.platformInjector);
        return injector;
    };
    Platform.prototype.mergeMicroToSSR = function (middleware) {
        return function (_a) {
            var _b = _a.html, html = _b === void 0 ? "" : _b, _c = _a.styles, styles = _c === void 0 ? "" : _c, _d = _a.js, js = _d === void 0 ? [] : _d, _e = _a.links, links = _e === void 0 ? [] : _e, _f = _a.microTags, microTags = _f === void 0 ? [] : _f, _g = _a.microFetchData, microFetchData = _g === void 0 ? [] : _g;
            return middleware().pipe(map(function (_a) {
                var microName = _a.microName, microResult = _a.microResult;
                return ({
                    html: html.replace("<!-- ".concat(microName, " -->"), microResult.html),
                    styles: styles + microResult.styles,
                    js: js.concat.apply(js, microResult.js || []),
                    links: links.concat.apply(links, microResult.links || []),
                    microTags: microTags.concat.apply(microTags, microResult.microTags || []),
                    microFetchData: microFetchData.concat.apply(microFetchData, microResult.microFetchData || [])
                });
            }));
        };
    };
    Platform.prototype.execlMicroMiddleware = function (injector, options) {
        return __awaiter(this, void 0, void 0, function () {
            var appContext;
            var _this = this;
            return __generator(this, function (_a) {
                appContext = injector.get(AppContextService);
                return [2 /*return*/, lastValueFrom(appContext.getpageMicroMiddleware().reduce(function (input, middleware) { return (input.pipe(switchMap(_this.mergeMicroToSSR(middleware)))); }, of(options)))];
            });
        });
    };
    Platform.prototype.parseParams = function (providers, render) {
        return typeof providers === 'function' ? [[], providers] : [__spreadArray([], providers, true), render];
    };
    Platform.prototype.getLocation = function (request, isMicro) {
        var _a = request.params.pathname, pathname = _a === void 0 ? '' : _a;
        return { pathname: isMicro ? "".concat(pathname) : request.path, search: '?' };
    };
    return Platform;
}());
export { Platform };
