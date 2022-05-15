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
let MicroManage = class MicroManage {
    http;
    ls;
    proxy;
    microCache = new Map();
    microStaticCache = new Map();
    appContext;
    constructor(http, ls) {
        this.http = http;
        this.ls = ls;
        this.appContext = this.ls.getProvider(app_context_1.AppContextService);
        this.proxy = this.appContext.getContext().proxyHost;
    }
    bootstrapMicro(microName) {
        let subject = this.microCache.get(microName);
        const context = this.appContext.getContext();
        if (!subject) {
            const proxyMicroUrl = context.microSSRPath;
            const { location: { pathname } } = this.ls.getProvider(token_1.HISTORY);
            const microPath = `/${proxyMicroUrl(microName, `/micro-ssr/${pathname}`)}`.replace(/[/]+/g, '/');
            subject = this.http.get(`${this.proxy}${microPath}`).pipe((0, operators_1.catchError)((error) => (0, rxjs_1.of)({ html: `${microName}<br/>${error.message}`, styles: '' })), (0, operators_1.switchMap)((microResult) => this.reeadLinkToStyles(microName, microResult)), (0, operators_1.map)((microResult) => ({ microResult: this.createMicroTag(microName, microResult), microName })), (0, operators_1.shareReplay)(1));
            subject.subscribe(() => void (0), () => void (0));
            this.appContext.registryMicroMidder(() => subject);
            this.microCache.set(microName, subject);
        }
        return (0, rxjs_1.of)(null);
    }
    reeadLinkToStyles(microName, microResult) {
        const { links = [] } = microResult;
        return (0, lodash_1.isEmpty)(links) ? (0, rxjs_1.of)(microResult) : (0, rxjs_1.forkJoin)(links.map((href) => this.getLinkCache(`${this.proxy}${href}`))).pipe((0, operators_1.map)((styles) => ({ ...microResult, linkToStyles: styles })));
    }
    getLinkCache(href) {
        let linkSubject = this.microStaticCache.get(href);
        if (!linkSubject) {
            linkSubject = this.http.getText(href).pipe((0, operators_1.shareReplay)(1), (0, operators_1.map)(lodash_1.cloneDeep));
            this.microStaticCache.set(href, linkSubject);
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
    tslib_1.__metadata("design:paramtypes", [http_1.HttpClient, di_1.LocatorStorage])
], MicroManage);
exports.MicroManage = MicroManage;
