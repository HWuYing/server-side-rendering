import { __awaiter, __decorate, __metadata } from "tslib";
import { Get } from "@fm/server/decorator/injectable-router";
import { Render } from "./render";
export class SSRControl {
    constructor(entryFile, options) {
        this.ssrVm = new Render(entryFile, options);
    }
    renderMicro(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            request.params.pathname = request.path.replace(/\/micro-ssr/g, '');
            response.json(yield this.ssrVm.renderMicro(request));
        });
    }
    render(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            response.end(yield this.ssrVm.render(request));
        });
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
