import { __decorate, __metadata } from "tslib";
import { Injectable, Injector } from '@fm/di';
import { HISTORY, createMicroElementTemplate, AppContextService, templateZip } from '@fm/shared';
import { cloneDeep, isEmpty } from 'lodash';
import { forkJoin, from, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { RESOURCE } from '../../token';
let MicroManage = class MicroManage {
    constructor(injector) {
        this.injector = injector;
        this.microCache = new Map();
        this.microStaticCache = new Map();
        this.appContext = this.injector.get(AppContextService);
        this.resource = this.injector.get(RESOURCE);
    }
    bootstrapMicro(microName) {
        let subject = this.microCache.get(microName);
        if (!subject) {
            const { location: { pathname } } = this.injector.get(HISTORY);
            subject = this.fetchRequire(this.resource.generateMicroPath(microName, pathname)).pipe(catchError((error) => of({ html: `${microName}<br/>${error.message}`, styles: '' })), switchMap((microResult) => this.reeadLinkToStyles(microName, microResult)), map((microResult) => ({ microResult: this.createMicroTag(microName, microResult), microName })), shareReplay(1));
            subject.subscribe({ next: () => void (0), error: () => void (0) });
            this.appContext.registryMicroMidder(() => subject);
            this.microCache.set(microName, subject);
        }
        return of(null);
    }
    reeadLinkToStyles(microName, microResult) {
        const { links = [] } = microResult;
        if (isEmpty(links)) {
            return of(microResult);
        }
        return forkJoin(links.map((href) => this.getLinkCache(href))).pipe(map((styles) => (Object.assign(Object.assign({}, microResult), { linkToStyles: styles }))));
    }
    getLinkCache(href) {
        const linkUrl = this.resource.generateMicroStaticpath(href);
        let linkSubject = this.microStaticCache.get(linkUrl);
        if (!linkSubject) {
            linkSubject = this.fetchRequire(linkUrl, true).pipe(shareReplay(1), map(cloneDeep));
            this.microStaticCache.set(linkUrl, linkSubject);
        }
        return linkSubject;
    }
    createMicroTag(microName, microResult) {
        const { html, styles, linkToStyles, microTags = [] } = microResult;
        const template = createMicroElementTemplate(microName, { initHtml: html, initStyle: styles, linkToStyles });
        microTags.push(templateZip(`<script id="create-${microName}-tag">{template}
          (function() {
            const script = document.getElementById('create-${microName}-tag');
            script.parentNode.removeChild(script)
          })();
        </script>`, { template }));
        return Object.assign(Object.assign({}, microResult), { html: '', links: [], styles: '', microTags });
    }
    fetchRequire(url, isText) {
        return from(this.resource.proxyFetch(url, { method: 'get' }).then((res) => !isText ? res.json() : res.text()));
    }
};
MicroManage = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Injector])
], MicroManage);
export { MicroManage };
