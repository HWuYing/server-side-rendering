import { __awaiter, __generator } from "tslib";
import fs from 'fs';
var Resource = /** @class */ (function () {
    function Resource(options) {
        this.options = options;
        this.filesCache = {};
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }
    Resource.prototype.getMicroPath = function (microName, pathname) {
        return this.options.getMicroPath(microName, pathname);
    };
    Resource.prototype.generateHtmlTemplate = function () {
        var rex = this.innerHeadFlag;
        var index = this.options.getIndexPath();
        var template = "".concat(rex).concat(this.innerHtmlFlag);
        if (index && fs.existsSync(index)) {
            template = fs.readFileSync(index, 'utf-8').replace(rex, '').replace('</head>', "".concat(rex, "</head>"));
            this.htmlTemplate = template;
        }
        return this.htmlTemplate;
    };
    Resource.prototype.proxyFetch = function (req, init) {
        if (init === void 0) { init = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.options.fetch(req, init)];
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
        var assetsResult = this.assetsConfig;
        var manifestFile = this.options.getManifestFilePath();
        if (!assetsResult && manifestFile && fs.existsSync(manifestFile)) {
            assetsResult = fs.readFileSync(manifestFile, 'utf-8');
        }
        return JSON.parse(assetsResult);
    };
    Resource.prototype.readStaticFile = function (url) {
        var fileCache = this.filesCache[url];
        if (!fileCache || this.isDevelopment) {
            var filePath = this.options.getStaticPath(url);
            var source = filePath && fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '{}';
            fileCache = { type: 'file-static', source: JSON.parse(source) };
            this.filesCache[url] = fileCache;
        }
        return fileCache;
    };
    Object.defineProperty(Resource.prototype, "vmContext", {
        get: function () {
            return this.options.vmContext || {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "entryFile", {
        get: function () {
            return this.options.getEntryPath();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "microName", {
        get: function () {
            return this.options.microName || '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "innerHeadFlag", {
        get: function () {
            return this.options.innerHeadFlag;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "innerHtmlFlag", {
        get: function () {
            return this.options.innerHtmlFlag;
        },
        enumerable: false,
        configurable: true
    });
    return Resource;
}());
export { Resource };
