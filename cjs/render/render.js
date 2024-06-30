"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Render = void 0;
var tslib_1 = require("tslib");
var fs_1 = tslib_1.__importDefault(require("fs"));
var module_1 = require("module");
var vm_1 = tslib_1.__importDefault(require("vm"));
var resource_1 = require("./resource");
var Render = /** @class */ (function () {
    function Render(options) {
        this.resource = new resource_1.Resource(options);
    }
    Render.prototype.factoryVmScript = function () {
        var _this = this;
        var entryFile = this.resource.entryFile;
        var registryRender = function (render) { return _this._compiledRender = render; };
        var m = { exports: {}, require: (0, module_1.createRequire)(entryFile) };
        var wrapper = module_1.Module.wrap(fs_1.default.readFileSync(entryFile, 'utf-8'));
        var script = new vm_1.default.Script(wrapper, { filename: 'server-entry.js' });
        var timerContext = { setTimeout: setTimeout, setInterval: setInterval, clearInterval: clearInterval, clearTimeout: clearTimeout };
        var vmContext = tslib_1.__assign(tslib_1.__assign({ Buffer: Buffer, process: process, console: console, registryRender: registryRender }, timerContext), this.resource.vmContext);
        var compiledScript = script.runInNewContext(vm_1.default.createContext(vmContext), { displayErrors: true });
        compiledScript(m.exports, m.require, m);
    };
    Render.prototype._render = function (request, isMicro) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (this.resource.isDevelopment || !this._compiledRender) {
                            this.factoryVmScript();
                        }
                        return [4 /*yield*/, this._compiledRender({ resource: this.resource, request: request }, isMicro)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, { html: e_1.message, styles: '' }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Render.prototype.createScriptTemplate = function (scriptId, insertInfo) {
        var evalFun = "(function(){const script = document.querySelector('#".concat(scriptId, "');script.parentNode.removeChild(script);}());");
        return "<script id=\"".concat(scriptId, "\">").concat(insertInfo).concat(evalFun, "</script>");
    };
    Render.prototype.renderMicro = function (request) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, status, redirectUrl, html, styles, links, microTags, _b, microFetchData, fetchData;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._render(request, true)];
                    case 1:
                        _a = _c.sent(), status = _a.status, redirectUrl = _a.redirectUrl, html = _a.html, styles = _a.styles, links = _a.links, microTags = _a.microTags, _b = _a.microFetchData, microFetchData = _b === void 0 ? [] : _b, fetchData = _a.fetchData;
                        microFetchData.push({ microName: this.resource.microName, source: fetchData });
                        return [2 /*return*/, { status: status, redirectUrl: redirectUrl, html: html, styles: styles, links: links, microTags: microTags, microFetchData: microFetchData }];
                }
            });
        });
    };
    Render.prototype.render = function (request) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, _a, isDevelopment, innerHtmlFlag, innerHeadFlag, status, redirectUrl, _b, js, _c, links, styles, _d, microTags, _e, microFetchData, fetchData, microData, chunkCss, chunkLinks, headContent, html;
            var _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, this._render(request)];
                    case 1:
                        result = _g.sent();
                        _a = this.resource, isDevelopment = _a.isDevelopment, innerHtmlFlag = _a.innerHtmlFlag, innerHeadFlag = _a.innerHeadFlag;
                        status = result.status, redirectUrl = result.redirectUrl, _b = result.js, js = _b === void 0 ? [] : _b, _c = result.links, links = _c === void 0 ? [] : _c, styles = result.styles, _d = result.microTags, microTags = _d === void 0 ? [] : _d, _e = result.microFetchData, microFetchData = _e === void 0 ? [] : _e;
                        fetchData = this.createScriptTemplate('fetch-static', "var fetchCacheData = ".concat(result.fetchData, ";"));
                        microData = this.createScriptTemplate('micro-fetch-static', "var microFetchData = ".concat(JSON.stringify(microFetchData), ";"));
                        chunkCss = isDevelopment ? links : ((_f = this.resource.readAssetsSync()['chunk']) === null || _f === void 0 ? void 0 : _f.css) || [];
                        chunkLinks = chunkCss.map(function (href) { return "<link href=\"".concat(href, "\" rel=\"stylesheet\">"); }).join('');
                        headContent = "".concat(chunkLinks).concat(styles).concat(fetchData).concat(microData).concat(microTags.join(''));
                        if (isDevelopment) {
                            headContent += js.map(function (src) { return "<script defer src=\"".concat(src, "\"></script>"); }).join('');
                        }
                        html = this.resource.generateHtmlTemplate()
                            .replace(innerHtmlFlag, result.html)
                            .replace(innerHeadFlag, headContent);
                        return [2 /*return*/, { html: html, status: status, redirectUrl: redirectUrl }];
                }
            });
        });
    };
    return Render;
}());
exports.Render = Render;
