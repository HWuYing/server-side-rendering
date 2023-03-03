import { __awaiter } from "tslib";
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { prefixMicroPath } from './consts';
const defaultTarget = 'http://127.0.0.1';
export class Resource {
    constructor({ index, microPrePath = '', manifestFile = '', staticDir = '', proxyTarget }) {
        this.cache = {};
        this._isDevelopment = process.env.NODE_ENV === 'development';
        this.staticDir = staticDir;
        this.microPrePath = microPrePath;
        this.manifestFile = manifestFile;
        this.host = proxyTarget || `${defaultTarget}:${process.env.PORT}`;
        this.index = index || (this.staticDir ? path.join(this.staticDir, 'index.html') : '');
    }
    generateMicroPath(microName, pathname) {
        return `/${this.microPrePath}/${microName}${prefixMicroPath}/${pathname}`.replace(/[/]+/g, '/');
    }
    generateMicroStaticpath(url) {
        return `/${url}`.replace(/[/]+/g, '/');
    }
    generateHtmlTemplate() {
        let template = this.htmlTemplate;
        if (!template) {
            const rex = this.innerHeadFlag;
            template = `${rex}${this.innerHtmlFlag}`;
            if (this.index && fs.existsSync(this.index)) {
                template = fs.readFileSync(this.index, 'utf-8');
                template.replace(rex, '').replace('</head>', `${rex}</head>`);
            }
            this.htmlTemplate = template;
        }
        return template;
    }
    proxyFetch(url, init) {
        return __awaiter(this, void 0, void 0, function* () {
            const _url = /http|https/.test(url) ? url : `${this.host}/${url.replace(/^[/]+/, '')}`;
            const res = yield fetch(_url, init);
            const { status, statusText } = res;
            if (![404, 504].includes(status)) {
                return res;
            }
            throw new Error(`${status}: ${statusText}`);
        });
    }
    readAssetsSync() {
        let assetsResult = this.assetsConfig;
        if (!assetsResult && this.manifestFile && fs.existsSync(this.manifestFile)) {
            assetsResult = fs.readFileSync(this.manifestFile, 'utf-8');
        }
        return JSON.parse(assetsResult || '{}');
    }
    readStaticFile(url) {
        let fileCache = this.cache[url];
        if (!fileCache || this._isDevelopment) {
            const filePath = this.staticDir ? path.join(this.staticDir, url) : '';
            const source = filePath && fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '{}';
            fileCache = { type: 'file-static', source: JSON.parse(source) };
            this.cache[url] = fileCache;
        }
        return fileCache;
    }
    get isDevelopment() {
        return this._isDevelopment;
    }
    get innerHeadFlag() {
        return '<!-- inner-style -->';
    }
    get innerHtmlFlag() {
        return '<!-- inner-html -->';
    }
}
