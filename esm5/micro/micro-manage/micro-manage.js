import { __assign, __decorate, __metadata } from "tslib";
import { Injectable, Injector } from '@fm/di';
import { HttpClient } from '@fm/shared/common/http';
import { createMicroElementTemplate, templateZip } from '@fm/shared/micro';
import { AppContextService } from '@fm/shared/providers/app-context';
import { HISTORY } from '@fm/shared/token';
import { cloneDeep, isEmpty } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { RESOURCE } from '../../token';
var MicroManage = /** @class */ (function () {
    function MicroManage(http, injector) {
        this.http = http;
        this.injector = injector;
        this.microCache = new Map();
        this.microStaticCache = new Map();
        this.appContext = this.injector.get(AppContextService);
        this.resource = this.injector.get(RESOURCE);
    }
    MicroManage.prototype.bootstrapMicro = function (microName) {
        var _this = this;
        var subject = this.microCache.get(microName);
        if (!subject) {
            var pathname = this.injector.get(HISTORY).location.pathname;
            subject = this.http.get(this.resource.generateMicroPath(microName, pathname)).pipe(catchError(function (error) { return of({ html: "".concat(microName, "<br/>").concat(error.message), styles: '' }); }), switchMap(function (microResult) { return _this.reeadLinkToStyles(microName, microResult); }), map(function (microResult) { return ({ microResult: _this.createMicroTag(microName, microResult), microName: microName }); }), shareReplay(1));
            subject.subscribe({ next: function () { return void (0); }, error: function () { return void (0); } });
            this.appContext.registryMicroMidder(function () { return subject; });
            this.microCache.set(microName, subject);
        }
        return of(null);
    };
    MicroManage.prototype.reeadLinkToStyles = function (microName, microResult) {
        var _this = this;
        var _a = microResult.links, links = _a === void 0 ? [] : _a;
        if (isEmpty(links)) {
            return of(microResult);
        }
        return forkJoin(links.map(function (href) { return _this.getLinkCache(href); })).pipe(map(function (styles) { return (__assign(__assign({}, microResult), { linkToStyles: styles })); }));
    };
    MicroManage.prototype.getLinkCache = function (href) {
        var linkUrl = this.resource.generateMicroStaticpath(href);
        var linkSubject = this.microStaticCache.get(linkUrl);
        if (!linkSubject) {
            linkSubject = this.http.getText(linkUrl).pipe(shareReplay(1), map(cloneDeep));
            this.microStaticCache.set(linkUrl, linkSubject);
        }
        return linkSubject;
    };
    MicroManage.prototype.createMicroTag = function (microName, microResult) {
        var html = microResult.html, styles = microResult.styles, linkToStyles = microResult.linkToStyles, _a = microResult.microTags, microTags = _a === void 0 ? [] : _a;
        var template = createMicroElementTemplate(microName, { initHtml: html, initStyle: styles, linkToStyles: linkToStyles });
        microTags.push(templateZip("<script id=\"create-".concat(microName, "-tag\">{template}\n          (function() {\n            const script = document.getElementById('create-").concat(microName, "-tag');\n            script.parentNode.removeChild(script)\n          })();\n        </script>"), { template: template }));
        return __assign(__assign({}, microResult), { html: '', links: [], styles: '', microTags: microTags });
    };
    MicroManage = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Injector])
    ], MicroManage);
    return MicroManage;
}());
export { MicroManage };
