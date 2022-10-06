"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Render = void 0;
var tslib_1 = require("tslib");
var fs_1 = tslib_1.__importDefault(require("fs"));
var module_1 = require("module");
var vm_1 = tslib_1.__importDefault(require("vm"));
var Render = /** @class */ (function () {
    function Render(entryFile, options) {
        this.entryFile = entryFile;
        this.isDevelopment = process.env.NODE_ENV === 'development';
        var resource = options.resource, _a = options.microName, microName = _a === void 0 ? '' : _a, _b = options.vmContext, vmContext = _b === void 0 ? {} : _b;
        this.resource = resource;
        this.microName = microName;
        this.vmContext = vmContext;
    }
    Render.prototype.factoryVmScript = function () {
        var _this = this;
        var registryRender = function (render) { return _this._compiledRender = render; };
        var m = { exports: {}, require: (0, module_1.createRequire)(this.entryFile) };
        var wrapper = module_1.Module.wrap(fs_1.default.readFileSync(this.entryFile, 'utf-8'));
        var script = new vm_1.default.Script(wrapper, { filename: 'server-entry.js', displayErrors: true });
        var timerContext = { setTimeout: setTimeout, setInterval: setInterval, clearInterval: clearInterval, clearTimeout: clearTimeout };
        var vmContext = tslib_1.__assign(tslib_1.__assign({ Buffer: Buffer, process: process, console: console, registryRender: registryRender }, timerContext), this.vmContext);
        var compiledWrapper = script.runInContext(vm_1.default.createContext(vmContext));
        compiledWrapper(m.exports, m.require, m);
    };
    Render.prototype._render = function (request, isMicro) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (this.isDevelopment || !this._compiledRender) {
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
        var evalFun = "(function(){ const script = document.querySelector('#".concat(scriptId, "');script.parentNode.removeChild(script);}());");
        return "<script id=\"".concat(scriptId, "\">").concat(insertInfo).concat(evalFun, "</script>");
    };
    Render.prototype.renderMicro = function (request) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, html, styles, links, fetchData, microTags, _b, microFetchData;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._render(request, true)];
                    case 1:
                        _a = _c.sent(), html = _a.html, styles = _a.styles, links = _a.links, fetchData = _a.fetchData, microTags = _a.microTags, _b = _a.microFetchData, microFetchData = _b === void 0 ? [] : _b;
                        microFetchData.push({ microName: this.microName, source: fetchData });
                        return [2 /*return*/, { html: html, styles: styles, links: links, microTags: microTags, microFetchData: microFetchData }];
                }
            });
        });
    };
    Render.prototype.render = function (request) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _b, _c, js, _d, links, html, styles, fetchData, _e, microTags, _f, microFetchData, _fetchData, microData, chunkCss, chunkLinks, headContent;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, this._render(request)];
                    case 1:
                        _b = _g.sent(), _c = _b.js, js = _c === void 0 ? [] : _c, _d = _b.links, links = _d === void 0 ? [] : _d, html = _b.html, styles = _b.styles, fetchData = _b.fetchData, _e = _b.microTags, microTags = _e === void 0 ? [] : _e, _f = _b.microFetchData, microFetchData = _f === void 0 ? [] : _f;
                        _fetchData = this.createScriptTemplate('fetch-static', "var fetchCacheData = ".concat(fetchData, ";"));
                        microData = this.createScriptTemplate('micro-fetch-static', "var microFetchData = ".concat(JSON.stringify(microFetchData), ";"));
                        chunkCss = this.isDevelopment ? links : ((_a = this.resource.readAssetsSync()['chunk']) === null || _a === void 0 ? void 0 : _a.css) || [];
                        chunkLinks = chunkCss.map(function (href) { return "<link href=\"".concat(href, "\" rel=\"stylesheet\">"); }).join('');
                        headContent = "".concat(chunkLinks).concat(styles).concat(_fetchData).concat(microData).concat(microTags.join(''));
                        if (this.isDevelopment) {
                            headContent += js.map(function (src) { return "<script defer src=\"".concat(src, "\"></script>"); }).join('');
                        }
                        return [2 /*return*/, this.resource.generateHtmlTemplate()
                                .replace(this.resource.innerHtmlFlag, html)
                                .replace(this.resource.innerHeadFlag, headContent)];
                }
            });
        });
    };
    return Render;
}());
exports.Render = Render;
