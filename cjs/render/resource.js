"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const path_1 = tslib_1.__importDefault(require("path"));
class Resource {
    host;
    staticDir;
    manifestFile;
    microPrePath;
    assetsConfig;
    htmlTemplate;
    cache = {};
    constructor({ microPrePath = '', manifestFile = '', staticDir = '', proxyTarget = 'http://127.0.0.1:3000' }) {
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
        let template = this.htmlTemplate;
        if (!template) {
            const rex = this.innerHeadFlag;
            const indexPath = this.staticDir ? path_1.default.join(this.staticDir, 'index.html') : '';
            template = `${rex}${this.innerHtmlFlag}`;
            if (indexPath && fs_1.default.existsSync(indexPath)) {
                template = fs_1.default.readFileSync(indexPath, 'utf-8');
                template.replace(rex, '').replace('</head>', `${rex}</head>`);
            }
            this.htmlTemplate = template;
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
        let assetsResult = this.assetsConfig;
        if (!assetsResult && this.manifestFile && fs_1.default.existsSync(this.manifestFile)) {
            assetsResult = fs_1.default.readFileSync(this.manifestFile, 'utf-8');
        }
        return JSON.parse(assetsResult || '{}');
    }
    readStaticFile(url) {
        let fileCache = this.cache[url];
        if (!fileCache) {
            const filePath = this.staticDir ? path_1.default.join(this.staticDir, url) : '';
            const source = filePath && fs_1.default.existsSync(filePath) ? fs_1.default.readFileSync(filePath, 'utf-8') : '{}';
            fileCache = { type: 'file-static', source: JSON.parse(source) };
            this.cache[url] = fileCache;
        }
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
