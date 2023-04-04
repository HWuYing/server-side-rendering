import { __assign, __decorate, __metadata } from "tslib";
import { AppContextService, createMicroElementTemplate, CustomHistory, HISTORY, templateZip } from '@fm/core';
import { Injectable, Injector, Prop } from '@fm/di';
import { cloneDeep, isEmpty } from 'lodash';
import { forkJoin, from, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { AppContextService as ServerAppContextService } from '../../providers/app-context';
import { RESOURCE } from '../../token';
var MicroManage = /** @class */ (function () {
    function MicroManage(injector) {
        this.injector = injector;
        this.microStaticCache = new Map();
        this.resource = this.injector.get(RESOURCE);
    }
    MicroManage.prototype.bootstrapMicro = function (microName) {
        var _this = this;
        var pathname = this.injector.get(HISTORY).location.pathname;
        var subject = this.fetchRequire(this.resource.getMicroPath(microName, pathname)).pipe(catchError(function (error) { return of({ html: "".concat(microName, "<br/>").concat(error.message), styles: '', error: error }); }), tap(function (microResult) { return _this.checkRedirect(microResult); }), switchMap(function (microResult) { return _this.reeadLinkToStyles(microName, microResult); }), map(function (microResult) { return ({ microResult: _this.createMicroTag(microName, microResult), microName: microName }); }), shareReplay(1));
        subject.subscribe({ next: function () { return void (0); }, error: function () { return void (0); } });
        this.appContext.registryMicroMidder(function () { return subject; });
        return of(null);
    };
    MicroManage.prototype.checkRedirect = function (_a) {
        var status = _a.status, redirectUrl = _a.redirectUrl;
        var isRedirect = status === '302';
        if (isRedirect) {
            this.injector.get(CustomHistory).redirect(redirectUrl);
        }
        return isRedirect;
    };
    MicroManage.prototype.reeadLinkToStyles = function (microName, microResult) {
        var _this = this;
        var _a = microResult.links, links = _a === void 0 ? [] : _a;
        if (isEmpty(links)) {
            return of(microResult);
        }
        return forkJoin(links.map(function (href) { return _this.getLinkCache(href); })).pipe(map(function (styles) { return (__assign(__assign({}, microResult), { linkToStyles: styles })); }));
    };
    MicroManage.prototype.getLinkCache = function (linkUrl) {
        var linkSubject = this.microStaticCache.get(linkUrl);
        if (!linkSubject) {
            linkSubject = this.fetchRequire(linkUrl, true).pipe(shareReplay(1), map(cloneDeep));
            this.microStaticCache.set(linkUrl, linkSubject);
        }
        return linkSubject;
    };
    MicroManage.prototype.createMicroTag = function (microName, microResult) {
        var html = microResult.html, styles = microResult.styles, linkToStyles = microResult.linkToStyles, _a = microResult.microTags, microTags = _a === void 0 ? [] : _a, error = microResult.error;
        var template = error ? '' : createMicroElementTemplate(microName, { initHtml: html, initStyle: styles, linkToStyles: linkToStyles });
        microTags.push(templateZip("<script id=\"create-".concat(microName, "-tag\">{template}\n          (function() {\n            const script = document.getElementById('create-").concat(microName, "-tag');\n            script.parentNode.removeChild(script)\n          })();\n        </script>"), { template: template }));
        return __assign(__assign({}, microResult), { html: '', links: [], styles: '', microTags: microTags });
    };
    MicroManage.prototype.fetchRequire = function (url, isText) {
        if (isText === void 0) { isText = false; }
        var init = { method: 'get', request: this.appContext.request };
        return from(this.resource.proxyFetch(url, init).then(function (res) { return isText ? res.text() : res.json(); }));
    };
    __decorate([
        Prop(AppContextService),
        __metadata("design:type", ServerAppContextService)
    ], MicroManage.prototype, "appContext", void 0);
    MicroManage = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Injector])
    ], MicroManage);
    return MicroManage;
}());
export { MicroManage };
