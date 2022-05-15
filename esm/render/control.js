import { __decorate, __metadata } from "tslib";
import { Get } from "@fm/server/decorator/injectable-router";
import { Render } from "./render";
export class SSRControl {
    ssrVm;
    constructor(entryFile, options) {
        this.ssrVm = new Render(entryFile, options);
    }
    async renderMicro(request, response) {
        request.params.pathname = request.path.replace(/\/micro-ssr/g, '');
        await this.ssrVm.renderMicro(request, response);
    }
    async render(request, response) {
        await this.ssrVm.render(request, response);
    }
}
__decorate([
    Get('/micro-ssr'),
    Get('/micro-ssr/*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SSRControl.prototype, "renderMicro", null);
__decorate([
    Get('*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SSRControl.prototype, "render", null);
