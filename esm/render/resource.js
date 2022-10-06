import { __awaiter } from "tslib";
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
export class Resource {
    constructor({ microPrePath = '', manifestFile = '', staticDir = '', proxyTarget = 'http://127.0.0.1:3000' }) {
        this.cache = {};
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
            const indexPath = this.staticDir ? path.join(this.staticDir, 'index.html') : '';
            template = `${rex}${this.innerHtmlFlag}`;
            if (indexPath && fs.existsSync(indexPath)) {
                template = fs.readFileSync(indexPath, 'utf-8');
                template.replace(rex, '').replace('</head>', `${rex}</head>`);
            }
            this.htmlTemplate = template;
        }
        return template;
    }
    proxyFetch(url, init) {
        return __awaiter(this, void 0, void 0, function* () {
            const _url = /http|https/.test(url) ? url : `${this.host}/${url.replace(/^[/]+/, '')}`;
            return fetch(_url, init).then((res) => {
                const { status, statusText } = res;
                if (![404, 504].includes(status)) {
                    return res;
                }
                throw new Error(`${status}: ${statusText}`);
            });
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
        if (!fileCache) {
            const filePath = this.staticDir ? path.join(this.staticDir, url) : '';
            const source = filePath && fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '{}';
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
