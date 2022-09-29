import fs from 'fs';
import { createRequire, Module as NativeModule } from 'module';
import fetch from 'node-fetch';
import path from 'path';
import vm from 'vm';
export class Render {
    entryFile;
    host;
    index;
    microName;
    microPrePath;
    manifestFile;
    _compiledRender;
    vmContext;
    staticDir;
    isDevelopment = process.env.NODE_ENV === 'development';
    constructor(entryFile, options) {
        this.entryFile = entryFile;
        const { index, manifestFile, staticDir, microName, proxyTarget, microPrePath } = options;
        this.index = index || '';
        this.host = proxyTarget || 'http://127.0.0.1:3000';
        this.staticDir = staticDir || '';
        this.microName = microName || '';
        this.manifestFile = manifestFile;
        this.microPrePath = microPrePath || '';
        this.vmContext = options.vmContext || {};
    }
    microSSRPath(microName, pathname) {
        return `/${this.microPrePath}/${microName}/micro-ssr/${pathname}`;
    }
    proxyFetch(url, init) {
        const _url = /http|https/.test(url) ? url : `${this.host}/${url.replace(/^[/]+/, '')}`;
        return fetch(_url, init).then((res) => {
            const { status, statusText } = res;
            if (![404, 504].includes(status)) {
                return res;
            }
            throw new Error(`${status}: ${statusText}`);
        });
    }
    readAssets() {
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
        let staticDir = this.staticDir;
        if (typeof staticDir === 'function') {
            staticDir = staticDir(url);
        }
        const filePath = staticDir ? path.join(staticDir, url) : '';
        return filePath && fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
    }
    get global() {
        return {
            proxyHost: this.host,
            fetch: this.proxyFetch.bind(this),
            readAssets: this.readAssets.bind(this),
            microSSRPath: this.microSSRPath.bind(this),
            readStaticFile: this.readStaticFile.bind(this)
        };
    }
    readHtmlTemplate() {
        const rex = this.innerHeadFlag;
        let template = `${rex}${this.innerHtmlFlag}`;
        if (this.index && fs.existsSync(this.index)) {
            template = fs.readFileSync(this.index, 'utf-8');
            template.replace(rex, '').replace('</head>', `${rex}</head>`);
        }
        if (this.isDevelopment) {
            const { js } = this.readAssets();
            const hotResource = js.map((src) => `<script defer src="${src}"></script>`).join('');
            template = template.replace(rex, `${hotResource}${rex}`);
        }
        return template;
    }
    readAssetsSync() {
        let assetsResult = '{}';
        if (this.manifestFile && fs.existsSync(this.manifestFile)) {
            assetsResult = fs.readFileSync(this.manifestFile, 'utf-8');
        }
        return JSON.parse(assetsResult);
    }
    factoryVmScript() {
        const registryRender = (render) => this._compiledRender = render;
        const m = { exports: {}, require: createRequire(this.entryFile) };
        const wrapper = NativeModule.wrap(fs.readFileSync(this.entryFile, 'utf-8'));
        const script = new vm.Script(wrapper, { filename: 'server-entry.js', displayErrors: true });
        const timerContext = { setTimeout, setInterval, clearInterval, clearTimeout };
        const vmContext = { Buffer, process, console, registryRender, ...timerContext, ...this.vmContext };
        const context = vm.createContext(vmContext);
        const compiledWrapper = script.runInContext(context);
        compiledWrapper(m.exports, m.require, m);
    }
    async _render(request, isMicro) {
        try {
            if (this.isDevelopment || !this._compiledRender) {
                this.factoryVmScript();
            }
            return await this._compiledRender({ ...this.global, request }, isMicro);
        }
        catch (e) {
            console.log(e);
            return { html: e.message, styles: '' };
        }
    }
    createScriptTemplate(scriptId, insertInfo) {
        const evalFun = `(function(){ const script = document.querySelector('#${scriptId}');script.parentNode.removeChild(script);}());`;
        return `<script id="${scriptId}">${insertInfo}${evalFun}</script>`;
    }
    async renderMicro(request, response) {
        const { html, styles, links, js, fetchData, microTags, microFetchData = [] } = await this._render(request, true);
        microFetchData.push({ microName: this.microName, source: fetchData });
        response.json({ html, styles, links, js, microTags, microFetchData });
    }
    async render(request, response) {
        const { html, styles, fetchData, microTags = [], microFetchData = [] } = await this._render(request);
        const _fetchData = this.createScriptTemplate('fetch-static', `var fetchCacheData = ${fetchData};`);
        const microData = this.createScriptTemplate('micro-fetch-static', `var microFetchData = ${JSON.stringify(microFetchData)};`);
        const chunkLinks = (this.readAssetsSync()['chunk']?.css || []).map((href) => `<link rel="stylesheet" href="${href}">`).join('');
        const _html = this.readHtmlTemplate()
            .replace(this.innerHtmlFlag, html)
            .replace(this.innerHeadFlag, `${chunkLinks}${styles}${_fetchData}${microData}${microTags.join('')}`);
        response.send(_html);
    }
    get innerHeadFlag() {
        return '<!-- inner-style -->';
    }
    get innerHtmlFlag() {
        return '<!-- inner-html -->';
    }
}
