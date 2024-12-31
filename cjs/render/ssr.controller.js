"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseSSRControl = void 0;
var tslib_1 = require("tslib");
var server_1 = require("@hwy-fm/server");
var controller_1 = require("@hwy-fm/server/controller");
var lodash_1 = require("lodash");
var _1 = require(".");
var resource_1 = require("./resource");
var microRenderPath;
(0, server_1.runtimeInjector)(function (i) { return microRenderPath = (0, lodash_1.get)(i.get(server_1.APPLICATION_METADATA), 'ssr.microRenderPath', resource_1.MICRO_RENDER_PATH); });
var UseSSRControl = /** @class */ (function () {
    function UseSSRControl(resource) {
        this.renderVm = (0, _1.createSsrVm)(resource);
    }
    UseSSRControl.prototype.renderMicro = function (request) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, html, status, redirectUrl;
            return tslib_1.__generator(this, function (_b) {
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
    tslib_1.__decorate([
        (0, controller_1.Get)((0, controller_1.embedded)(function () { return "".concat(microRenderPath, "/*"); })),
        tslib_1.__param(0, (0, controller_1.Req)()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], UseSSRControl.prototype, "renderMicro", null);
    tslib_1.__decorate([
        (0, controller_1.Get)('*'),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object, Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], UseSSRControl.prototype, "render", null);
    UseSSRControl = tslib_1.__decorate([
        (0, controller_1.Controller)(),
        tslib_1.__metadata("design:paramtypes", [resource_1.Resource])
    ], UseSSRControl);
    return UseSSRControl;
}());
exports.UseSSRControl = UseSSRControl;
