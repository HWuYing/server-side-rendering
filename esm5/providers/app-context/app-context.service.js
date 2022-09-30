import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable, Injector } from '@fm/di';
import { AppContextService as SharedAppContextService } from '@fm/shared/providers/app-context';
import { RESOURCE } from '@fm/ssr/token';
import { of } from 'rxjs';
let AppContextService = class AppContextService extends SharedAppContextService {
    resource;
    pageFileSource = {};
    microMiddlewareList = [];
    constructor(injector) {
        super(injector);
        this.resource = this.injector.get(RESOURCE);
    }
    readStaticFile(url) {
        const fileCache = this.resource.readStaticFile(url);
        this.pageFileSource[url] = fileCache;
        return of(fileCache.source);
    }
    registryMicroMidder(middleware) {
        this.microMiddlewareList.push(middleware);
    }
    getPageFileSource() {
        return JSON.stringify(this.pageFileSource);
    }
    getAllFileSource() {
        return JSON.stringify(this.getContext().resource);
    }
    getpageMicroMiddleware() {
        return this.microMiddlewareList;
    }
};
AppContextService = __decorate([
    Injectable(),
    __param(0, Inject(Injector)),
    __metadata("design:paramtypes", [Injector])
], AppContextService);
export { AppContextService };
