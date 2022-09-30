import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
export class Resource {
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
        const indexPath = this.staticDir ? path.join(this.staticDir, 'index.html') : '';
        let template = `${rex}${this.innerHtmlFlag}`;
        if (indexPath && fs.existsSync(indexPath)) {
            template = fs.readFileSync(indexPath, 'utf-8');
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
        return fetch(_url, init).then((res) => {
            const { status, statusText } = res;
            if (![404, 504].includes(status)) {
                return res;
            }
            throw new Error(`${status}: ${statusText}`);
        });
    }
    readAssetsSync() {
        let assetsResult = '{}';
        if (this.manifestFile && fs.existsSync(this.manifestFile)) {
            assetsResult = fs.readFileSync(this.manifestFile, 'utf-8');
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
        const filePath = this.staticDir ? path.join(this.staticDir, url) : '';
        const source = filePath && fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '{}';
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
