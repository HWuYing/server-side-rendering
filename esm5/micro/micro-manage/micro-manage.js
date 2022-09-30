import { __decorate, __metadata } from "tslib";
import { Injectable, Injector } from '@fm/di';
import { HttpClient } from '@fm/shared/common/http';
import { createMicroElementTemplate, templateZip } from '@fm/shared/micro';
import { AppContextService } from '@fm/shared/providers/app-context';
import { HISTORY } from '@fm/shared/token';
import { cloneDeep, isEmpty } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { RESOURCE } from '../../token';
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
        this.appContext = this.injector.get(AppContextService);
        this.resource = this.injector.get(RESOURCE);
    }
    bootstrapMicro(microName) {
        let subject = this.microCache.get(microName);
        if (!subject) {
            const { location: { pathname } } = this.injector.get(HISTORY);
            subject = this.http.get(this.resource.generateMicroPath(microName, pathname)).pipe(catchError((error) => of({ html: `${microName}<br/>${error.message}`, styles: '' })), switchMap((microResult) => this.reeadLinkToStyles(microName, microResult)), map((microResult) => ({ microResult: this.createMicroTag(microName, microResult), microName })), shareReplay(1));
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
        return forkJoin(links.map((href) => this.getLinkCache(href))).pipe(map((styles) => ({ ...microResult, linkToStyles: styles })));
    }
    getLinkCache(href) {
        const linkUrl = this.resource.generateMicroStaticpath(href);
        let linkSubject = this.microStaticCache.get(linkUrl);
        if (!linkSubject) {
            linkSubject = this.http.getText(linkUrl).pipe(shareReplay(1), map(cloneDeep));
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
        return { ...microResult, html: '', links: [], styles: '', microTags };
    }
};
MicroManage = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient, Injector])
], MicroManage);
export { MicroManage };
