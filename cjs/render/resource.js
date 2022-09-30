"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const path_1 = tslib_1.__importDefault(require("path"));
class Resource {
    options;
    host;
    manifestFile;
    microPrePath;
    staticDir;
    cache = {};
    isDevelopment = process.env.NODE_ENV === 'development';
    constructor(options) {
        this.options = options;
        const { microPrePath = '', manifestFile = '', staticDir = '', proxyTarget = 'http://127.0.0.1:3000' } = this.options;
        this.host = proxyTarget;
        this.staticDir = staticDir;
        this.microPrePath = microPrePath;
        this.manifestFile = manifestFile;
    }
    generateMicroPath(microName, pathname) {
        return this.host + `/${this.microPrePath}/${microName}/micro-ssr/${pathname}`.replace(/[/]+/g, '/');
    }
    generateMicroStaticpath(url) {
        return this.host + `/${url}`.replace(/[/]+/g, '/');
    }
    generateHtmlTemplate() {
        const rex = this.innerHeadFlag;
        const indexPath = this.staticDir ? path_1.default.join(this.staticDir, 'index.html') : '';
        let template = `${rex}${this.innerHtmlFlag}`;
        if (indexPath && fs_1.default.existsSync(indexPath)) {
            template = fs_1.default.readFileSync(indexPath, 'utf-8');
            template.replace(rex, '').replace('</head>', `${rex}</head>`);
        }
        if (this.isDevelopment) {
            const { js } = this.serializableAssets();
            const hotResource = js.map((src) => `<script defer src="${src}"></script>`).join('');
            template = template.replace(rex, `${hotResource}${rex}`);
        }
        return template;
    }
    async proxyFetch(url, init) {
        const _url = /http|https/.test(url) ? url : `${this.host}/${url.replace(/^[/]+/, '')}`;
        return (0, node_fetch_1.default)(_url, init).then((res) => {
            const { status, statusText } = res;
            if (![404, 504].includes(status)) {
                return res;
            }
            throw new Error(`${status}: ${statusText}`);
        });
    }
    readAssetsSync() {
        let assetsResult = '{}';
        if (this.manifestFile && fs_1.default.existsSync(this.manifestFile)) {
            assetsResult = fs_1.default.readFileSync(this.manifestFile, 'utf-8');
        }
        return JSON.parse(assetsResult);
    }
    serializableAssets() {
        const entrypoints = this.readAssetsSync();
        const staticAssets = { js: [], links: [], linksToStyle: [] };
        Object.keys(entrypoints).forEach((key) => {
            const { js = [], css = [] } = entrypoints[key];
            staticAssets.js.push(...js);
            staticAssets.links.push(...css);
        });
        return staticAssets;
    }
    readStaticFile(url) {
        const filePath = this.staticDir ? path_1.default.join(this.staticDir, url) : '';
        const source = filePath && fs_1.default.existsSync(filePath) ? fs_1.default.readFileSync(filePath, 'utf-8') : '{}';
        const fileCache = { type: 'file-static', source: JSON.parse(source) };
        this.cache[url] = fileCache;
        return fileCache;
    }
    get innerHeadFlag() {
        return '<!-- inner-style -->';
    }
    get innerHtmlFlag() {
        return '<!-- inner-html -->';
    }
}
exports.Resource = Resource;
