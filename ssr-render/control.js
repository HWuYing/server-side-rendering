"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSRControl = void 0;
const tslib_1 = require("tslib");
const injectable_router_1 = require("@fm/server/decorator/injectable-router");
const ssr_render_1 = require("./ssr-render");
class SSRControl {
    ssrVm;
    constructor(entryFile, options) {
        this.ssrVm = new ssr_render_1.SSRRender(entryFile, options);
    }
    async renderMicro(request, response) {
        request.params.pathname = request.path.replace(/\/micro-ssr/g, '');
        await this.ssrVm.renderMicro(request, response);
    }
    async render(request, response) {
        await this.ssrVm.render(request, response);
    }
}
tslib_1.__decorate([
    (0, injectable_router_1.Get)('/micro-ssr'),
    (0, injectable_router_1.Get)('/micro-ssr/*'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SSRControl.prototype, "renderMicro", null);
tslib_1.__decorate([
    (0, injectable_router_1.Get)('*'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SSRControl.prototype, "render", null);
exports.SSRControl = SSRControl;
