"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonConfigService = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var shared_1 = require("@fm/shared");
var app_context_1 = require("../app-context");
var JsonConfigService = /** @class */ (function (_super) {
    tslib_1.__extends(JsonConfigService, _super);
    function JsonConfigService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JsonConfigService.prototype.getJsonConfig = function (url) {
        return this.injector.get(app_context_1.AppContextService).readStaticFile(url);
    };
    JsonConfigService = tslib_1.__decorate([
        (0, di_1.Injectable)()
    ], JsonConfigService);
    return JsonConfigService;
}(shared_1.JsonConfigService));
exports.JsonConfigService = JsonConfigService;
