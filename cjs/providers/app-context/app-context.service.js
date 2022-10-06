"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContextService = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var app_context_1 = require("@fm/shared/providers/app-context");
var token_1 = require("@fm/ssr/token");
var rxjs_1 = require("rxjs");
var AppContextService = /** @class */ (function (_super) {
    tslib_1.__extends(AppContextService, _super);
    function AppContextService(injector) {
        var _this = _super.call(this, injector) || this;
        _this.pageFileSource = {};
        _this.microMiddlewareList = [];
        _this.resource = _this.injector.get(token_1.RESOURCE);
        return _this;
    }
    AppContextService.prototype.readStaticFile = function (url) {
        var fileCache = this.resource.readStaticFile(url);
        this.pageFileSource[url] = fileCache;
        return (0, rxjs_1.of)(fileCache.source);
    };
    AppContextService.prototype.registryMicroMidder = function (middleware) {
        this.microMiddlewareList.push(middleware);
    };
    AppContextService.prototype.getPageFileSource = function () {
        return JSON.stringify(this.pageFileSource);
    };
    AppContextService.prototype.getAllFileSource = function () {
        return JSON.stringify(this.getContext().resource);
    };
    AppContextService.prototype.getpageMicroMiddleware = function () {
        return this.microMiddlewareList;
    };
    AppContextService = tslib_1.__decorate([
        (0, di_1.Injectable)(),
        tslib_1.__param(0, (0, di_1.Inject)(di_1.Injector)),
        tslib_1.__metadata("design:paramtypes", [di_1.Injector])
    ], AppContextService);
    return AppContextService;
}(app_context_1.AppContextService));
exports.AppContextService = AppContextService;
