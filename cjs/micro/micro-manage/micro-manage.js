"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroManage = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var core_1 = require("@fm/core");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var token_1 = require("../../token");
var MicroManage = /** @class */ (function () {
    function MicroManage(injector) {
        this.injector = injector;
        this.microStaticCache = new Map();
        this.appContext = this.injector.get(core_1.AppContextService);
        this.resource = this.injector.get(token_1.RESOURCE);
    }
    MicroManage.prototype.bootstrapMicro = function (microName) {
        var _this = this;
        var pathname = this.injector.get(core_1.HISTORY).location.pathname;
        var subject = this.fetchRequire(this.resource.generateMicroPath(microName, pathname)).pipe((0, operators_1.catchError)(function (error) { return (0, rxjs_1.of)({ html: "".concat(microName, "<br/>").concat(error.message), styles: '', error: error }); }), (0, operators_1.tap)(function (microResult) { return _this.checkRedirect(microResult); }), (0, operators_1.switchMap)(function (microResult) { return _this.reeadLinkToStyles(microName, microResult); }), (0, operators_1.map)(function (microResult) { return ({ microResult: _this.createMicroTag(microName, microResult), microName: microName }); }), (0, operators_1.shareReplay)(1));
        subject.subscribe({ next: function () { return void (0); }, error: function () { return void (0); } });
        this.appContext.registryMicroMidder(function () { return subject; });
        return (0, rxjs_1.of)(null);
    };
    MicroManage.prototype.checkRedirect = function (_a) {
        var status = _a.status, redirectUrl = _a.redirectUrl;
        var isRedirect = status === '302';
        if (isRedirect) {
            this.injector.get(core_1.SharedHistory).redirect(redirectUrl);
        }
        return isRedirect;
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
            linkSubject = this.fetchRequire(linkUrl, true).pipe((0, operators_1.shareReplay)(1), (0, operators_1.map)(lodash_1.cloneDeep));
            this.microStaticCache.set(linkUrl, linkSubject);
        }
        return linkSubject;
    };
    MicroManage.prototype.createMicroTag = function (microName, microResult) {
        var html = microResult.html, styles = microResult.styles, linkToStyles = microResult.linkToStyles, _a = microResult.microTags, microTags = _a === void 0 ? [] : _a, error = microResult.error;
        var template = error ? '' : (0, core_1.createMicroElementTemplate)(microName, { initHtml: html, initStyle: styles, linkToStyles: linkToStyles });
        microTags.push((0, core_1.templateZip)("<script id=\"create-".concat(microName, "-tag\">{template}\n          (function() {\n            const script = document.getElementById('create-").concat(microName, "-tag');\n            script.parentNode.removeChild(script)\n          })();\n        </script>"), { template: template }));
        return tslib_1.__assign(tslib_1.__assign({}, microResult), { html: '', links: [], styles: '', microTags: microTags });
    };
    MicroManage.prototype.fetchRequire = function (url, isText) {
        return (0, rxjs_1.from)(this.resource.proxyFetch(url, { method: 'get' }).then(function (res) { return !isText ? res.json() : res.text(); }));
    };
    MicroManage = tslib_1.__decorate([
        (0, di_1.Injectable)(),
        tslib_1.__metadata("design:paramtypes", [di_1.Injector])
    ], MicroManage);
    return MicroManage;
}());
exports.MicroManage = MicroManage;
