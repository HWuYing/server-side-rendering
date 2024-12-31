import { __awaiter, __decorate, __metadata } from "tslib";
import { Inject, Injectable, InjectorToken } from '@hwy-fm/di';
import { Input } from '@hwy-fm/server';
import fs from 'fs';
import path from 'path';
export const PUBLIC_PATH = 'static';
export const MICRO_RENDER_PATH = 'micro-ssr';
export const SSR_FETCH = InjectorToken.get('SSR_FETCH');
export const SSR_STATIC_FOLDER = InjectorToken.get('SSR_STATIC_FOLDER');
let Resource = class Resource {
    constructor() {
        this.config = {};
        this.filesCache = {};
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }
    staticResolve(_path, ...other) {
        return /^\\.[.]*/.test(_path) ? _path : path.join(this.staticFolder, _path, ...other);
    }
    readFileSync(filePath) {
        if (!filePath)
            return;
        const absPath = this.staticResolve(filePath);
        if (!fs.existsSync(absPath)) {
            console.error(`File not found: ${absPath}`);
            return;
        }
        return fs.readFileSync(absPath, { encoding: 'utf-8' });
    }
    fetch(url, init) {
        let _url = url;
        if (typeof url === 'string') {
            _url = /^http(s?)/.test(url) ? url : `${this.config.proxyHost}/${url.replace(/^[/]+/, '')}`;
        }
        return this.ssrFetch(_url, init);
    }
    getMicroPath(microName, pathname) {
        const { microRenderPath = MICRO_RENDER_PATH, publicPath = PUBLIC_PATH } = this.config;
        return `/${publicPath}/${microName}/${microRenderPath}${pathname}`;
    }
    generateHtmlTemplate() {
        const rex = this.innerHeadFlag;
        const fileResult = this.readFileSync(this.config.index);
        this.htmlTemplate = fileResult ? fileResult.replace(rex, '').replace('</head>', `${rex}</head>`) : `${rex}${this.innerHtmlFlag}`;
        return this.htmlTemplate;
    }
    proxyFetch(req_1) {
        return __awaiter(this, arguments, void 0, function* (req, init = {}) {
            const res = yield this.fetch(req, init);
            if ([404, 504].includes(res.status))
                throw new Error(`${res.status}: ${res.statusText}`);
            return res;
        });
    }
    readAssetsSync() {
        this.assetsConfig = this.assetsConfig || this.readFileSync(this.config.manifestFile) || '{}';
        return JSON.parse(this.assetsConfig);
    }
    readStaticFile(url) {
        let fileCache = this.filesCache[url];
        if (!this.filesCache[url] || this.isDevelopment) {
            fileCache = { type: 'file-static', source: JSON.parse(this.readFileSync(url) || '{}') };
            this.filesCache[url] = fileCache;
        }
        return fileCache;
    }
    get vmContext() {
        return this.config.vmContext || {};
    }
    get entryFile() {
        return this.staticResolve(this.config.entryFile);
    }
    get microName() {
        return this.config.serverName || '';
    }
    get innerHeadFlag() {
        return this.config.innerHeadFlag || '<!-- inner-style -->';
    }
    get innerHtmlFlag() {
        return this.config.innerHtmlFlag || '<!-- inner-html -->';
    }
};
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
export { Resource };
