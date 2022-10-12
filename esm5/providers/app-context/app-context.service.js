import { __assign, __awaiter, __decorate, __extends, __generator, __metadata, __param } from "tslib";
import { Inject, Injectable, Injector } from '@fm/di';
import { AppContextService as SharedAppContextService } from '@fm/shared';
import { RESOURCE } from '@fm/ssr/token';
import { of } from 'rxjs';
var AppContextService = /** @class */ (function (_super) {
    __extends(AppContextService, _super);
    function AppContextService(injector) {
        var _this = _super.call(this, injector) || this;
        _this.pageFileSource = {};
        _this.microMiddlewareList = [];
        _this.resource = _this.injector.get(RESOURCE);
        return _this;
    }
    AppContextService.prototype.setPageSource = function (url, sourceCache) {
        this.pageFileSource[url] = sourceCache;
    };
    AppContextService.prototype.cacheToArray = function (map) {
        return Object.keys(map).map(function (key) { return (__assign({ url: key }, map[key])); });
    };
    AppContextService.prototype.proxyFetch = function (url, init) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.resource.proxyFetch(url, init).then(function (res) {
                        res.clone().arrayBuffer().then(function (text) {
                            var source = Buffer.from(text).toString('base64');
                            var fetchCache = { type: 'fetch-cache', method: init === null || init === void 0 ? void 0 : init.method, source: source };
                            _this.setPageSource(url, fetchCache);
                        });
                        return res;
                    })];
            });
        });
    };
    AppContextService.prototype.readStaticFile = function (url) {
        var fileCache = this.resource.readStaticFile(url);
        this.setPageSource(url, fileCache);
        return of(fileCache.source);
    };
    AppContextService.prototype.registryMicroMidder = function (middleware) {
        this.microMiddlewareList.push(middleware);
    };
    AppContextService.prototype.getPageFileSource = function () {
        return JSON.stringify(this.cacheToArray(this.pageFileSource));
    };
    AppContextService.prototype.getAllFileSource = function () {
        var map = __assign(__assign({}, this.getContext().resource), this.pageFileSource);
        return JSON.stringify(this.cacheToArray(map));
    };
    AppContextService.prototype.getpageMicroMiddleware = function () {
        return this.microMiddlewareList;
    };
    Object.defineProperty(AppContextService.prototype, "fetch", {
        get: function () {
            return this.proxyFetch.bind(this);
        },
        enumerable: false,
        configurable: true
    });
    AppContextService = __decorate([
        Injectable(),
        __param(0, Inject(Injector)),
        __metadata("design:paramtypes", [Injector])
    ], AppContextService);
    return AppContextService;
}(SharedAppContextService));
export { AppContextService };
