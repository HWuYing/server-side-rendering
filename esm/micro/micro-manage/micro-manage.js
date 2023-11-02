import { __decorate, __metadata } from "tslib";
import { AppContextService, createMicroElementTemplate, CustomHistory, HISTORY, templateZip } from '@fm/core';
import { Inject, Injectable, Injector } from '@fm/di';
import { cloneDeep, isEmpty } from 'lodash';
import { forkJoin, from, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { AppContextService as ServerAppContextService } from '../../providers/app-context';
import { RESOURCE } from '../../token';
let MicroManage = class MicroManage {
    constructor(injector) {
        this.injector = injector;
        this.microStaticCache = new Map();
        this.resource = this.injector.get(RESOURCE);
    }
    bootstrapMicro(microName) {
        const { location: { pathname, search } } = this.injector.get(HISTORY);
        const url = this.resource.getMicroPath(microName, pathname) + search;
        const subject = this.fetchRequire(url, { headers: { 'server-side-render': true } }).pipe(catchError((error) => of({ html: `${microName}<br/>${error.message}`, styles: '', error })), tap((microResult) => this.checkRedirect(microResult)), switchMap((microResult) => this.readLinkToStyles(microName, microResult)), map((microResult) => ({ microResult: this.createMicroTag(microName, microResult), microName })), shareReplay(1));
        subject.subscribe({ next: () => void (0), error: () => void (0) });
        this.appContext.registryMicroMiddler(() => subject);
        return of(null);
    }
    checkRedirect({ status, redirectUrl }) {
        const isRedirect = status === '302';
        if (isRedirect) {
            this.injector.get(CustomHistory).redirect(redirectUrl);
        }
        return isRedirect;
    }
    readLinkToStyles(microName, microResult) {
        const { links = [] } = microResult;
        if (isEmpty(links)) {
            return of(microResult);
        }
        return forkJoin(links.map((href) => this.getLinkCache(href))).pipe(map((styles) => (Object.assign(Object.assign({}, microResult), { linkToStyles: styles }))));
    }
    getLinkCache(linkUrl) {
        let linkSubject = this.microStaticCache.get(linkUrl);
        if (!linkSubject) {
            linkSubject = this.fetchRequire(linkUrl, undefined, true).pipe(shareReplay(1), map(cloneDeep));
            this.microStaticCache.set(linkUrl, linkSubject);
        }
        return linkSubject;
    }
    createMicroTag(microName, microResult) {
        const { html, styles, linkToStyles, microTags = [], error } = microResult;
        const template = error ? '' : createMicroElementTemplate(microName, { initHtml: html, initStyle: styles, linkToStyles });
        microTags.push(templateZip(`<script id="create-${microName}-tag">{template}
          (function() {
            const script = document.getElementById('create-${microName}-tag');
            script.parentNode.removeChild(script)
          })();
        </script>`, { template }));
        return Object.assign(Object.assign({}, microResult), { html: '', links: [], styles: '', microTags });
    }
    fetchRequire(url, options = {}, isText = false) {
        const init = Object.assign(Object.assign({ method: 'get' }, options), { request: this.appContext.request });
        return from(this.resource.proxyFetch(url, init).then((res) => isText ? res.text() : res.json()));
    }
};
__decorate([
    Inject(AppContextService),
    __metadata("design:type", ServerAppContextService)
], MicroManage.prototype, "appContext", void 0);
MicroManage = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Injector])
], MicroManage);
export { MicroManage };
