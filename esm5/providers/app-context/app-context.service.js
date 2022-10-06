import { __decorate, __extends, __metadata, __param } from "tslib";
import { Inject, Injectable, Injector } from '@fm/di';
import { AppContextService as SharedAppContextService } from '@fm/shared/providers/app-context';
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
    AppContextService.prototype.readStaticFile = function (url) {
        var fileCache = this.resource.readStaticFile(url);
        this.pageFileSource[url] = fileCache;
        return of(fileCache.source);
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
    AppContextService = __decorate([
        Injectable(),
        __param(0, Inject(Injector)),
        __metadata("design:paramtypes", [Injector])
    ], AppContextService);
    return AppContextService;
}(SharedAppContextService));
export { AppContextService };
