"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Render = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const module_1 = require("module");
const vm_1 = tslib_1.__importDefault(require("vm"));
class Render {
    entryFile;
    microName;
    _compiledRender;
    vmContext;
    resource;
    isDevelopment = process.env.NODE_ENV === 'development';
    constructor(entryFile, options) {
        this.entryFile = entryFile;
        const { microName, resource } = options;
        this.resource = resource;
        this.microName = microName || '';
        this.vmContext = options.vmContext || {};
    }
    factoryVmScript() {
        const registryRender = (render) => this._compiledRender = render;
        const m = { exports: {}, require: (0, module_1.createRequire)(this.entryFile) };
        const wrapper = module_1.Module.wrap(fs_1.default.readFileSync(this.entryFile, 'utf-8'));
        const script = new vm_1.default.Script(wrapper, { filename: 'server-entry.js', displayErrors: true });
        const timerContext = { setTimeout, setInterval, clearInterval, clearTimeout };
        const vmContext = { Buffer, process, console, registryRender, ...timerContext, ...this.vmContext };
        const context = vm_1.default.createContext(vmContext);
        const compiledWrapper = script.runInContext(context);
        compiledWrapper(m.exports, m.require, m);
    }
    async _render(request, isMicro) {
        try {
            if (this.isDevelopment || !this._compiledRender) {
                this.factoryVmScript();
            }
            return await this._compiledRender({ resource: this.resource, request }, isMicro);
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
        const chunkCss = this.resource.readAssetsSync()['chunk']?.css || [];
        const { html, styles, fetchData, microTags = [], microFetchData = [] } = await this._render(request);
        const _fetchData = this.createScriptTemplate('fetch-static', `var fetchCacheData = ${fetchData};`);
        const microData = this.createScriptTemplate('micro-fetch-static', `var microFetchData = ${JSON.stringify(microFetchData)};`);
        const chunkLinks = chunkCss.map((href) => `<link rel="stylesheet" href="${href}">`).join('');
        const _html = this.resource.generateHtmlTemplate()
            .replace(this.resource.innerHtmlFlag, html)
            .replace(this.resource.innerHeadFlag, `${chunkLinks}${styles}${_fetchData}${microData}${microTags.join('')}`);
        response.send(_html);
    }
}
exports.Render = Render;
