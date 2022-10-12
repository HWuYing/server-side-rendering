import { __decorate, __extends } from "tslib";
import { Injectable } from '@fm/di';
import { JsonConfigService as ShareJsonConfigService } from '@fm/shared';
import { AppContextService } from '../app-context';
var JsonConfigService = /** @class */ (function (_super) {
    __extends(JsonConfigService, _super);
    function JsonConfigService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JsonConfigService.prototype.getJsonConfig = function (url) {
        return this.injector.get(AppContextService).readStaticFile(url);
    };
    JsonConfigService = __decorate([
        Injectable()
    ], JsonConfigService);
    return JsonConfigService;
}(ShareJsonConfigService));
export { JsonConfigService };
