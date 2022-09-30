"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContextService = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@fm/di");
const app_context_1 = require("@fm/shared/providers/app-context");
const token_1 = require("@fm/ssr/token");
const rxjs_1 = require("rxjs");
let AppContextService = class AppContextService extends app_context_1.AppContextService {
    resource;
    pageFileSource = {};
    microMiddlewareList = [];
    constructor(injector) {
        super(injector);
        this.resource = this.injector.get(token_1.RESOURCE);
    }
    readStaticFile(url) {
        const fileCache = this.resource.readStaticFile(url);
        this.pageFileSource[url] = fileCache;
        return (0, rxjs_1.of)(fileCache.source);
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
AppContextService = tslib_1.__decorate([
    (0, di_1.Injectable)(),
    tslib_1.__param(0, (0, di_1.Inject)(di_1.Injector)),
    tslib_1.__metadata("design:paramtypes", [di_1.Injector])
], AppContextService);
exports.AppContextService = AppContextService;
