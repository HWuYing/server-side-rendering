import { __decorate, __metadata } from "tslib";
import { Injectable, Injector } from '@fm/di';
import { HttpClient } from '@fm/shared/common/http';
import { createMicroElementTemplate, templateZip } from '@fm/shared/micro';
import { AppContextService } from '@fm/shared/providers/app-context';
import { HISTORY } from '@fm/shared/token';
import { cloneDeep, isEmpty } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
let MicroManage = class MicroManage {
    http;
    injector;
    proxy;
    microCache = new Map();
    microStaticCache = new Map();
    appContext;
    constructor(http, injector) {
        this.http = http;
        this.injector = injector;
        this.appContext = this.injector.get(AppContextService);
        this.proxy = this.appContext.getContext().proxyHost;
    }
    bootstrapMicro(microName) {
        let subject = this.microCache.get(microName);
        const context = this.appContext.getContext();
        if (!subject) {
            const proxyMicroUrl = context.microSSRPath;
            const { location: { pathname } } = this.injector.get(HISTORY);
            const microPath = `/${proxyMicroUrl(microName, `/micro-ssr/${pathname}`)}`.replace(/[/]+/g, '/');
            subject = this.http.get(`${this.proxy}${microPath}`).pipe(catchError((error) => of({ html: `${microName}<br/>${error.message}`, styles: '' })), switchMap((microResult) => this.reeadLinkToStyles(microName, microResult)), map((microResult) => ({ microResult: this.createMicroTag(microName, microResult), microName })), shareReplay(1));
            subject.subscribe({ next: () => void (0), error: () => void (0) });
            this.appContext.registryMicroMidder(() => subject);
            this.microCache.set(microName, subject);
        }
        return of(null);
    }
    reeadLinkToStyles(microName, microResult) {
        const { links = [] } = microResult;
        return isEmpty(links) ? of(microResult) : forkJoin(links.map((href) => this.getLinkCache(`${this.proxy}${href}`))).pipe(map((styles) => ({ ...microResult, linkToStyles: styles })));
    }
    getLinkCache(href) {
        let linkSubject = this.microStaticCache.get(href);
        if (!linkSubject) {
            linkSubject = this.http.getText(href).pipe(shareReplay(1), map(cloneDeep));
            this.microStaticCache.set(href, linkSubject);
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
