"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSRControl = void 0;
var tslib_1 = require("tslib");
var server_1 = require("@fm/server");
var consts_1 = require("./consts");
var render_1 = require("./render");
var SSRControl = /** @class */ (function () {
    function SSRControl(entryFile, options) {
        this.ssrVm = new render_1.Render(entryFile, options);
    }
    SSRControl.prototype.renderMicro = function (request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        request.params.pathname = request.path.replace(/\/micro-ssr/g, '');
                        _b = (_a = response).json;
                        return [4 /*yield*/, this.ssrVm.renderMicro(request)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    SSRControl.prototype.render = function (request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, html, status, redirectUrl;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.ssrVm.render(request)];
                    case 1:
                        _a = _b.sent(), html = _a.html, status = _a.status, redirectUrl = _a.redirectUrl;
                        status === '302' ? response.redirect(redirectUrl) : response.end(html);
                        return [2 /*return*/];
                }
            });
        });
    };
    tslib_1.__decorate([
        (0, server_1.Get)(consts_1.prefixMicroPath),
        (0, server_1.Get)("".concat(consts_1.prefixMicroPath, "/*")),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object, Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], SSRControl.prototype, "renderMicro", null);
    tslib_1.__decorate([
        (0, server_1.Get)('*'),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object, Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], SSRControl.prototype, "render", null);
    return SSRControl;
}());
exports.SSRControl = SSRControl;
