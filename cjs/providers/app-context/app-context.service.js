"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContextService = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@hwy-fm/core");
var di_1 = require("@hwy-fm/di");
var token_1 = require("../../token");
var AppContextService = /** @class */ (function (_super) {
    tslib_1.__extends(AppContextService, _super);
    function AppContextService(injector) {
        var _this = _super.call(this, injector) || this;
        _this.request = _this.getContext().request;
        _this.pageFileSource = {};
        _this.microMiddlewareList = [];
        _this.resource = _this.injector.get(token_1.RESOURCE);
        return _this;
    }
    AppContextService.prototype.setPageSource = function (url, sourceCache) {
        this.pageFileSource[url] = sourceCache;
    };
    AppContextService.prototype.cacheToArray = function (map) {
        return Object.keys(map).map(function (key) { return (tslib_1.__assign({ url: key }, map[key])); });
    };
    AppContextService.prototype.proxyFetch = function (url, init) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.resource.proxyFetch(url, tslib_1.__assign(tslib_1.__assign({}, init), { request: this.request })).then(function (res) {
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
        return fileCache.source;
    };
    AppContextService.prototype.registryMicroMiddler = function (middleware) {
        this.microMiddlewareList.push(middleware);
    };
    AppContextService.prototype.getPageFileSource = function () {
        return JSON.stringify(this.cacheToArray(this.pageFileSource));
    };
    AppContextService.prototype.getAllFileSource = function () {
        return JSON.stringify(this.cacheToArray(tslib_1.__assign(tslib_1.__assign({}, this.getContext().resource), this.pageFileSource)));
    };
    AppContextService.prototype.getPageMicroMiddleware = function () {
        return this.microMiddlewareList;
    };
    Object.defineProperty(AppContextService.prototype, "fetch", {
        get: function () {
            return this.proxyFetch.bind(this);
        },
        enumerable: false,
        configurable: true
    });
    AppContextService = tslib_1.__decorate([
        (0, di_1.Injectable)(),
        tslib_1.__metadata("design:paramtypes", [di_1.Injector])
    ], AppContextService);
    return AppContextService;
}(core_1.AppContextService));
exports.AppContextService = AppContextService;
