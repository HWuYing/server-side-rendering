"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonConfigService = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var json_config_1 = require("@fm/shared/providers/json-config");
var JsonConfigService = /** @class */ (function (_super) {
    tslib_1.__extends(JsonConfigService, _super);
    function JsonConfigService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JsonConfigService.prototype.getServerFetchData = function (url) {
        return this.appContext.readStaticFile(url);
    };
    JsonConfigService = tslib_1.__decorate([
        (0, di_1.Injectable)()
    ], JsonConfigService);
    return JsonConfigService;
}(json_config_1.JsonConfigService));
exports.JsonConfigService = JsonConfigService;
