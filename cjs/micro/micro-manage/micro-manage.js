"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroManage = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@fm/di");
const http_1 = require("@fm/shared/common/http");
const micro_1 = require("@fm/shared/micro");
const app_context_1 = require("@fm/shared/providers/app-context");
const token_1 = require("@fm/shared/token");
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const token_2 = require("../../token");
let MicroManage = class MicroManage {
    http;
    injector;
    resource;
    microCache = new Map();
    microStaticCache = new Map();
    appContext;
    constructor(http, injector) {
        this.http = http;
        this.injector = injector;
        this.appContext = this.injector.get(app_context_1.AppContextService);
        this.resource = this.injector.get(token_2.RESOURCE);
    }
    bootstrapMicro(microName) {
        let subject = this.microCache.get(microName);
        if (!subject) {
            const { location: { pathname } } = this.injector.get(token_1.HISTORY);
            subject = this.http.get(this.resource.generateMicroPath(microName, pathname)).pipe((0, operators_1.catchError)((error) => (0, rxjs_1.of)({ html: `${microName}<br/>${error.message}`, styles: '' })), (0, operators_1.switchMap)((microResult) => this.reeadLinkToStyles(microName, microResult)), (0, operators_1.map)((microResult) => ({ microResult: this.createMicroTag(microName, microResult), microName })), (0, operators_1.shareReplay)(1));
            subject.subscribe({ next: () => void (0), error: () => void (0) });
            this.appContext.registryMicroMidder(() => subject);
            this.microCache.set(microName, subject);
        }
        return (0, rxjs_1.of)(null);
    }
    reeadLinkToStyles(microName, microResult) {
        const { links = [] } = microResult;
        if ((0, lodash_1.isEmpty)(links)) {
            return (0, rxjs_1.of)(microResult);
        }
        return (0, rxjs_1.forkJoin)(links.map((href) => this.getLinkCache(href))).pipe((0, operators_1.map)((styles) => ({ ...microResult, linkToStyles: styles })));
    }
    getLinkCache(href) {
        const linkUrl = this.resource.generateMicroStaticpath(href);
        let linkSubject = this.microStaticCache.get(linkUrl);
        if (!linkSubject) {
            linkSubject = this.http.getText(linkUrl).pipe((0, operators_1.shareReplay)(1), (0, operators_1.map)(lodash_1.cloneDeep));
            this.microStaticCache.set(linkUrl, linkSubject);
        }
        return linkSubject;
    }
    createMicroTag(microName, microResult) {
        const { html, styles, linkToStyles, microTags = [] } = microResult;
        const template = (0, micro_1.createMicroElementTemplate)(microName, { initHtml: html, initStyle: styles, linkToStyles });
        microTags.push((0, micro_1.templateZip)(`<script id="create-${microName}-tag">{template}
          (function() {
            const script = document.getElementById('create-${microName}-tag');
            script.parentNode.removeChild(script)
          })();
        </script>`, { template }));
        return { ...microResult, html: '', links: [], styles: '', microTags };
    }
};
MicroManage = tslib_1.__decorate([
    (0, di_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [http_1.HttpClient, di_1.Injector])
], MicroManage);
exports.MicroManage = MicroManage;
