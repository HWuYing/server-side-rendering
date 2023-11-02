"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.History = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var app_context_1 = require("../../providers/app-context");
var History = /** @class */ (function () {
    function History(appContext) {
        this.appContext = appContext;
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
    History = tslib_1.__decorate([
        (0, di_1.Injectable)(),
        tslib_1.__metadata("design:paramtypes", [app_context_1.AppContextService])
    ], History);
    return History;
}());
exports.History = History;
