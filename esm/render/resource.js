import { __awaiter } from "tslib";
import fs from 'fs';
export class Resource {
    constructor(options) {
        this.options = options;
        this.filesCache = {};
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }
    getMicroPath(microName, pathname) {
        return this.options.getMicroPath(microName, pathname);
    }
    generateHtmlTemplate() {
        const rex = this.innerHeadFlag;
        const index = this.options.getIndexPath();
        let template = `${rex}${this.innerHtmlFlag}`;
        if (index && fs.existsSync(index)) {
            template = fs.readFileSync(index, 'utf-8').replace(rex, '').replace('</head>', `${rex}</head>`);
            this.htmlTemplate = template;
        }
        return this.htmlTemplate;
    }
    proxyFetch(req_1) {
        return __awaiter(this, arguments, void 0, function* (req, init = {}) {
            const res = yield this.options.fetch(req, init);
            if ([404, 504].includes(res.status))
                throw new Error(`${res.status}: ${res.statusText}`);
            return res;
        });
    }
    readAssetsSync() {
        let assetsResult = this.assetsConfig;
        const manifestFile = this.options.getManifestFilePath();
        if (!assetsResult && manifestFile && fs.existsSync(manifestFile)) {
            assetsResult = fs.readFileSync(manifestFile, 'utf-8');
        }
        return JSON.parse(assetsResult);
    }
    readStaticFile(url) {
        let fileCache = this.filesCache[url];
        if (!fileCache || this.isDevelopment) {
            const filePath = this.options.getStaticPath(url);
            const source = filePath && fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '{}';
            fileCache = { type: 'file-static', source: JSON.parse(source) };
            this.filesCache[url] = fileCache;
        }
        return fileCache;
    }
    get vmContext() {
        return this.options.vmContext || {};
    }
    get entryFile() {
        return this.options.getEntryPath();
    }
    get microName() {
        return this.options.microName || '';
    }
    get innerHeadFlag() {
        return this.options.innerHeadFlag;
    }
    get innerHtmlFlag() {
        return this.options.innerHtmlFlag;
    }
}
