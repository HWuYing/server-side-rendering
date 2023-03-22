import { __awaiter } from "tslib";
import fs from 'fs';
import { createRequire, Module as NativeModule } from 'module';
import vm from 'vm';
export class Render {
    constructor(entryFile, { resource, microName = '', vmContext = {} }) {
        this.entryFile = entryFile;
        this.resource = resource;
        this.microName = microName;
        this.vmContext = vmContext;
        this.isDevelopment = resource.isDevelopment;
    }
    factoryVmScript() {
        const registryRender = (render) => this._compiledRender = render;
        const m = { exports: {}, require: createRequire(this.entryFile) };
        const wrapper = NativeModule.wrap(fs.readFileSync(this.entryFile, 'utf-8'));
        const script = new vm.Script(wrapper, { filename: 'server-entry.js', displayErrors: true });
        const timerContext = { setTimeout, setInterval, clearInterval, clearTimeout };
        const vmContext = Object.assign(Object.assign({ Buffer, process, console, registryRender }, timerContext), this.vmContext);
        const compiledScript = script.runInNewContext(vm.createContext(vmContext));
        compiledScript(m.exports, m.require, m);
    }
    _render(request, isMicro) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.isDevelopment || !this._compiledRender) {
                    this.factoryVmScript();
                }
                return yield this._compiledRender({ resource: this.resource, request }, isMicro);
            }
            catch (e) {
                console.log(e);
                return { html: e.message, styles: '' };
            }
        });
    }
    createScriptTemplate(scriptId, insertInfo) {
        const evalFun = `(function(){ const script = document.querySelector('#${scriptId}');script.parentNode.removeChild(script);}());`;
        return `<script id="${scriptId}">${insertInfo}${evalFun}</script>`;
    }
    renderMicro(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, redirectUrl, html, styles, links, microTags, microFetchData = [], fetchData } = yield this._render(request, true);
            microFetchData.push({ microName: this.microName, source: fetchData });
            return { status, redirectUrl, html, styles, links, microTags, microFetchData };
        });
    }
    render(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._render(request);
            const { status, redirectUrl, js = [], links = [], styles, microTags = [], microFetchData = [] } = result;
            const fetchData = this.createScriptTemplate('fetch-static', `var fetchCacheData = ${result.fetchData};`);
            const microData = this.createScriptTemplate('micro-fetch-static', `var microFetchData = ${JSON.stringify(microFetchData)};`);
            const chunkCss = this.isDevelopment ? links : ((_a = this.resource.readAssetsSync()['chunk']) === null || _a === void 0 ? void 0 : _a.css) || [];
            const chunkLinks = chunkCss.map((href) => `<link href="${href}" rel="stylesheet">`).join('');
            let headContent = `${chunkLinks}${styles}${fetchData}${microData}${microTags.join('')}`;
            if (this.isDevelopment) {
                headContent += js.map((src) => `<script defer src="${src}"></script>`).join('');
            }
            const html = this.resource.generateHtmlTemplate()
                .replace(this.resource.innerHtmlFlag, result.html)
                .replace(this.resource.innerHeadFlag, headContent);
            return { html, status, redirectUrl };
        });
    }
}
