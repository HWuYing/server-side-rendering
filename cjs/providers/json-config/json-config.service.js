"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonConfigService = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@fm/core");
var di_1 = require("@fm/di");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var app_context_1 = require("../app-context");
var JsonConfigService = /** @class */ (function (_super) {
    tslib_1.__extends(JsonConfigService, _super);
    function JsonConfigService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JsonConfigService.prototype.getJsonConfig = function (url) {
        return (0, rxjs_1.of)((0, lodash_1.cloneDeep)(this.appContext.readStaticFile(url)));
    };
    tslib_1.__decorate([
        (0, di_1.Prop)(app_context_1.AppContextService),
        tslib_1.__metadata("design:type", app_context_1.AppContextService)
    ], JsonConfigService.prototype, "appContext", void 0);
    JsonConfigService = tslib_1.__decorate([
        (0, di_1.Injectable)()
    ], JsonConfigService);
    return JsonConfigService;
}(core_1.JsonConfigService));
exports.JsonConfigService = JsonConfigService;
