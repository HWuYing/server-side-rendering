import { __awaiter, __decorate, __metadata } from "tslib";
import { Get } from "@fm/server";
import { prefixMicroPath } from "./consts";
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
            const { html, status, redirectUrl } = yield this.ssrVm.render(request);
            status === '302' ? response.redirect(redirectUrl) : response.end(html);
        });
    }
}
__decorate([
    Get(prefixMicroPath),
    Get(`${prefixMicroPath}/*`),
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
