"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
var tslib_1 = require("tslib");
var http_1 = require("@fm/core/common/http");
var micro_1 = require("@fm/core/micro");
var app_context_1 = require("@fm/core/providers/app-context");
var json_config_1 = require("@fm/core/providers/json-config");
var token_1 = require("@fm/core/token");
var di_1 = require("@fm/di");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var common_1 = require("../common");
var micro_2 = require("../micro");
var app_context_2 = require("../providers/app-context");
var json_config_2 = require("../providers/json-config");
var token_2 = require("../token");
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var request, resource, _global, context, injector, history, _a, _b, js, _c, links, _d, html, styles, executeResult;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        request = global.request, resource = global.resource, _global = tslib_1.__rest(global, ["request", "resource"]);
                        context = { isMicro: isMicro, request: request, resource: resource.cache, renderSSR: true, location: this.getLocation(request, isMicro) };
                        injector = this.beforeBootstrapRender(context, tslib_1.__spreadArray(tslib_1.__spreadArray([], providers, true), [
                            { provide: token_2.RESOURCE, useValue: resource },
                            { provide: token_1.HISTORY, useClass: common_1.History }
                        ], false));
                        history = injector.get(token_1.HISTORY);
                        _a = (0, micro_1.serializableAssets)(resource.readAssetsSync()), _b = _a.js, js = _b === void 0 ? [] : _b, _c = _a.links, links = _c === void 0 ? [] : _c;
                        return [4 /*yield*/, this.runRender(injector, tslib_1.__assign({ request: request }, _global), render)];
                    case 1:
                        _d = _e.sent(), html = _d.html, styles = _d.styles;
                        return [4 /*yield*/, this.executeMicroMiddleware(injector, { html: html, styles: styles, js: js, links: links, microTags: [], microFetchData: [] })];
                    case 2:
                        executeResult = _e.sent();
                        executeResult.fetchData = injector.get(app_context_1.AppContextService).getPageFileSource();
                        injector.destroy();
                        return [2 /*return*/, history.redirect ? { status: '302', redirectUrl: history.redirect.url } : executeResult];
                }
            });
        });
    };
    Platform.prototype.beforeBootstrapRender = function (context, providers) {
        if (providers === void 0) { providers = []; }
        var injector = di_1.Injector.create([
            { provide: app_context_1.APP_CONTEXT, useValue: tslib_1.__assign({ useMicroManage: function () { return injector.get(micro_2.MicroManage); } }, context) },
            { provide: http_1.HttpHandler, useExisting: http_1.HttpInterceptingHandler },
            { provide: json_config_1.JsonConfigService, useExisting: json_config_2.JsonConfigService },
            { provide: app_context_1.AppContextService, useExisting: app_context_2.AppContextService },
            providers
        ], this.platformInjector);
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
    Platform.prototype.executeMicroMiddleware = function (injector, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var appContext;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                appContext = injector.get(app_context_1.AppContextService);
                return [2 /*return*/, (0, rxjs_1.lastValueFrom)(appContext.getPageMicroMiddleware().reduce(function (input, middleware) { return (input.pipe((0, operators_1.switchMap)(_this.mergeMicroToSSR(middleware)))); }, (0, rxjs_1.of)(options)))];
            });
        });
    };
    Platform.prototype.runRender = function (injector, options, render) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var application;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, injector.get(token_1.APPLICATION_TOKEN)];
                    case 1:
                        application = _b.sent();
                        return [2 /*return*/, (_a = (render || application.main)) === null || _a === void 0 ? void 0 : _a.call(application, injector, options)];
                }
            });
        });
    };
    Platform.prototype.parseParams = function (providers, render) {
        return typeof providers === 'function' ? [[], providers] : [tslib_1.__spreadArray([], providers, true), render];
    };
    Platform.prototype.getLocation = function (request, isMicro) {
        var _a = request.params.pathname, pathname = _a === void 0 ? '' : _a;
        return { pathname: isMicro ? "".concat(pathname) : request.path, search: '?' };
    };
    return Platform;
}());
exports.Platform = Platform;
