import { __awaiter, __decorate, __generator, __metadata, __param } from "tslib";
import { APPLICATION_METADATA, runtimeInjector } from '@hwy-fm/server';
import { Controller, embedded, Get, Req } from '@hwy-fm/server/controller';
import { get } from 'lodash';
import { createSsrVm } from '.';
import { MICRO_RENDER_PATH, Resource } from './resource';
var microRenderPath;
runtimeInjector(function (i) { return microRenderPath = get(i.get(APPLICATION_METADATA), 'ssr.microRenderPath', MICRO_RENDER_PATH); });
var UseSSRControl = /** @class */ (function () {
    function UseSSRControl(resource) {
        this.renderVm = createSsrVm(resource);
    }
    UseSSRControl.prototype.renderMicro = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request.params.pathname = request.path.replace("/".concat(microRenderPath), '');
                        return [4 /*yield*/, this.renderVm.renderMicro(request)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UseSSRControl.prototype.render = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, html, status, redirectUrl;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.renderVm.render(request)];
                    case 1:
                        _a = _b.sent(), html = _a.html, status = _a.status, redirectUrl = _a.redirectUrl;
                        status === '302' ? response.redirect(redirectUrl) : response.end(html);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Get(embedded(function () { return "".concat(microRenderPath, "/*"); })),
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
    return UseSSRControl;
}());
export { UseSSRControl };
