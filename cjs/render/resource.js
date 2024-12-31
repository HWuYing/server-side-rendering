"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = exports.SSR_STATIC_FOLDER = exports.SSR_FETCH = exports.MICRO_RENDER_PATH = exports.PUBLIC_PATH = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@hwy-fm/di");
var server_1 = require("@hwy-fm/server");
var fs_1 = tslib_1.__importDefault(require("fs"));
var path_1 = tslib_1.__importDefault(require("path"));
exports.PUBLIC_PATH = 'static';
exports.MICRO_RENDER_PATH = 'micro-ssr';
exports.SSR_FETCH = di_1.InjectorToken.get('SSR_FETCH');
exports.SSR_STATIC_FOLDER = di_1.InjectorToken.get('SSR_STATIC_FOLDER');
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
        return /^\\.[.]*/.test(_path) ? _path : path_1.default.join.apply(path_1.default, tslib_1.__spreadArray([this.staticFolder, _path], other, false));
    };
    Resource.prototype.readFileSync = function (filePath) {
        if (!filePath)
            return;
        var absPath = this.staticResolve(filePath);
        if (!fs_1.default.existsSync(absPath)) {
            console.error("File not found: ".concat(absPath));
            return;
        }
        return fs_1.default.readFileSync(absPath, { encoding: 'utf-8' });
    };
    Resource.prototype.fetch = function (url, init) {
        var _url = url;
        if (typeof url === 'string') {
            _url = /^http(s?)/.test(url) ? url : "".concat(this.config.proxyHost, "/").concat(url.replace(/^[/]+/, ''));
        }
        return this.ssrFetch(_url, init);
    };
    Resource.prototype.getMicroPath = function (microName, pathname) {
        var _a = this.config, _b = _a.microRenderPath, microRenderPath = _b === void 0 ? exports.MICRO_RENDER_PATH : _b, _c = _a.publicPath, publicPath = _c === void 0 ? exports.PUBLIC_PATH : _c;
        return "/".concat(publicPath, "/").concat(microName, "/").concat(microRenderPath).concat(pathname);
    };
    Resource.prototype.generateHtmlTemplate = function () {
        var rex = this.innerHeadFlag;
        var fileResult = this.readFileSync(this.config.index);
        this.htmlTemplate = fileResult ? fileResult.replace(rex, '').replace('</head>', "".concat(rex, "</head>")) : "".concat(rex).concat(this.innerHtmlFlag);
        return this.htmlTemplate;
    };
    Resource.prototype.proxyFetch = function (req_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (req, init) {
            var res;
            if (init === void 0) { init = {}; }
            return tslib_1.__generator(this, function (_a) {
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
    tslib_1.__decorate([
        (0, server_1.Input)('ssr'),
        tslib_1.__metadata("design:type", Object)
    ], Resource.prototype, "config", void 0);
    tslib_1.__decorate([
        (0, di_1.Inject)(exports.SSR_FETCH),
        tslib_1.__metadata("design:type", Function)
    ], Resource.prototype, "ssrFetch", void 0);
    tslib_1.__decorate([
        (0, di_1.Inject)(exports.SSR_STATIC_FOLDER),
        tslib_1.__metadata("design:type", String)
    ], Resource.prototype, "staticFolder", void 0);
    Resource = tslib_1.__decorate([
        (0, di_1.Injectable)()
    ], Resource);
    return Resource;
}());
exports.Resource = Resource;
