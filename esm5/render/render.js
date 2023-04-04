import { __assign, __awaiter, __generator } from "tslib";
import fs from 'fs';
import { createRequire, Module as NativeModule } from 'module';
import vm from 'vm';
import { Resource } from './resource';
var Render = /** @class */ (function () {
    function Render(options) {
        this.resource = new Resource(options);
    }
    Render.prototype.factoryVmScript = function () {
        var _this = this;
        var entryFile = this.resource.entryFile;
        var registryRender = function (render) { return _this._compiledRender = render; };
        var m = { exports: {}, require: createRequire(entryFile) };
        var wrapper = NativeModule.wrap(fs.readFileSync(entryFile, 'utf-8'));
        var script = new vm.Script(wrapper, { filename: 'server-entry.js' });
        var timerContext = { setTimeout: setTimeout, setInterval: setInterval, clearInterval: clearInterval, clearTimeout: clearTimeout };
        var vmContext = __assign(__assign({ Buffer: Buffer, process: process, console: console, registryRender: registryRender }, timerContext), this.resource.vmContext);
        var compiledScript = script.runInNewContext(vm.createContext(vmContext), { displayErrors: true });
        compiledScript(m.exports, m.require, m);
    };
    Render.prototype._render = function (request, isMicro) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _a, status, redirectUrl, html, styles, links, microTags, _b, microFetchData, fetchData;
            return __generator(this, function (_c) {
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
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result, _b, isDevelopment, innerHtmlFlag, innerHeadFlag, status, redirectUrl, _c, js, _d, links, styles, _e, microTags, _f, microFetchData, fetchData, microData, chunkCss, chunkLinks, headContent, html;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, this._render(request)];
                    case 1:
                        result = _g.sent();
                        _b = this.resource, isDevelopment = _b.isDevelopment, innerHtmlFlag = _b.innerHtmlFlag, innerHeadFlag = _b.innerHeadFlag;
                        status = result.status, redirectUrl = result.redirectUrl, _c = result.js, js = _c === void 0 ? [] : _c, _d = result.links, links = _d === void 0 ? [] : _d, styles = result.styles, _e = result.microTags, microTags = _e === void 0 ? [] : _e, _f = result.microFetchData, microFetchData = _f === void 0 ? [] : _f;
                        fetchData = this.createScriptTemplate('fetch-static', "var fetchCacheData = ".concat(result.fetchData, ";"));
                        microData = this.createScriptTemplate('micro-fetch-static', "var microFetchData = ".concat(JSON.stringify(microFetchData), ";"));
                        chunkCss = isDevelopment ? links : ((_a = this.resource.readAssetsSync()['chunk']) === null || _a === void 0 ? void 0 : _a.css) || [];
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
export { Render };
