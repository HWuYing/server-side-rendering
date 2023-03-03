"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
var tslib_1 = require("tslib");
var fs_1 = tslib_1.__importDefault(require("fs"));
var node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
var path_1 = tslib_1.__importDefault(require("path"));
var consts_1 = require("./consts");
var defaultTarget = 'http://127.0.0.1';
var Resource = /** @class */ (function () {
    function Resource(_a) {
        var index = _a.index, _b = _a.microPrePath, microPrePath = _b === void 0 ? '' : _b, _c = _a.manifestFile, manifestFile = _c === void 0 ? '' : _c, _d = _a.staticDir, staticDir = _d === void 0 ? '' : _d, proxyTarget = _a.proxyTarget;
        this.cache = {};
        this._isDevelopment = process.env.NODE_ENV === 'development';
        this.staticDir = staticDir;
        this.microPrePath = microPrePath;
        this.manifestFile = manifestFile;
        this.host = proxyTarget || "".concat(defaultTarget, ":").concat(process.env.PORT);
        this.index = index || (this.staticDir ? path_1.default.join(this.staticDir, 'index.html') : '');
    }
    Resource.prototype.generateMicroPath = function (microName, pathname) {
        return "/".concat(this.microPrePath, "/").concat(microName).concat(consts_1.prefixMicroPath, "/").concat(pathname).replace(/[/]+/g, '/');
    };
    Resource.prototype.generateMicroStaticpath = function (url) {
        return "/".concat(url).replace(/[/]+/g, '/');
    };
    Resource.prototype.generateHtmlTemplate = function () {
        var template = this.htmlTemplate;
        if (!template) {
            var rex = this.innerHeadFlag;
            template = "".concat(rex).concat(this.innerHtmlFlag);
            if (this.index && fs_1.default.existsSync(this.index)) {
                template = fs_1.default.readFileSync(this.index, 'utf-8');
                template.replace(rex, '').replace('</head>', "".concat(rex, "</head>"));
            }
            this.htmlTemplate = template;
        }
        return template;
    };
    Resource.prototype.proxyFetch = function (url, init) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _url, res, status, statusText;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _url = /http|https/.test(url) ? url : "".concat(this.host, "/").concat(url.replace(/^[/]+/, ''));
                        return [4 /*yield*/, (0, node_fetch_1.default)(_url, init)];
                    case 1:
                        res = _a.sent();
                        status = res.status, statusText = res.statusText;
                        if (![404, 504].includes(status)) {
                            return [2 /*return*/, res];
                        }
                        throw new Error("".concat(status, ": ").concat(statusText));
                }
            });
        });
    };
    Resource.prototype.readAssetsSync = function () {
        var assetsResult = this.assetsConfig;
        if (!assetsResult && this.manifestFile && fs_1.default.existsSync(this.manifestFile)) {
            assetsResult = fs_1.default.readFileSync(this.manifestFile, 'utf-8');
        }
        return JSON.parse(assetsResult || '{}');
    };
    Resource.prototype.readStaticFile = function (url) {
        var fileCache = this.cache[url];
        if (!fileCache || this._isDevelopment) {
            var filePath = this.staticDir ? path_1.default.join(this.staticDir, url) : '';
            var source = filePath && fs_1.default.existsSync(filePath) ? fs_1.default.readFileSync(filePath, 'utf-8') : '{}';
            fileCache = { type: 'file-static', source: JSON.parse(source) };
            this.cache[url] = fileCache;
        }
        return fileCache;
    };
    Object.defineProperty(Resource.prototype, "isDevelopment", {
        get: function () {
            return this._isDevelopment;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "innerHeadFlag", {
        get: function () {
            return '<!-- inner-style -->';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "innerHtmlFlag", {
        get: function () {
            return '<!-- inner-html -->';
        },
        enumerable: false,
        configurable: true
    });
    return Resource;
}());
exports.Resource = Resource;
