import { __awaiter, __decorate, __generator, __metadata } from "tslib";
import { Get } from "@fm/server";
import { Render } from "./render";
var SSRControl = /** @class */ (function () {
    function SSRControl(entryFile, options) {
        this.ssrVm = new Render(entryFile, options);
    }
    SSRControl.prototype.renderMicro = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = response).end;
                        return [4 /*yield*/, this.ssrVm.render(request)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
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
    return SSRControl;
}());
export { SSRControl };
