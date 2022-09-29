"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContextService = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@fm/di");
const app_context_1 = require("@fm/shared/providers/app-context");
const rxjs_1 = require("rxjs");
let AppContextService = class AppContextService extends app_context_1.AppContextService {
    pageFileSource = {};
    microMiddlewareList = [];
    readStaticFile(url) {
        const { resource, readStaticFile } = this.getContext();
        const source = JSON.parse(readStaticFile(url) || '{}');
        const fileCache = { type: 'file-static', source };
        this.pageFileSource[url] = fileCache;
        resource[url] = fileCache;
        return (0, rxjs_1.of)(source);
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
    (0, di_1.Injectable)()
], AppContextService);
exports.AppContextService = AppContextService;
