import { __awaiter, __decorate, __generator, __metadata, __spreadArray } from "tslib";
import { Inject, Injectable, InjectorToken } from '@hwy-fm/di';
import { Input } from '@hwy-fm/server';
import fs from 'fs';
import path from 'path';
export var PUBLIC_PATH = 'static';
export var MICRO_RENDER_PATH = 'micro-ssr';
export var SSR_FETCH = InjectorToken.get('SSR_FETCH');
export var SSR_STATIC_FOLDER = InjectorToken.get('SSR_STATIC_FOLDER');
var Resource = /** @class */ (function () {
    function Resource() {
        this.config = {};
        this.filesCache = {};
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }
    Resource.prototype.staticResolve = function (_path) {
        var other = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            other[_i - 1] = arguments[_i];
        }
        return /^\\.[.]*/.test(_path) ? _path : path.join.apply(path, __spreadArray([this.staticFolder, _path], other, false));
    };
    Resource.prototype.readFileSync = function (filePath) {
        if (!filePath)
            return;
        var absPath = this.staticResolve(filePath);
        if (!fs.existsSync(absPath)) {
            console.error("File not found: ".concat(absPath));
            return;
        }
        return fs.readFileSync(absPath, { encoding: 'utf-8' });
    };
    Resource.prototype.fetch = function (url, init) {
        var _url = url;
        if (typeof url === 'string') {
            _url = /^http(s?)/.test(url) ? url : "".concat(this.config.proxyHost, "/").concat(url.replace(/^[/]+/, ''));
        }
        return this.ssrFetch(_url, init);
    };
    Resource.prototype.getMicroPath = function (microName, pathname) {
        var _a = this.config, _b = _a.microRenderPath, microRenderPath = _b === void 0 ? MICRO_RENDER_PATH : _b, _c = _a.publicPath, publicPath = _c === void 0 ? PUBLIC_PATH : _c;
        return "/".concat(publicPath, "/").concat(microName, "/").concat(microRenderPath).concat(pathname);
    };
    Resource.prototype.generateHtmlTemplate = function () {
        var rex = this.innerHeadFlag;
        var fileResult = this.readFileSync(this.config.index);
        this.htmlTemplate = fileResult ? fileResult.replace(rex, '').replace('</head>', "".concat(rex, "</head>")) : "".concat(rex).concat(this.innerHtmlFlag);
        return this.htmlTemplate;
    };
    Resource.prototype.proxyFetch = function (req_1) {
        return __awaiter(this, arguments, void 0, function (req, init) {
            var res;
            if (init === void 0) { init = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch(req, init)];
                    case 1:
                        res = _a.sent();
                        if ([404, 504].includes(res.status))
                            throw new Error("".concat(res.status, ": ").concat(res.statusText));
                        return [2 /*return*/, res];
                }
            });
        });
    };
    Resource.prototype.readAssetsSync = function () {
        this.assetsConfig = this.assetsConfig || this.readFileSync(this.config.manifestFile) || '{}';
        return JSON.parse(this.assetsConfig);
    };
    Resource.prototype.readStaticFile = function (url) {
        var fileCache = this.filesCache[url];
        if (!this.filesCache[url] || this.isDevelopment) {
            fileCache = { type: 'file-static', source: JSON.parse(this.readFileSync(url) || '{}') };
            this.filesCache[url] = fileCache;
        }
        return fileCache;
    };
    Object.defineProperty(Resource.prototype, "vmContext", {
        get: function () {
            return this.config.vmContext || {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "entryFile", {
        get: function () {
            return this.staticResolve(this.config.entryFile);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "microName", {
        get: function () {
            return this.config.serverName || '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "innerHeadFlag", {
        get: function () {
            return this.config.innerHeadFlag || '<!-- inner-style -->';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "innerHtmlFlag", {
        get: function () {
            return this.config.innerHtmlFlag || '<!-- inner-html -->';
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        Input('ssr'),
        __metadata("design:type", Object)
    ], Resource.prototype, "config", void 0);
    __decorate([
        Inject(SSR_FETCH),
        __metadata("design:type", Function)
    ], Resource.prototype, "ssrFetch", void 0);
    __decorate([
        Inject(SSR_STATIC_FOLDER),
        __metadata("design:type", String)
    ], Resource.prototype, "staticFolder", void 0);
    Resource = __decorate([
        Injectable()
    ], Resource);
    return Resource;
}());
export { Resource };
