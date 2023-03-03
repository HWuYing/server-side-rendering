import { __decorate, __metadata } from "tslib";
import { Injectable, Injector } from '@fm/di';
import { AppContextService } from '../../providers/app-context';
var History = /** @class */ (function () {
    function History(injector) {
        this.injector = injector;
        this.appContext = this.injector.get(AppContextService);
    }
    History.prototype.push = function () {
        void (0);
    };
    History.prototype.replace = function (url) {
        this._redirect = { url: url };
    };
    History.prototype.listen = function () {
        return function () { void (0); };
    };
    Object.defineProperty(History.prototype, "location", {
        get: function () {
            return this.appContext.getContext().location;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "redirect", {
        get: function () {
            return this._redirect;
        },
        enumerable: false,
        configurable: true
    });
    History = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Injector])
    ], History);
    return History;
}());
export { History };
