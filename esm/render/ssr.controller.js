import { __awaiter, __decorate, __metadata, __param } from "tslib";
import { APPLICATION_METADATA, runtimeInjector } from '@hwy-fm/server';
import { Controller, embedded, Get, Req } from '@hwy-fm/server/controller';
import { get } from 'lodash';
import { createSsrVm } from '.';
import { MICRO_RENDER_PATH, Resource } from './resource';
let microRenderPath;
runtimeInjector(i => microRenderPath = get(i.get(APPLICATION_METADATA), 'ssr.microRenderPath', MICRO_RENDER_PATH));
let UseSSRControl = class UseSSRControl {
    constructor(resource) {
        this.renderVm = createSsrVm(resource);
    }
    renderMicro(request) {
        return __awaiter(this, void 0, void 0, function* () {
            request.params.pathname = request.path.replace(`/${microRenderPath}`, '');
            return yield this.renderVm.renderMicro(request);
        });
    }
    render(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { html, status, redirectUrl } = yield this.renderVm.render(request);
            status === '302' ? response.redirect(redirectUrl) : response.end(html);
        });
    }
};
__decorate([
    Get(embedded(() => `${microRenderPath}/*`)),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UseSSRControl.prototype, "renderMicro", null);
__decorate([
    Get('*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UseSSRControl.prototype, "render", null);
UseSSRControl = __decorate([
    Controller(),
    __metadata("design:paramtypes", [Resource])
], UseSSRControl);
export { UseSSRControl };
