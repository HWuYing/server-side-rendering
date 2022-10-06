"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var micro_1 = require("@fm/shared/micro");
var app_context_1 = require("@fm/shared/providers/app-context");
var json_config_1 = require("@fm/shared/providers/json-config");
var token_1 = require("@fm/shared/token");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var micro_2 = require("../../micro");
var token_2 = require("../../token");
var app_context_2 = require("../app-context");
var json_config_2 = require("../json-config");
var Platform = /** @class */ (function () {
    function Platform(providers) {
        if (providers === void 0) { providers = []; }
        this.providers = providers;
        this.rootInjector = (0, di_1.getProvider)(di_1.Injector);
    }
    Platform.prototype.bootstrapRender = function (render) {
        registryRender(this.proxyRender.bind(this, render));
    };
    Platform.prototype.proxyRender = function (render, global, isMicro) {
        if (isMicro === void 0) { isMicro = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var request, resource, _global, microConfig, injector, _a, _b, js, _c, links, _d, html, styles, execlResult;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        request = global.request, resource = global.resource, _global = tslib_1.__rest(global, ["request", "resource"]);
                        microConfig = { isMicro: isMicro, request: request, resource: resource.cache, fetch: resource.proxyFetch, renderSSR: true };
                        injector = this.beforeBootstrapRender(microConfig, [
                            { provide: token_2.RESOURCE, useValue: resource },
                            { provide: token_1.HISTORY, useValue: { location: this.getLocation(request, isMicro), listen: function () { return function () { return void (0); }; } } }
                        ]);
                        _a = (0, micro_1.serializableAssets)(resource.readAssetsSync()), _b = _a.js, js = _b === void 0 ? [] : _b, _c = _a.links, links = _c === void 0 ? [] : _c;
                        return [4 /*yield*/, render(injector, tslib_1.__assign({ request: request }, _global))];
                    case 1:
                        _d = _e.sent(), html = _d.html, styles = _d.styles;
                        return [4 /*yield*/, this.execlMicroMiddleware(injector, { html: html, styles: styles, js: js, links: links, microTags: [], microFetchData: [] })];
                    case 2:
                        execlResult = _e.sent();
                        injector.clear();
                        return [2 /*return*/, execlResult];
                }
            });
        });
    };
    Platform.prototype.beforeBootstrapRender = function (context, providers) {
        if (providers === void 0) { providers = []; }
        var injector = new di_1.StaticInjector(this.rootInjector, { isScope: 'self' });
        var appContext = tslib_1.__assign({ useMicroManage: function () { return injector.get(micro_2.MicroManage); } }, context);
        var _providers = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], this.providers, true), [
            { provide: app_context_1.APP_CONTEXT, useValue: appContext },
            { provide: json_config_1.JsonConfigService, useClass: json_config_2.JsonConfigService },
            { provide: app_context_1.AppContextService, useClass: app_context_2.AppContextService }
        ], false), providers, true);
        _providers.forEach(function (provider) { return injector.set(provider.provide, provider); });
        return injector;
    };
    Platform.prototype.mergeMicroToSSR = function (middleware) {
        return function (_a) {
            var _b = _a.html, html = _b === void 0 ? "" : _b, _c = _a.styles, styles = _c === void 0 ? "" : _c, _d = _a.js, js = _d === void 0 ? [] : _d, _e = _a.links, links = _e === void 0 ? [] : _e, _f = _a.microTags, microTags = _f === void 0 ? [] : _f, _g = _a.microFetchData, microFetchData = _g === void 0 ? [] : _g;
            return middleware().pipe((0, operators_1.map)(function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var appContext, fetchData;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                appContext = injector.get(app_context_1.AppContextService);
                fetchData = appContext.getAllFileSource();
                return [2 /*return*/, (0, rxjs_1.lastValueFrom)(appContext.getpageMicroMiddleware().reduce(function (input, middleware) { return (input.pipe((0, operators_1.switchMap)(_this.mergeMicroToSSR(middleware)))); }, (0, rxjs_1.of)(options))).then(function (execlResult) { return (tslib_1.__assign(tslib_1.__assign({}, execlResult), { fetchData: fetchData })); })];
            });
        });
    };
    Platform.prototype.getLocation = function (request, isMicro) {
        var _a = request.params.pathname, pathname = _a === void 0 ? '' : _a;
        return { pathname: isMicro ? "".concat(pathname) : request.path, search: '?' };
    };
    return Platform;
}());
exports.Platform = Platform;
