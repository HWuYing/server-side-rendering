"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroManage = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var http_1 = require("@fm/shared/common/http");
var micro_1 = require("@fm/shared/micro");
var app_context_1 = require("@fm/shared/providers/app-context");
var token_1 = require("@fm/shared/token");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var token_2 = require("../../token");
var MicroManage = /** @class */ (function () {
    function MicroManage(http, injector) {
        this.http = http;
        this.injector = injector;
        this.microCache = new Map();
        this.microStaticCache = new Map();
        this.appContext = this.injector.get(app_context_1.AppContextService);
        this.resource = this.injector.get(token_2.RESOURCE);
    }
    MicroManage.prototype.bootstrapMicro = function (microName) {
        var _this = this;
        var subject = this.microCache.get(microName);
        if (!subject) {
            var pathname = this.injector.get(token_1.HISTORY).location.pathname;
            subject = this.http.get(this.resource.generateMicroPath(microName, pathname)).pipe((0, operators_1.catchError)(function (error) { return (0, rxjs_1.of)({ html: "".concat(microName, "<br/>").concat(error.message), styles: '' }); }), (0, operators_1.switchMap)(function (microResult) { return _this.reeadLinkToStyles(microName, microResult); }), (0, operators_1.map)(function (microResult) { return ({ microResult: _this.createMicroTag(microName, microResult), microName: microName }); }), (0, operators_1.shareReplay)(1));
            subject.subscribe({ next: function () { return void (0); }, error: function () { return void (0); } });
            this.appContext.registryMicroMidder(function () { return subject; });
            this.microCache.set(microName, subject);
        }
        return (0, rxjs_1.of)(null);
    };
    MicroManage.prototype.reeadLinkToStyles = function (microName, microResult) {
        var _this = this;
        var _a = microResult.links, links = _a === void 0 ? [] : _a;
        if ((0, lodash_1.isEmpty)(links)) {
            return (0, rxjs_1.of)(microResult);
        }
        return (0, rxjs_1.forkJoin)(links.map(function (href) { return _this.getLinkCache(href); })).pipe((0, operators_1.map)(function (styles) { return (tslib_1.__assign(tslib_1.__assign({}, microResult), { linkToStyles: styles })); }));
    };
    MicroManage.prototype.getLinkCache = function (href) {
        var linkUrl = this.resource.generateMicroStaticpath(href);
        var linkSubject = this.microStaticCache.get(linkUrl);
        if (!linkSubject) {
            linkSubject = this.http.getText(linkUrl).pipe((0, operators_1.shareReplay)(1), (0, operators_1.map)(lodash_1.cloneDeep));
            this.microStaticCache.set(linkUrl, linkSubject);
        }
        return linkSubject;
    };
    MicroManage.prototype.createMicroTag = function (microName, microResult) {
        var html = microResult.html, styles = microResult.styles, linkToStyles = microResult.linkToStyles, _a = microResult.microTags, microTags = _a === void 0 ? [] : _a;
        var template = (0, micro_1.createMicroElementTemplate)(microName, { initHtml: html, initStyle: styles, linkToStyles: linkToStyles });
        microTags.push((0, micro_1.templateZip)("<script id=\"create-".concat(microName, "-tag\">{template}\n          (function() {\n            const script = document.getElementById('create-").concat(microName, "-tag');\n            script.parentNode.removeChild(script)\n          })();\n        </script>"), { template: template }));
        return tslib_1.__assign(tslib_1.__assign({}, microResult), { html: '', links: [], styles: '', microTags: microTags });
    };
    MicroManage = tslib_1.__decorate([
        (0, di_1.Injectable)(),
        tslib_1.__metadata("design:paramtypes", [http_1.HttpClient, di_1.Injector])
    ], MicroManage);
    return MicroManage;
}());
exports.MicroManage = MicroManage;
