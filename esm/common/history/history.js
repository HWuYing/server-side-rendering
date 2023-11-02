import { __decorate, __metadata } from "tslib";
import { Injectable } from '@fm/di';
import { AppContextService } from '../../providers/app-context';
let History = class History {
    constructor(appContext) {
        this.appContext = appContext;
    }
    push() {
        void (0);
    }
    replace(url) {
        this._redirect = { url };
    }
    listen() {
        return () => { void (0); };
    }
    get location() {
        return this.appContext.getContext().location;
    }
    get redirect() {
        return this._redirect;
    }
};
History = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AppContextService])
], History);
export { History };
